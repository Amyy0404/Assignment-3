const url = 'https://live-golf-data.p.rapidapi.com/stats?year=2024&statId=186';
const options = {
    method: 'GET',
    // Set up the options for the fetch call, including authorization headers
    headers: {
     'x-rapidapi-key': '12678f2e2fmshef95f02faa67002p1b1685jsnecbc1d154998',
     'x-rapidapi-host': 'live-golf-data.p.rapidapi.com'
    }
};

fetch(url, options)
    .then(response => response.json())
    .then(data => {
     const rankings = data.rankings;
      // Extract rankings from the fetched data to initialize the chart
     initializeChart(rankings);
    })
    .catch(error => console.error('Error fetching data:', error));

function initializeChart(data) {
    // Set up the chart area with background and border styling for better visibility
    let svg = d3
     .select("#chart")
     .style("background-color", "rgb(247,237,217)")  
     .style("border-radius", "3px");  

    // Define margins and calculate the chart's dimensions to allow for axes
    let margin = { top: 20, right: 10, bottom: 40, left: 120 },
        width = +svg.attr("width") - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    // Create a group for the chart elements, positioning it within the SVG
    let chart = svg.append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleBand().range([0, height]).padding(0.2);

    // Initialize a tooltip for displaying additional information on hover
    let tooltip = d3
     .select("body").append("div")
     .attr("class", "tooltip")
     // Apply tooltip styles for better visibility and user interaction
     .style("background-color", "#574237")  
     .style("color", "rgb(255, 255, 255)") 
     .style("padding", "10px") 
     .style("border-radius", "5px")
     .style("font-size", "15px") 
     .style("font-family", "'CustomFont3', sans-serif") 
     .style("position", "absolute")  
     .style("pointer-events", "none")  
     .style("z-index", 10);

    d3.select("#playerRange")
    // Style the player range selector for a consistent look with the chart
     .style("font-size", "18px")
     .style("font-family", "CustomFont4, sans-serif") 
     .style("font-weight", "bolder") 
     .style("margin", "10px")
     .style("width", "150px") 
     .style("height", "30px")  
     .style("background-color", "rgb(247,237,217)") 
     .style("color", "#285f3f")  
     .style("border-radius", "3px")  
     .style("padding", "5px"); 

    // Update the chart when the user selects a different number of players to display
    d3.select("#playerRange").on("change", function () {
     let topN = +this.value;
     updateChart(data.slice(0, topN));
    });

    updateChart(data.slice(0, 10));

    function updateChart(selectedData) {
        selectedData.forEach(d => {
         // Ensure totalPoints is formatted correctly for display, defaulting to 0 if invalid
         d.totalPoints = typeof d.totalPoints === 'number' ? d.totalPoints.toFixed(2) : 0;
        });

        // Set the domains for the axes based on the selected data to ensure accurate scaling
        x.domain([0, d3.max(selectedData, d => +d.avgPoints.$numberDouble) + 10]);
        y.domain(selectedData.map(d => d.fullName));

        // Bind the selected data to the bar elements
        let bars = chart
         .selectAll(".bar")
         .data(selectedData, d => d.fullName);

        let padding = 5;
        let barHeight = y.bandwidth() - padding;

        bars.enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", 0)
         .attr("y", (d, i) => y(d.fullName) + (padding / 2))
         .attr("width", d => x(+d.avgPoints.$numberDouble))
         .attr("height", barHeight)
         .style("fill", "#93695d")  
         .style("transform", "translateX(100px)")
         // Change the bar color on hover for better user interaction
         .on("mouseover", function (event, d) {
             d3.select(this)
              .style("fill", "rgb(174, 159, 142)"); 

             let rank = d.rank && d.rank.$numberInt !== undefined ? d.rank.$numberInt : 'N/A';
             let events = d.events && d.events.$numberInt !== undefined ? d.events.$numberInt : 'N/A';
             let avgPoints = d.avgPoints && d.avgPoints.$numberDouble !== undefined
                 ? Math.round(d.avgPoints.$numberDouble) : 0;

             let pointsGained = d.pointsGained && d.pointsGained.$numberDouble !== undefined
                 ? Math.round(d.pointsGained.$numberDouble) : 0;

             // Display tooltip with detailed information about the player when hovering over a bar
             tooltip.style("opacity", 1)
                 .html(`Name: ${d.fullName}<br>Rank: ${rank}<br>Average Points: ${avgPoints}<br>Events: ${events}<br>Points Gained: ${pointsGained}`)
                 .style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 28) + "px");
         })
         .on("mouseout", function () {
             d3.select(this).style("fill", "#93695d"); 
             tooltip.style("opacity", 0);
         });

        // Animate changes in the bars for a smoother visual transition
        bars.transition()
         .duration(1000)
         .attr("y", (d, i) => y(d.fullName) + (padding / 2))
         .attr("width", d => x(+d.avgPoints.$numberDouble))
         .attr("height", barHeight);

        // Remove any bars that are no longer in the data set to keep the chart up-to-date
        bars.exit().remove();

        // Append x-axis and style it to match the overall aesthetic of the chart
        chart.selectAll(".x-axis").remove();
        chart.append("g")
         .attr("class", "x-axis")
         .attr("transform", `translate(0,${height})`)
         .call(d3.axisBottom(x))
         .selectAll("line")
         .style("stroke", "rgb(247,237,217)") 
         .selectAll("path")
         .style("stroke", "rgb(247,237,217)");

        // Append y-axis and format the text for readability and consistency with the chart theme
        chart.selectAll(".y-axis").remove();
        chart.append("g")
         .attr("class", "y-axis")
         .call(d3.axisLeft(y))
         .selectAll("text")
         .style("fill", "rgb(28, 34, 53)")  
         .style("font-family", "'CustomFont3', sans-serif") 
         .style("font-size", "17px") 
         .style("font-weight", "bolder") 
         .style("transform", "translateX(70px)")  
         .style("text-transform", "uppercase"); 
    }
}
