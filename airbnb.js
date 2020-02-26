let data = "";
let svg = "";
var width = 960,
    height = 580

window.onload = function() {
    svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.csv("data.csv", function (data) { 
        data.forEach(function(d) {
            d.longitude = +d.longitude;
            d.latitude = +d.latitude;
        })
        makeMap(data);
    });
}

function makeMap(csvData) {
    data = csvData;

    var albersProjection = d3.geoAlbers()
      .scale(70000)
      .rotate([74, 0])
      .center([0, 40.70])
      .translate([width/2,height/2]);
    
    var geoPath = d3.geoPath()
        .projection(albersProjection)
        .pointRadius(3);

    var nygeo = svg
      .append("g")
      .attr("id", "nygeo");
    
    nygeo.selectAll("path")
      .data(nygeo_json.features)
      .enter()
      .append("path")
      .attr("d", geoPath);

    var airbnbData = []
    data.forEach(function(d, i) {
        airbnbDot = [data[i].longitude, data[i].latitude]
        coordinates = {type: "Point", "coordinates": airbnbDot}
        airbnbData.push(coordinates);
    })

    var airbnb = svg
      .append("g")
      .attr("id", "airbnb");

    airbnb.selectAll("circles")
        .data(airbnbData)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .on( "click", function() {
            d3.select(this)
            .attr("opacity",1)
            .transition()
            .attr("d", "M 0,0 m0,3a3,3 0 1,1 0,-6a3,3 0 1,1 0,6z")
            .duration(2000)
            .attr("opacity", 0)
            .on("end",function(){
                d3.select(this).remove();
              })
          });

    makeTitle();
}

function makeTitle() {
    svg.append('text')
        .attr('x', 100)
        .attr('y', 200)
        .style('font-size', '30pt')
        .text("Airbnb in NYC");
}