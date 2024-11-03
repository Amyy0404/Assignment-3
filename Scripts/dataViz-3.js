const url = 'https://live-golf-data.p.rapidapi.com/schedule?orgId=1&year=2024';

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '5723e04825msh816004be5752d8fp19fa84jsnbe9795b17e33',
        'x-rapidapi-host': 'live-golf-data.p.rapidapi.com'
    }
};

let processedData = [];

// Initialize an array to hold the selected FedEx Cup points ranges
let selectedFedexPoints = ["100-300"]; // Default selection

// Function to update the selection based on checkboxes
function updateSelectedFedexPoints() {
    selectedFedexPoints = Array.from(document.querySelectorAll('.fedex-checkbox:checked')).map(checkbox => checkbox.value);
    updateRadialChart();
}

// Attach event listeners to checkboxes
d3.selectAll('.fedex-checkbox').on('change', updateSelectedFedexPoints);

fetch(url, options)
    .then(response => response.json())
    .then(data => {
        processedData = data.schedule.map(d => ({
            ...d,
            winnersShare: d.winnersShare?.$numberInt ? parseInt(d.winnersShare.$numberInt) : null
        }));
        updateRadialChart();

        document.querySelectorAll('.fedex-checkbox').forEach(checkbox => checkbox.checked = true);
        updateSelectedFedexPoints(); // Call to update visualization with default selection
    })
    .catch(error => console.error('Error:', error));

let WIDTH = 1500, HEIGHT = 700;
let svg = d3.select("#radial-chart")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("display", "block")
    .style("margin", "0 auto");

let centerX = WIDTH / 2;
let centerY = HEIGHT / 2;

const layers = [
    { min: 4000000, max: 4500000, baseRadius: 330, threshold: 8 },
    { min: 3000000, max: 3999999, baseRadius: 250, threshold: 6 },
    { min: 1000000, max: 1999999, baseRadius: 170, threshold: 2 },
    { min: 0, max: 999999, baseRadius: 90, threshold: 1 }
];

let expansionFactor = 1;

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
            updateRadialChart();
        } else {
            this.value = expansionFactor; 
        }
    });

function updateRadialChart() {
    svg.selectAll("circle.layer").remove();
    svg.selectAll("circle.data-point").remove();

    layers.forEach((layer, index) => {
        let effectiveRadius = layer.baseRadius + (expansionFactor - 1) * 5 * index;
        let currentOpacity = 1;

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

    // Filter processedData based on selected FedEx points
    const filteredData = processedData.filter(d => {
    const points = d.fedexCupPoints?.$numberInt ? parseInt(d.fedexCupPoints.$numberInt) : null;
    if (selectedFedexPoints.includes("100-300") && points >= 100 && points <= 300) return true;
    if (selectedFedexPoints.includes("400-600") && points >= 400 && points <= 600) return true;
    if (selectedFedexPoints.includes("700+") && points >= 700) return true;
    return false;
});

// Process filteredData instead of processedData
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

    const dotSize = d.winnersShare ? Math.max(6, d.winnersShare / 200000) : 5;

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
            showTooltip(event, d);
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", dotSize)
                .style("fill", getColor(d.winnersShare));
            hideTooltip();
        });
});

    if (expansionFactor >= layers.length) {
        const targetRadius = layers.find(layer => layer.min === 4000000)?.baseRadius || 0;

        svg.selectAll("circle.data-point")
            .transition()
            .duration(800)
            .attr("cx", (d, i) => centerX + Math.cos((i * (2 * Math.PI)) / processedData.length) * targetRadius)
            .attr("cy", (d, i) => centerY + Math.sin((i * (2 * Math.PI)) / processedData.length) * targetRadius);
    }
}

function getColor(winnersShare) {
    if (winnersShare >= 4000000) return "#e3d3bc";
    if (winnersShare >= 3000000) return "#bb9d87";
    if (winnersShare >= 2000000) return "#bcc4b5";
    if (winnersShare >= 1000000) return "#629f74";
    return "#dadfc6";
}

function areAllDotsOnSameLayer(expansionFactor) {
    const layerIndices = processedData.map(d => {
        const layer = layers.find(layer => d.winnersShare >= layer.min && d.winnersShare <= layer.max);
        return layer ? layers.indexOf(layer) : -1; 
    });

    const firstIndex = layerIndices[0];
    return layerIndices.every(index => index === firstIndex);
}

let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#285f3f") 
    .style("color", "white")          
    .style("font-family", "'CustomFont3', sans-serif")
    .style("font-size", "15px") 
    .style("padding", "10px")
    .style("border-radius", "2px")
    .style("visibility", "hidden")
    .style("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.2)");

    function showTooltip(event, d) {
        const points = d.fedexCupPoints?.$numberInt ? parseInt(d.fedexCupPoints.$numberInt) : 'N/A';
        tooltip.html(`<strong>${d.name}</strong><br>Winner's Share: $${d.winnersShare || 'N/A'}<br>FedEx Cup Points: ${points}`)
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    }
    

function hideTooltip() {
    tooltip.style("visibility", "hidden");
}

function darkenColor(color, percent) {
    const colorObj = d3.color(color);
    colorObj.r = Math.floor(colorObj.r * (1 - percent));
    colorObj.g = Math.floor(colorObj.g * (1 - percent));
    colorObj.b = Math.floor(colorObj.b * (1 - percent));
    return colorObj.toString();
}
