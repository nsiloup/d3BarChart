let log = console.log;
let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

// sjust use one attribute (width or w in this case) to define the size,
//and handle the rest with the ratio in "viewBox" properties
let w = 900; 
let h = 500;
let vertiPadding = 25;
let horizPadding = 45;

document.addEventListener("DOMContentLoaded", async() => {
    try{
        let res = await fetch(url);
        let dataGDP = await res.json();
        dataGDP = dataGDP.data;
        //console.log("dataGDP : ", dataGDP)
        let svg = d3.select(".chart-container").append("svg")
                    .attr("viewBox", `0, 0, ${w}, ${h}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")

        
        //Defining the scales
        let xScale = d3.scaleTime();
        let minDate = d3.min(dataGDP, (d) => Number(new Date(d[0])));
        let maxDate = d3.max(dataGDP, (d) => Number(new Date(d[0])));
        xScale.domain([minDate, maxDate]);
        xScale.range([horizPadding, w - horizPadding])

        let yScale = d3.scaleLinear();
        yScale.domain([0, d3.max(dataGDP, (d) => d[1])]);
        yScale.range([h - vertiPadding, vertiPadding]);

        let xAxis = d3.axisBottom(xScale)
        svg.append("g")
           .attr("id", "x-axis")
           .attr("transform", `translate(0, ${h - vertiPadding})`)
           .call(xAxis)

        let yAxis = d3.axisLeft(yScale);
        svg.append("g")
           .attr("id", 'y-axis')
           .attr("transform", `translate(${horizPadding}, 0)`)
           .call(yAxis);

        let rect = svg.selectAll("rect")
                      .data(dataGDP)
                      .enter()
                      .append("rect")
                      .attr("x", (d, i) => xScale(new Date(d[0])))
                      .attr("y", (d, i) => yScale(d[1]))
                      .attr("width", 2)
                      .attr("height", (d, i) => (h - yScale(d[1])-vertiPadding))
                      .attr("fill", "black")
                      .attr("class", "bar")


    }catch(err){
        console.log(err);
    }
})

