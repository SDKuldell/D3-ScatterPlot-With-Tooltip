d3.csv("wealth-health-2014.csv", d3.autoType).then((data) => {
  const margin = { top: 20, left: 20, right: 20, bottom: 20 };
  const totalWidth = 650;
  const totalHeight = 500;
  const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  //create svg with margins
  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //create the x scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Income)])
    .range([0, width]);

  //create the y scale
  const yScale = d3
    .scaleLinear()
    .domain([45, d3.max(data, (d) => d.LifeExpectancy)])
    .range([height, 0]);

  //create an ordinal scale for the colors
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  //createa scale for the circle radius
  const circleRadiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Population)])
    .range([5, 25]);

  //create the group for the chart
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  //create the group for the legend
  const legendGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  //create x axis
  const xAxis = d3.axisBottom(xScale);
  xAxis.ticks(5, "s");

  //create y axis
  const yAxis = d3.axisLeft(yScale);
  xAxis.ticks(5, "s");

  //append the x axis to the group
  chartGroup
    .append("g")
    .attr("class", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

  //append the y axis to the group
  chartGroup.append("g").attr("class", "y-axis").call(yAxis);

  //add x axis title
  svg.append("text").attr("x", 575).attr("y", 475).text("Income");

  //add y axis title
  svg
    .append("text")
    .attr("x", 30)
    .attr("y", 20)
    .attr("writing-mode", "vertical-lr")
    .text("Life Expectancy");

  //create the tooltip
  const tooltip = d3.select(".tooltip");

  //draw data
  chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", (d) => {
      return yScale(d.LifeExpectancy);
    })
    .attr("cx", (d, i) => {
      return xScale(d.Income);
    })
    .attr("r", (d, i) => {
      return circleRadiusScale(d.Population);
    })
    .attr("fill", (d) => colorScale(d.Region))
    .attr("stroke", "black")
    .attr("opacity", 0.8)
    .on("mouseenter", (event, d) => {
      var pos = d3.pointer(event, window);
      var country = d.Country;
      var region = d.Region;
      var population = d3.format(",")(d.Population);
      var income = d3.format(",")(d.Income);
      var lifeExpectancy = d3.format("")(d.LifeExpectancy);

      tooltip
        .style("display", "block")
        .style("top", pos[1] + 10 + "px")
        .style("left", pos[0] + 10 + "px")
        .html(
          "Country: " +
            country +
            "<br/>" +
            "Region: " +
            region +
            "<br/>" +
            "Population: " +
            population +
            "<br/>" +
            "Income: " +
            income +
            "<br/>" +
            "Life Expectancy: " +
            lifeExpectancy
        );
    })
    .on("mouseleave", (event, d) => {
      tooltip.style("display", "none");
    });

  //create rectangles for the legend
  legendGroup
    .selectAll("rect")
    .data(colorScale.domain())
    .enter()
    .append("rect")
    .attr("x", 400)
    .attr("y", function (d, i) {
      return i * 22 + 275;
    })
    .attr("width", 20)
    .attr("height", 20)
    .style("stroke", "black")
    .attr("fill", colorScale);

  //create labels for the legend
  legendGroup
    .selectAll("text")
    .data(colorScale.domain())
    .enter()
    .append("text")
    .attr("x", 425)
    .attr("y", function (d, i) {
      return i * 22 + 290;
    })
    .text(function (d, i) {
      return d;
    });
});
