<template>
  <div>
    <h1>Film</h1>
    <svg id="vis3">
    </svg>
    <div id="focusbox">
      <h1> {{ focused.title }} </h1>
      <b> Year </b> {{ focused.year }} <br>
      <b> Length </b> {{ focused.length }} <br>
      <b> Subject </b> {{ focused.subject }} <br>
      <b> Actor </b> {{ focused.actor }} <br>
      <b> Actress </b> {{ focused.actress }} <br>
      <b> Director </b> {{ focused.director }} <br>
      <b> Popularity </b> {{ focused.popularity }} <br>
      <b> Awards </b> {{ focused.awards }}<br>
    </div>
    <!--<div>
      <h1> Categories </h1>
      <div v-for="(value, propertyName) in categories" v-bind:key="(value, propertyName)">
        <input type="checkbox" v-model="categories[propertyName]"> {{ propertyName}}
      </div>
    </div>-->

    <h2> Description </h2>
    <p>
      This visualization displays the movies by time and popularity. The x-axis represents the year produced, the y axis how popular the movie was. 
      The different colors represent the category the movie comes from.
      The alpha value represents the the length of the movie.
      Additionally, when the user hovers over a movie, the details are put in the box below the graph.
    </p>
    <p>
      Using this visualization, the user is able to see the that over time, movies have tended to get longer. Unfortunatly for movie produces, one of 
      the more vivid areas is down in the bottom right corner. This indicates that there are many long movies that are not well rated.
    </p>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'FilmVis',
  mounted: function() {
    let svgWidth = 1500;
    let svgHeight = 1000;

    let xProp = "year"
    let yProp = "popularity"  
    let colorProp = "length"

    let vis3 = d3.select('#vis3')
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
        /*
         * year         INT
         * length       INT
         * title        STRING
         * subject      STRING
         * actor        STRING
         * actress      STRING
         * director     STRING
         * popularity   INT
         * awards       STRING
         * image        STRING
         */
        d.year = +d.year;
        d.length = +d.length;
        d.popularity = +d.popularity;
        _this.categories.add(d.subject)
        return d;
    }

    //console.log("a1-film")
    d3.csv('data/a1-film.csv', type).then(renderFilms)
  },
  data: () => {
    return {
      categories: new Set(),
      focused: {
         year: "",
         length: "",
         title: "Hover over a movie to see info",
         subject: "",
         actor: "",
         actress: "",
         director: "",
         popularity: "",
         awards: "",
      }
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
