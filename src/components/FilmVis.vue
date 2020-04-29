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
    this.vis3 = d3.select('#vis3')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight);

    this.dataGroup = this.vis3.append('g')
        .attr('class', 'films data-group');

    //console.log("a1-film")
    d3.csv('data/a1-film.csv', this.type).then(this.onDataLoaded)

    console.log((this.categories))
  },
  data: () => {
    return {
      data: [],
      svgWidth: 750,
      svgHeight: 500,
      xProp: "year",
      yProp: "popularity"  ,
      colorProp: "length",
      vis3: null,
      dataGroup: null,
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
  },
  methods: {
    onDataLoaded: function(data) {
      console.log("data did load");
      console.log(data[0]);
      this.data = data;
      this.renderFilms()
    },
    renderFilms: function() {
        let data = this.data;
        let _this = this;

        let xScale = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[this.xProp]))
            .range([5, this.svgWidth-5])
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[this.yProp]))
            .range([this.svgHeight-5, 5])
        let alphaScale = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[this.colorProp]))
            .range([.1, 1])
        let colorScale = d3.scaleOrdinal()
            .domain(this.categories)
            .range(d3.schemeCategory10)
        console.log(colorScale)

        let circles = this.dataGroup.selectAll('circle').data(data);

        circles.enter().append('circle')
            .attr('cx', (d) => xScale(d[this.xProp]))
            .attr('cy', (d) => yScale(d[this.yProp]))
            .attr('r', 2)
            .style('fill', (d) => {
              return d3.color(colorScale(d.subject)).copy({ opacity: alphaScale(d[this.colorProp]) })
            })
            .on('mouseover', function(d) {
              _this.focused = d;
            })

        circles.exit().remove();
    },
    type: function(d) {
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
        this.categories.add(d.subject)
        return d;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#focusbox {
  background-color: grey;
}

</style>
