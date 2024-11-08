const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '5723e04825msh816004be5752d8fp19fa84jsnbe9795b17e33', // API key 
        'x-rapidapi-host': 'live-golf-data.p.rapidapi.com' 
    }
};

let processedData = [];
let selectedFedexPoints = ["100-300"]; 

// Update the selected FedEx points 
function updateSelectedFedexPoints() {
    selectedFedexPoints = Array.from(document.querySelectorAll('.fedex-checkbox:checked')).map(checkbox => checkbox.value);
    updateRadialChart(); // Update chart 
}

d3.selectAll('.fedex-checkbox').on('change', updateSelectedFedexPoints);

// Show loading screen while fetching data
document.getElementById('loading-screen').style.display = 'flex';

// Fetch data from API
fetch(url, options)
    .then(response => response.json())
    .then(data => {
        processedData = data.schedule.map(d => ({
            ...d,
            winnersShare: d.winnersShare?.$numberInt ? parseInt(d.winnersShare.$numberInt) : null
        }));
        
        updateRadialChart(); // Update chart with processed data

        // Hide loading screen after data is fetched
        document.getElementById('loading-screen').style.display = 'none';

        // Set all checkboxes as checked
        document.querySelectorAll('.fedex-checkbox').forEach(checkbox => checkbox.checked = true);
        updateSelectedFedexPoints(); // Update chart with selected FedEx points
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading-screen').style.display = 'none';
    });

// Set up chart
let WIDTH = 1500, HEIGHT = 700;
let svg = d3.select("#radial-chart")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("display", "block")
    .style("margin", "0 auto");

let centerX = WIDTH / 2;
let centerY = HEIGHT / 2;

// Define layers based on winner's share
const layers = [
    { min: 4000000, max: 4500000, baseRadius: 330, threshold: 8 },
    { min: 3000000, max: 3999999, baseRadius: 250, threshold: 6 },
    { min: 1000000, max: 1999999, baseRadius: 170, threshold: 2 },
    { min: 0, max: 999999, baseRadius: 90, threshold: 1 }
];

// Expansion factor to scale the chart
let expansionFactor = 1;

// Create a slider for expanding chart layers
const slider = d3.select("body")
    .append("input")
    .attr("type", "range")
    .attr("min", 1)
    .attr("max", layers.length) 
    .attr("value", 1)
    .style("position", "absolute")
    .style("top", "400px") 
    .style("left", "10%")
    .style("transform", "translateX(-50%)")
    .on("input", function () {
        const newExpansionFactor = +this.value;
        if (!areAllDotsOnSameLayer(newExpansionFactor)) {
            expansionFactor = newExpansionFactor;
            updateRadialChart(); // Update chart on slider change
        } else {
            this.value = expansionFactor; 
        }
    });

