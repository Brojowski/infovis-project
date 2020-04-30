<template>
  <div class="grid-container">

    <div id="header">
      <h1>Film</h1>
      <autocomplete id="movieSearch" :search="searchMovie" @submit="submitMovieSearch"></autocomplete>
    </div>

    <div id="genreKey">
      <div v-for="genre in categories" v-bind:key="genre">
        <div v-bind:style="{background: colorFromGenre(genre) }"> {{ genre }} </div>
      </div>
    </div>

    <svg id="vis3">
    </svg>

    <div id="focusbox">
      <h1> {{ focused.title }} </h1>
      <table class="movieDetails">
      <tr><td><b> Year        </b></td><td> {{ focused.year }}        </td></tr>
      <tr><td><b> Length      </b></td><td> {{ focused.length }}      </td></tr>
      <tr><td><b> Subject     </b></td><td> {{ focused.subject }}     </td></tr>
      <tr><td><b> Popularity  </b></td><td> {{ focused.popularity }}  </td></tr>
      <tr><td><b> Awards      </b></td><td> {{ focused.awards }}      </td></tr>
      </table>
      <table>
        <tr> <th>         </th> <th>Director                    </th> <th>Actor                       </th> <th>Actress                     </th> </tr>
        <tr> <th>Name     </th> <td> {{ focused.director }}     </td> <td> {{ focused.actor }}        </td> <td> {{ focused.actress }}      </td> </tr>
        <tr> <th>Genres   </th> <td> <svg id="dir-genre"></svg> </td> <td> <svg id="atr-genre"></svg> </td> <td> <svg id="ats-genre"></svg> </td> </tr>
        <tr> <th>Ratings  </th> <td> <svg id="dir-rate"></svg>  </td> <td> <svg id="atr-rate"></svg>  </td> <td> <svg id="ats-rate"></svg>  </td> </tr>
      </table>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Autocomplete from '@trevoreyre/autocomplete-vue'

export default {
  name: 'FilmVis',
  components: {
    Autocomplete
  },
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
    let pieRadius = 50;
    return {
      data: [],
      svgWidth: 1500,
      svgHeight: 500,
      pieRadius: pieRadius,
      xProp: "year",
      yProp: "popularity"  ,
      colorProp: "length",
      vis3: null,
      dataGroup: null,
      categories: new Set(),
      actors: {},
      actresses: {},
      directors: {},
      movieTitles: [],
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
      },
      pie: d3.pie().sort(null),
      arc: d3.arc().innerRadius(0).outerRadius(pieRadius)
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
            .on('mouseover', this.focusMovie)

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
        this.movieTitles.push(d.title);
        this.categories.add(d.subject)
        this.recordPerson(this.directors, d.director, d)
        this.recordPerson(this.actors,    d.actor   , d)
        this.recordPerson(this.actresses, d.actress , d)
        return d;
    },
    recordPerson: function(personType, personName, d) {
      if (personName === '') return;

      if (personType[personName] === undefined) {
        personType[personName] = {
          stars: [0,0,0,0,0],
          genres: {},
          movies: 0
        };
      }

      personType[personName].movies += 1;

      // Add this movie to the number of popular movies.
      personType[personName].stars[Math.floor((d.popularity / 100) * 5)] += 1;

      // Add this genre to the list of genres.
      if (personType[personName].genres[d.subject] === undefined) {
        personType[personName].genres[d.subject] = 1;
      } else {
        personType[personName].genres[d.subject] += 1;
      }
    },
    searchMovie: function(searchText) {
      return this.movieTitles.filter( title => title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    },
    submitMovieSearch: function(searchText) {
      let d = this.data.filter( d => d.title === searchText)[0]
      this.focusMovie(d);
    },
    focusMovie: function(d) {
      this.focused = d
      this.drawPersonGenre(this.directors, d.director, '#dir-genre')
      this.drawPersonGenre(this.actors   , d.actor   , '#atr-genre')
      this.drawPersonGenre(this.actresses, d.actress , '#ats-genre')
    },
    colorFromGenre: function(genre) {
      //console.log(d3.schemeCategory10);
      return d3.schemeCategory10[Array.from(this.categories).indexOf(genre)];
    },
    drawPersonGenre: function(personType, personName, svgId) {
        d3.select(svgId).html('')
        if (personName === '') return;

        // Create dummy data
        var data = personType[personName].genres;

        // set the dimensions and margins of the graph
        var width = 100,
            height = 100,
            margin = 8;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = (Math.min(width, height) / 2 - margin)

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select(svgId)
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // set the color scale
        var color = d3.scaleOrdinal()
          .domain(this.categories)
          .range(d3.schemeCategory10)

        // Compute the position of each group on the pie:
        var pie = d3.pie()
          .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
          .selectAll('whatever')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
          )
          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "black")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-template-rows: auto auto auto auto auto;
  grid-gap: 10px;
}

#header {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 1;
}

#genreKey {
  grid-column-start: 5;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-end: 1;
}

#focusbox {
  background-color: grey;
  grid-column-start: 5;
  grid-column-end: 5;
  grid-row-start: 2;
  grid-row-end: 2;
}

#vis3 {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
}

.movieDetails {
  margin: auto auto;
}

</style>
