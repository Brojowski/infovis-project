<template>
  <div>
    <h1>Cars</h1>

    <svg id="vis1">
    </svg>

    <div id="focusbox">
    </div>

    <h2> Description </h2>
    <p>
    </p>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Cars',
  mounted: function() {
    let svgWidth = 1500;
    let svgHeight = 1000;

    let xProp = "year"
    let yProp = "popularity"  
    let colorProp = "length"

    let vis3 = d3.select('#vis1')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    let dataGroup = vis3.append('g')
        .attr('class', 'films data-group');

    let _this = this;
    console.log((_this.categories))
    function renderFilms(data) {
      //console.log(data)

        let xScale = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[xProp]))
            .range([5, svgWidth-5])
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[yProp]))
            .range([svgHeight-5, 5])
        let alphaScale = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[colorProp]))
            .range([.1, 1])
        let colorScale = d3.scaleOrdinal()
            .domain(_this.categories)
            .range(d3.schemeCategory10)
        console.log(colorScale)

        let circles = dataGroup.selectAll('circle').data(data);

        circles.enter().append('circle')
            .attr('cx', (d) => xScale(d[xProp]))
            .attr('cy', (d) => yScale(d[yProp]))
            .attr('r', 5)
            .style('fill', (d) => {
              return d3.color(colorScale(d.subject)).copy({ opacity: alphaScale(d[colorProp]) })
            })
            .on('mouseover', function(d) {
              _this.focused = d;
            })

        circles.exit().remove();
    }
    
    function type(d) {
        return d;
    }

    //console.log("a1-film")
    d3.csv('data/a1-cars.csv', type).then(renderFilms)
  },
  data: () => {
    return {
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#focusbox {
  background-color: grey;
}

</style>
