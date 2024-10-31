const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '12678f2e2fmshef95f02faa67002p1b1685jsnecbc1d154998', // Replace with your API key
        'x-rapidapi-host': 'live-golf-data.p.rapidapi.com'
    }
};

let processedData = [];

// Fetch data and process it
fetch(url, options)
    .then(response => response.json())
    .then(data => {
        processedData = data.schedule.map(d => ({
            ...d,
            winnersShare: d.winnersShare?.$numberInt ? parseInt(d.winnersShare.$numberInt) : null
        }));
        updateRadialChart();
    })
    .catch(error => console.error('Error:', error));

// SVG setup
let WIDTH = 1500, HEIGHT = 800;
let svg = d3.select("#radial-chart")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("display", "block")
    .style("margin", "0 auto");

let centerX = WIDTH / 2;
let centerY = HEIGHT / 2.2;

// Radial layers with base radii and thresholds
const layers = [
    { min: 4000000, max: 4500000, baseRadius: 300, threshold: 8 },
    { min: 3000000, max: 3999999, baseRadius: 240, threshold: 6 },
    { min: 2000000, max: 2999999, baseRadius: 180, threshold: 4 },
    { min: 1000000, max: 1999999, baseRadius: 120, threshold: 2 },
    { min: 0, max: 999999, baseRadius: 60, threshold: 1 }
];

// Slider for expansion
let expansionFactor = 1;

const slider = d3.select("body")
    .append("input")
    .attr("type", "range")
    .attr("min", 1)
    .attr("max", 10)
    .attr("value", 1)
    .style("position", "absolute")
    .style("left", "50%")
    .style("transform", "translateX(-50%)")
    .on("input", function () {
        expansionFactor = +this.value;
        updateRadialChart();
    });

// Update function for radial chart
function updateRadialChart() {
    svg.selectAll("circle.layer").remove();
    svg.selectAll("circle.data-point").remove();

    // Draw radial layers
    layers.forEach((layer, index) => {
        // Calculate effective radius
        let effectiveRadius = layer.baseRadius;
        let currentOpacity = 1; // Default opacity

        // Expand layers based on slider value
        if (expansionFactor > index) {
            effectiveRadius += (expansionFactor - index) * 20; // Expand layers
        }

        // Adjust opacity based on expansionFactor
        if (expansionFactor >= layers.length - 1 && index === layers.length - 1) {
            currentOpacity = 1; // Keep last layer visible
        } else if (expansionFactor >= index + 4) {
            currentOpacity = 0; // Fully fade out
        } else {
            currentOpacity = 1 - (expansionFactor - index) / (layers.length - 1); // Fade out gradually
        }

        // Draw layer
        svg.append("circle")
            .attr("class", "layer")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", effectiveRadius)
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-dasharray", "4 2")
            .style("opacity", currentOpacity);
    });

    // Place data points, expanding based on their respective layers
    processedData.forEach((d, i) => {
        const layer = layers.find(layer => d.winnersShare >= layer.min && d.winnersShare <= layer.max);
        if (!layer) return;

        // Calculate radius for data points
        let radius = layer.baseRadius;

        if (expansionFactor > layers.indexOf(layer)) {
            radius += (expansionFactor - layers.indexOf(layer)) * 20; // Expand data points based on expansion factor
        }

        const angle = i * (2 * Math.PI) / processedData.length;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Apply opacity to the dots
        let dotOpacity = 1; // Default opacity
        if (expansionFactor >= layers.indexOf(layer) + 4) {
            dotOpacity = 0; // Fully fade out if expansionFactor exceeds the current layer
        } else {
            dotOpacity = 1 - (expansionFactor - layers.indexOf(layer)) / (layers.length - 1); // Fade out gradually
        }

        svg.append("circle")
            .attr("class", "data-point")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 8)
            .style("fill", getColor(d.winnersShare))
            .style("opacity", dotOpacity)  // Set opacity for data points
            .style("cursor", "pointer")
            .on("mouseover", function (event) {
                d3.select(this).attr("r", 12);
                showTooltip(event, d);
            })
            .on("mouseout", function () {
                d3.select(this).attr("r", 8);
                hideTooltip();
            });
    });
}

// Color function for data points based on winner's share
function getColor(winnersShare) {
    if (winnersShare >= 4000000) return "#f7a440";
    if (winnersShare >= 3000000) return "#a4c8a8";
    if (winnersShare >= 2000000) return "#d4a5a5";
    if (winnersShare >= 1000000) return "#8ea1a8";
    return "#ffc107";
}

// Tooltip setup
let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#333")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("visibility", "hidden");

function showTooltip(event, d) {
    tooltip.html(`<strong>${d.name}</strong><br>Winner's Share: $${d.winnersShare || 'N/A'}`)
        .style("visibility", "visible")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
}

function hideTooltip() {
    tooltip.style("visibility", "hidden");
}
