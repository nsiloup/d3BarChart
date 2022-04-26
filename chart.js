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
        const dates = dataGDP.map((d, i) => d[0]);
        const gdp = dataGDP.map((d, i)=> d[1]);
        let svg = d3.select(".chart-container").append("svg")
                    .attr("viewBox", `0, 0, ${w}, ${h}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")

        
        
        //Defining the scales
        let xScale = d3.scaleTime();
        let minDate = d3.min(dates, (d) => Number(new Date(d)));
        let maxDate = d3.max(dates, (d) => Number(new Date(d)));
        xScale.domain([minDate, maxDate]);
        xScale.range([horizPadding, w - horizPadding])

        let yScale = d3.scaleLinear();
        yScale.domain([0, d3.max(gdp, (d) => d)]);
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

        // Creating a ToolTip
        let toolTip = d3.select(".chart-container").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "5%")
            .style("border-radius", "10%")
            .style("padding", "2%")
            // .html(`<p>date : /*HOVERED DATE*/<br><br>GDP : /* HOVERED GDP */</p>`)

        // d3.select(".bar")
        //     .on("mouseover", () => toolTip.style("visibility", "visible"))
        //     .on("mousemove", () => {
        //         return toolTip.style("top", d3.select(this).attr("x")+'10px')
        //         .style("left", d3.select(this).attr("y")+'15px')
        //     })
        //     .on("mouseout", () => toolTip.style("visibility", "hidden"))

        
        let rect = svg.selectAll("rect")
        rect.data(dataGDP)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(new Date(d[0])))
            .attr("y", (d, i) => yScale(d[1]))
            .attr("width", 2)
            .attr("height", (d, i) => (h - yScale(d[1])-vertiPadding))
            .attr("fill", "black")
            .attr("class", "bar")
            .attr("data-date", dates)
            .attr("data-gdp", gdp)
            .on("mouseover", (d, i) => {
                d3.select("#tooltip")
                .style("visibility", "visible")
                // .html(`<p>date : /*HOVERED DATE*/<br><br>GDP : /* HOVERED GDP */</p>`)
                log(d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d))
            })


    }catch(err){
        console.log(err);
    }
})

