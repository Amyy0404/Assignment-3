const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '7ba9920b3dmshe6e897753e51f7cp1ffd51jsn666073a40baf',
		'x-rapidapi-host': 'live-golf-data.p.rapidapi.com'
	}
};

fetch(url, options)
    .then(response => response.json())
    .then(data => {
        createBubbles(data.schedule);
        //console.log(data); 
    })
    .catch(error => console.error('Error:', error));

let HEIGHT = 1000,
    WIDTH = 1500;

let svg = d3.select("#bubble-chart")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH)
    .style("display", "block")
    .style("margin", "0 auto");

let rScale = d3.scaleSqrt().range([5, 50]); 
let colorScale = d3.scaleOrdinal()
    .range(["#e3d3bc", "#bb9d87", "#bcc4b5", "#e4e6e2", "#629f74", "#dadfc6"]);

const forceX = d3.forceX(WIDTH / 2).strength(0.05);
const forceY = d3.forceY(HEIGHT * 0.4).strength(0.05);
const collideForce = d3.forceCollide(d => rScale(d.purse.$numberInt) + 2);
const manyBody = d3.forceManyBody().strength(-30);

const simulation = d3.forceSimulation()
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
        .on("mouseover", function (event, d) {
            showTooltip(d);
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", null);
            hideTooltip();
        });

    simulation.nodes(data).on("tick", function () {
        bubbles.attr("cx", d => d.x)
               .attr("cy", d => d.y);
    });

    simulation.force("x", forceX).alpha(0.9).restart();
}

let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#285f3f")
    .style("padding", "10px")
    .style("border-radius", "2px")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("font-size", "14px")
    .style("pointer-events", "none");

function showTooltip(d) {
    tooltip.html(`<strong>${d.name}</strong><br>Purse: $${d.purse.$numberInt}<br>Winners Share: $${d.winnersShare.$numberInt}`)
        .style("visibility", "visible")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
}

function hideTooltip() {
    tooltip.style("visibility", "hidden");
}

