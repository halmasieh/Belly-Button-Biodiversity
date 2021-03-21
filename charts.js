function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that holds the metadata array. 
    var metadata = data.metadata;
      
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samples.filter(sampleObj => parseInt(sampleObj.id) == sample);
    console.log(filteredSample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetaData = metadata.filter(sampleObj => sampleObj.id == parseInt(sample));
    console.log(filteredMetaData);

    //  Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0];
    console.log(firstSample);

    // Create a variable that holds the first sample in the metadata array.
    var firstMetaData = filteredMetaData[0];
    console.log(firstMetaData);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
    
    // Create a variable that holds the washing frequency.
    var wfreq = parseFloat(firstMetaData.wfreq);
    
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // Sort otu_ids in descending order
    var yticks = otu_ids.map(s => `OTU ${s.toString()}`).slice(0,10).reverse();
    // Slice the first 10 objects for plotting
    var x_sample_values = sample_values.map(x =>x).slice(0,10).reverse();
    var hover_otu_labels = otu_labels.map(label => label).slice(0,10).reverse();
    
    // Create the trace for the bar chart. 
    var trace1 = {
      x: x_sample_values,
      y: yticks,
      text: hover_otu_labels,
      type: "bar",
      //width: 20,
      orientation: "h"
    };
       
    var barData = [trace1];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {ticktext: hover_otu_labels},
      bargap: 0.2,
      // paper_bgcolor: "silver",
      // plot_bgcolor: "lightgray"
    }; 
      
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData , barLayout, {responsive:true});

    // Create a bubble chart
    // Create the trace for the bubble chart.
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: "bubble",
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values
      },
      hovertemplate: `(%{x}, %{y})<br>%{text}<extra></extra>`, 
    }; 
      var bubbleData = [trace2];

      // Create the layout for the bubble chart.
    var bubbleLayout = {
    title : "Bacteria Cultures Per Sample",
    xaxis : {title : "OTU ID"},
    margin: {
            l: 40,
            r: 40,
            t: 60,
            b: 70
          },   
    hovermode: `closest`,
    //paper_bgcolor: "silver",
    //plot_bgcolor: "lightgray"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive:true});

    // Create the trace for the gauge chart.
    var trace3 ={
      domain: {x:[0,1], y:[0,1]},
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title : {text:"<b>Belly Button Washing Frequency</b><br>Scrubs Per Week"},
      gauge: {
      axis:{range:[null,10],tickwidth: 1, tickcolor: "black"},
      bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        bar: { color: "black" },
      steps:[
      { range: [0, 2], color: "red" },
      { range: [2, 4], color: "orange" },
      { range: [4, 6], color: "yellow" },
      { range: [6, 8], color: "lightgreen"},
      { range: [8, 10], color: "green" },
    ],
      }
    
    };
      
    // Create the gauge chart
    var gaugeData = [trace3];

    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      // title : {text:"<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
      width: 500,
      height: 400,
      margin: { t: 0, b: 0},
      //margin: { t: 25, r: 25, l: 25, b: 25},
      font: { color: "black", family: "Arial" }
    };
  
    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive:true});
    
  });
}