// Update the radial chart with the latest data and selected points
function updateRadialChart() {
    svg.selectAll("circle.layer").remove();
    svg.selectAll("circle.data-point").remove();

    // Loop through layers and draw them on the chart
    layers.forEach((layer, index) => {
        let effectiveRadius = layer.baseRadius + (expansionFactor - 1) * 5 * index;
        let currentOpacity = 1;

        // Adjust opacity based on the expansion factor
        if (layer.min === 4000000) {
            currentOpacity = 1; 
        } else if (expansionFactor >= index + 4) {
            currentOpacity = 0;
        } else {
            currentOpacity = 1 - (expansionFactor - index) / (layers.length - 1);
        }

        svg.append("circle")
            .attr("class", "layer")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", effectiveRadius)
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-dasharray", "4 2")
            .style("opacity", currentOpacity)
            .transition()
            .duration(800);
    });

    // Filter data based on selected FedEx points range
    const filteredData = processedData.filter(d => {
        const points = d.fedexCupPoints?.$numberInt ? parseInt(d.fedexCupPoints.$numberInt) : null;
        if (selectedFedexPoints.includes("100-300") && points >= 100 && points <= 300) return true;
        if (selectedFedexPoints.includes("400-600") && points >= 400 && points <= 600) return true;
        if (selectedFedexPoints.includes("700+") && points >= 700) return true;
        return false;
    });

    // Loop through filtered data and create circles for data points
    filteredData.forEach((d, i) => {
        const layer = layers.find(layer => d.winnersShare >= layer.min && d.winnersShare <= layer.max);
        if (!layer) return;

        let targetLayerIndex = (expansionFactor >= layers.length) ? 0 : layers.indexOf(layer);
        if (expansionFactor >= layers.length) {
            targetLayerIndex = layers.findIndex(l => l.min === 4000000);
        }

        let initialRadius = layers[targetLayerIndex].baseRadius + (expansionFactor - 1) * 20 * targetLayerIndex;
        const angle = i * (2 * Math.PI) / filteredData.length + 2;
        const x = centerX + Math.cos(angle) * initialRadius;
        const y = centerY + Math.sin(angle) * initialRadius;

        // Set dot size based on winner's share
        const dotSize = d.winnersShare ? Math.max(6, d.winnersShare / 200000) : 5;

        // Add circle for each data point 
        svg.append("circle")
            .attr("class", "data-point")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", dotSize)
            .style("fill", getColor(d.winnersShare))
            .style("cursor", "pointer")
            .on("mouseover", function (event) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", dotSize + 6)
                    .style("fill", darkenColor(getColor(d.winnersShare), 0.2))
                showTooltip(event, d); // Show tooltip on hover
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", dotSize)
                    .style("fill", getColor(d.winnersShare));
                hideTooltip(); // Hide tooltip when mouse leaves
            });
    });

    // Adjust data point positions if expansion factor exceeds layers
    if (expansionFactor >= layers.length) {
        const targetRadius = layers.find(layer => layer.min === 4000000)?.baseRadius || 0;

        svg.selectAll("circle.data-point")
            .transition()
            .duration(800)
            .attr("cx", (d, i) => centerX + Math.cos((i * (2 * Math.PI)) / processedData.length) * targetRadius)
            .attr("cy", (d, i) => centerY + Math.sin((i * (2 * Math.PI)) / processedData.length) * targetRadius);
    }
}

// Determine the color of the dot 
function getColor(winnersShare) {
    if (winnersShare >= 4000000) return "#e3d3bc";
    if (winnersShare >= 3000000) return "#bb9d87";
    if (winnersShare >= 2000000) return "#bcc4b5";
    if (winnersShare >= 1000000) return "#629f74";
    return "#dadfc6";
}

// Check if all data points are on the same layer
function areAllDotsOnSameLayer(expansionFactor) {
    const layerIndices = processedData.map(d => {
        const layer = layers.find(layer => d.winnersShare >= layer.min && d.winnersShare <= layer.max);
        return layer ? layers.indexOf(layer) : -1; 
    });

    const firstIndex = layerIndices[0];
    return layerIndices.every(index => index === firstIndex);
}

// Darken color for mouse-over effect
function darkenColor(color, factor) {
    let c = color.slice(1);
    let rgb = parseInt(c, 16);
    let r = Math.max((rgb >> 16) - factor, 0);
    let g = Math.max(((rgb >> 8) & 0x00FF) - factor, 0);
    let b = Math.max((rgb & 0x0000FF) - factor, 0);
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

// Show the tooltip with the data details
function showTooltip(event, data) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'block';
    tooltip.style.top = event.clientY + 10 + 'px';
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.innerHTML = `
        <strong>${data.tournamentName}</strong><br>
        ${data.date}<br>
        Winner's Share: $${data.winnersShare?.$numberInt}<br>
        FedEx Points: ${data.fedexCupPoints?.$numberInt || 'N/A'}
    `;
}

// Hide the tooltip when the mouse is not hovering over a data point
function hideTooltip() {
    document.getElementById('tooltip').style.display = 'none';
}

