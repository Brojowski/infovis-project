<template>
  <div>
    <h1>Film</h1>
    <svg id="vis3">
    </svg>
    <div id="focusbox">
      <h1> {{ focused.title }} </h1>
      <table>
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
      genreToColor: {},
      actors: {},
      actresses: {},
      directors: {},
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
        this.categories.add(d.subject)
        this.recordPerson(this.directors, d.director, d)
        this.recordPerson(this.actors,    d.actor   , d)
        this.recordPerson(this.actresses, d.actress , d)
        return d;
    },
    recordPerson: function(personType, personName, d) {
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
    focusMovie: function(d) {
      this.focused = d
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
