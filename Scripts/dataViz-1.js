const url = 'https://live-golf-data.p.rapidapi.com/stats?year=2024&statId=186';
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
        const rankings = data.rankings;
        initializeChart(rankings);
    })
    .catch(error => console.error('Error fetching data:', error));

function initializeChart(data) {
    let svg = d3.select("#chart")
        .style("background-color", "rgb(247,237,217)")  
        .style("border-radius", "3px");  

    let margin = { top: 20, right: 10, bottom: 40, left: 120 },
        width = +svg.attr("width") - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleBand().range([0, height]).padding(0.2);

    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("background-color", "#285f3f")  
        .style("color", "rgb(255, 255, 255)") 
        .style("padding", "10px") 
        .style("border-radius", "5px")
        .style("font-size", "15px") 
        .style("font-family", "'CustomFont3', sans-serif") 
        .style("position", "absolute")  
        .style("pointer-events", "none")  
        .style("z-index", 10);

    d3.select("#playerRange")
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

    d3.select("#playerRange").on("change", function () {
        let topN = +this.value;
        updateChart(data.slice(0, topN));
    });

    updateChart(data.slice(0, 10));

    function updateChart(selectedData) {
        selectedData.forEach(d => {
            d.totalPoints = typeof d.totalPoints === 'number' ? d.totalPoints.toFixed(2) : 0;
        });

        x.domain([0, d3.max(selectedData, d => +d.avgPoints.$numberDouble) + 10]);
        y.domain(selectedData.map(d => d.fullName));

        let bars = chart.selectAll(".bar")
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
            .style("fill", "rgb(28, 34, 53)")  
            .style("transform", "translateX(100px)")
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill", "rgb(174, 159, 142)"); 

                let rank = d.rank && d.rank.$numberInt !== undefined ? d.rank.$numberInt : 'N/A';

                let events = d.events && d.events.$numberInt !== undefined ? d.events.$numberInt : 'N/A';

                let avgPoints = d.avgPoints && d.avgPoints.$numberDouble !== undefined
                    ? Math.round(d.avgPoints.$numberDouble) : 0;

                let pointsGained = d.pointsGained && d.pointsGained.$numberDouble !== undefined
                    ? Math.round(d.pointsGained.$numberDouble) : 0;

                tooltip.style("opacity", 1)
                    .html(`Name: ${d.fullName}<br>Rank: ${rank}<br>Avergae Points: ${avgPoints}<br>Events: ${events}<br>Points Gained: ${pointsGained}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).style("fill", "rgb(28, 34, 53)"); 
                tooltip.style("opacity", 0);
            });

        bars.transition().duration(1000)
            .attr("y", (d, i) => y(d.fullName) + (padding / 2))
            .attr("width", d => x(+d.avgPoints.$numberDouble))
            .attr("height", barHeight);

        bars.exit().remove();

        chart.selectAll(".x-axis").remove();
        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("line")
            .style("stroke", "rgb(247,237,217)") 
            .selectAll("path")
            .style("stroke", "rgb(247,237,217)");

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
