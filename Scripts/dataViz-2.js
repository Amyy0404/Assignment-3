const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';

// Configure options for the API request, including necessary headers for authentication
const options = {
	method: 'GET',
	headers: {
	 'x-rapidapi-key': '12678f2e2fmshef95f02faa67002p1b1685jsnecbc1d154998',
	 'x-rapidapi-host': 'live-golf-data.p.rapidapi.com'
	}
};

// Fetch the data from the API
fetch(url, options)
 .then(response => response.json())
 .then(data => {
     // Create bubbles for the bubble chart using the fetched schedule data
     createBubbles(data.schedule);

     //console.log(data); 
 })
 .catch(error => console.error('Error:', error));

// Set dimensions for the SVG container of the bubble chart
let HEIGHT = 1000,
    WIDTH = 1500;

// Create the SVG element and style it for proper display in the container
let svg = d3
 .select("#bubble-chart")
 .append("svg")
 .attr("height", HEIGHT)
 .attr("width", WIDTH)
 .style("display", "block")// Ensure the SVG is block-level for proper centering
 .style("margin", "0 auto");

// Define a scaling function for bubble radius based on purse values
let rScale = d3.scaleSqrt().range([5, 50]); 

// Define a color scale for bubbles based on names
let colorScale = d3.scaleOrdinal()
 .range(["#e3d3bc", "#bb9d87", "#bcc4b5", "#e4e6e2", "#629f74", "#dadfc6"]);

// Configure forces for the simulation to manage bubble positioning
const forceX = d3.forceX(WIDTH / 2).strength(0.05);
const forceY = d3.forceY(HEIGHT * 0.4).strength(0.05);
const collideForce = d3.forceCollide(d => rScale(d.purse.$numberInt) + 2);// Prevent overlaps between bubbles
const manyBody = d3.forceManyBody().strength(-30);// Apply repulsion to bubbles to space them out

// Initialize the D3 force simulation
const simulation = d3
 .forceSimulation()
 .force("x", forceX)
 .force("y", forceY)
 .force("collide", collideForce)
 .force("charge", manyBody);

function createBubbles(data) {
 rScale.domain([0, d3.max(data, d => d.purse.$numberInt)]);

 let bubbles = svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("r", d => rScale(d.purse.$numberInt))
     .style("fill", d => colorScale(d.name))
     .style("transition", "all 0.3s ease")
     .on("mouseover", function (event, d) {
         d3.select(this)
          .style("stroke", "#333") 
          .style("stroke-width", "2px")
          .attr("r", rScale(d.purse.$numberInt) * 1.3);// Enlarge bubble radius on hover
          showTooltip(d);// Display tooltip with additional information
     })
     .on("mouseout", function () {
         d3.select(this)// Reset bubble style when mouse leaves
          .style("stroke-width", null)
          .attr("r", d => rScale(d.purse.$numberInt))
          hideTooltip();// Hide tooltip
     });

    // Update bubble positions during simulation ticks
    simulation.nodes(data).on("tick", function () {
     bubbles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    });

    simulation.force("x", forceX).alpha(0.9).restart();
}

// Create a tooltip for displaying bubble information
let tooltip = d3
 .select("body")
 .append("div")
 .attr("class", "tooltip")
 .style("position", "absolute")
 .style("font-family", "'CustomFont3', sans-serif") 
 .style("background-color", "#285f3f")
 .style("padding", "10px")
 .style("border-radius", "3px")
 .style("visibility", "hidden")
 .style("color", "white")
 .style("font-size", "17px")
 .style("pointer-events", "none");// Prevent tooltip from interfering with mouse events

// Function to show tooltip with relevant data on hover
function showTooltip(d) {
 const purse = d.purse?.$numberInt || 'N/A'; 
 const winnersShare = d.winnersShare?.$numberInt || 'N/A'; 

 tooltip.html(`<strong>${d.name}</strong><br>Purse: $${purse}<br>Winners Share: $${winnersShare}`)
     .style("visibility", "visible")
     .style("left", `${event.pageX + 10}px`)
     .style("top", `${event.pageY + 10}px`);
}

// Function to hide tooltip when not hovering
function hideTooltip() {
  tooltip.style("visibility", "hidden");// Set tooltip visibility to hidden
}

