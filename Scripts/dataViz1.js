const url = 'https://live-golf-data.p.rapidapi.com/stats?year=2024&statId=186';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '032dd8c81emshafa07143ef94c8ap181e29jsna5b43f130dc6',
        'x-rapidapi-host': 'live-golf-data.p.rapidapi.com'
    }
};

fetch(url, options)
    .then(response => response.json())
    .then(data => {
        const rankings = data.rankings;
        //console.log(rankings); 
        initializeChart(rankings);
    })
    .catch(error => console.error('Error fetching data:', error));

function initializeChart(data) {
    let svg = d3.select("#chart"),
        margin = {top: 20, right: 10, bottom: 40, left: 120},
        width = +svg.attr("width") - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleBand().range([0, height]).padding(0.1); 

    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    d3.select("#playerRange").on("change", function() {
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
            .on("mouseover", function(event, d) {
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
            .on("mouseout", () => tooltip.style("opacity", 0));

        bars.transition().duration(1000)
            .attr("y", (d, i) => y(d.fullName) + (padding / 2))
            .attr("width", d => x(+d.avgPoints.$numberDouble))
            .attr("height", barHeight); 

        bars.exit().remove();

        chart.selectAll(".x-axis").remove();
        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chart.selectAll(".y-axis").remove();
        chart.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));
    }
}


