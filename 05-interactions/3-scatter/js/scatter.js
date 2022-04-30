async function drawScatter() {

  // 1. Access data
  const pathToJSON = './../../data/seattle_wa_weather_data.json'
  const dataset = await d3.json(pathToJSON)

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity

  // 2. Create chart dimensions

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const drawDots = (dataset) => {

    // 5. Draw data

    const dots = bounds.selectAll("circle")
      .data(dataset, d => d[0])

    const newDots = dots.enter().append("circle")

    const allDots = newDots.merge(dots)
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 4)

    const oldDots = dots.exit()
        .remove()
  }
  drawDots(dataset)

  /* ------------------------------------------------------------- */
  /*
    CHALLENGE: We have the tooltip styled and in place, but notice:
      + The tiny dots are hard to hover over
      + Our tooltip disappears when moving between points, making the interaction jerky

    SOLUTION: Let's solve this with Voronoi diagrams. Instead of using the deprecated voronoi generator built into D3 - d3-voronoi - we will be using the speedier third-party library d3-delaunay
  */
  // Create a new Delaunay triangulation passing in our dataset, x accessor function, and y accessor function
  const delaunay = d3.Delaunay.from(dataset, d => xScale(xAccessor(d)), d => yScale(yAccessor(d)))

  // Turn our delaunay triangulation into a voronoi diagram
  const voronoi = delaunay.voronoi()

  // Specify the size of our diagram
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  // Bind our data and add a <path> for each data point with a class of voronoi for styling with our CSS file
  bounds.selectAll(".voronoi")
    .data(dataset)
    .enter().append("path")
      .attr("class", "voronoi")
      // Create each path's d attribute string using voronoi.renderCell(i)
      .attr("d", (d,i) => voronoi.renderCell(i))
      // Give our polygons a stroke so we can see them
      .attr("stroke", "salmon")

  /* ------------------------------------------------------------- */
  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .html("dew point (&deg;F)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .text("relative humidity")

  // 7. Set up interactions
  bounds.selectAll(".voronoi")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(datum, index) {
    // Draw a dot to make sure our hovered dot is larger and on top of any neighboring dots
    const dayDot = bounds.append("circle")
        .attr("class", "tooltipDot")
        .attr("cx", d => xScale(xAccessor(datum)))
        .attr("cy", d => yScale(yAccessor(datum)))
        .attr("r", 7)
        .style("fill", "maroon")
        .style("pointer-events", "none")

    // We want to display the metric on our x axis (dew point) and the metric on our y axis (humidity)
    const formatDewPoint = d3.format(".2f")
    tooltip.select("#dew-point").text(formatDewPoint(xAccessor(datum)))

    const formatHumidity = d3.format(".2f")
    tooltip.select("#humidity").text(formatHumidity(yAccessor(datum)))

    // // Let's log the date (ex "2019-01-01") in a friendlier format use timeParse()
    // const dateParser = d3.timeParse("%Y-%m-%d")
    // console.log(dateParser(datum.date)) // Thu Sep 06 2018 00:00:00 GMT-0700 (Pacific Daylight Time)

    // Let's use timeFormat() to take a date formatter string and return a formatter function - see https://github.com/d3/d3-time-format
    const dateParser = d3.timeParse("%Y-%m-%d")
    const formatDate = d3.timeFormat("%A, %B %d, %Y") // Thursday, September 06, 2018

    // Plug the new date string into our tooltip
    tooltip.select("#date").text(formatDate(dateParser(datum.date)))

    // Grab the x and y value of our dot; offset by the left and top margins
    const x = xScale(xAccessor(datum)) + dimensions.margin.left
    const y = yScale(yAccessor(datum)) + dimensions.margin.top

    // Use calc() to add these values to percentage offsets needed to shift the tooltip - we're positioning its arrow, not the top left corner
    tooltip.style("transform", `translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`)

    // Make our tooltip visible
    tooltip.style("opacity", 1)

  }
  function onMouseLeave(datum, index) {
    tooltip.style("opacity", 0) // Hide our tooltip
    d3.selectAll(".tooltipDot").remove()  // Remove the dot drawn by the tooltip hover
  }
}
drawScatter()