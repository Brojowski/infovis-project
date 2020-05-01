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
        <tr> <th>         </th> <th> Director                   </th> <th> Actor                      </th> <th> Actress                    </th> </tr>
        <tr> <th>#Movies  </th> <td> {{ dirNumMovies }}         </td> <td> {{ atrNumMovies }}         </td> <td> {{ atsNumMovies }}         </td> </tr>
        <tr> <th>Name     </th> <td> {{ focused.director }}     </td> <td> {{ focused.actor }}        </td> <td> {{ focused.actress }}      </td> </tr>
        <tr> <th>Genres   </th> <td> <svg id="dir-genre"></svg> </td> <td> <svg id="atr-genre"></svg> </td> <td> <svg id="ats-genre"></svg> </td> </tr>
        <tr> <th>Ratings  </th> <td> <svg id="dir-rate"></svg>  </td> <td> <svg id="atr-rate"></svg>  </td> <td> <svg id="ats-rate"></svg>  </td> </tr>
      </table>
    </div>
    
    <div id="trendsHeader">
      <h3> Hollywood Trends </h3>
      <select v-model="trendFilterType">
        <option value=""        >All Movies</option>
        <option value="director">Director</option>
        <option value="actor"   >Actor</option>
        <option value="actor"   >Actress</option>
      </select>
      <autocomplete :search="searchTrendOptions" @submit="submitTrendSearch"></autocomplete>
    </div>
    
    <D3LineChart id="trendsChart" :config="trendConfig" :datum="trendData" ></D3LineChart>
    
    <div id="roleHeader">
      <h3> Most Influential</h3>
      <select v-model="influenceGenre" @change="updateInfluences">
        <option value='overall'> Overall </option>
        <option v-for="genre in Array.from(categories)" v-bind:key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>{{ influenceGenre }}
    </div>

    <div id="roleContainer">
      <table>
        <tr> <th> Director  </th> <td> <svg id="inf1"></svg> </td> <td id="names1"> </td> </tr>
        <tr> <th> Actor     </th> <td> <svg id="inf2"></svg> </td> <td id="names2"> </td> </tr>
        <tr> <th> Actress   </th> <td> <svg id="inf3"></svg> </td> <td id="names3"> </td> </tr>
      </table>
    </div>

  </div>
</template>

<script>
import * as d3 from 'd3';
import Autocomplete from '@trevoreyre/autocomplete-vue'
import { D3LineChart } from 'vue-d3-charts'
import { RadarChart } from './radarchart';

export default {
  name: 'FilmVis',
  components: {
    Autocomplete,
    D3LineChart
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
      svgHeight: 700,
      pieRadius: pieRadius,
      xProp: "year",
      yProp: "popularity"  ,
      colorProp: "length",
      vis3: null,
      dataGroup: null,
      categories: new Set(),
      dirNumMovies: 0,
      atrNumMovies: 0,
      atsNumMovies: 0,
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
      arc: d3.arc().innerRadius(0).outerRadius(pieRadius),
      trendFilterType: '',
      trendFilterValue: '',
      trendData: [],
      trendConfig: {
        date: {
          key: 'when',
          inputFormat: "%Y",
          outputFormat: "%Y",
        },
        values: [ "Drama", "Action", "Comedy", "War", "Music", "Science Fiction", "Mystery", "Horror", "Westerns" ],
        axis: {
          yTitle: false,
          xTitle: false,
          yFormat: ".0f",
          xFormat: "%Y-%m-%d",
          yTicks: 5,
          xTicks: 3
        },
        color: {
          key: false,
          keys: [ "Drama", "Action", "Comedy", "War", "Music", "Science Fiction", "Mystery", "Horror", "Westerns" ],
          scheme: d3.schemeCategory10,
          current: "#1f77b4",
          default: "#AAA",
          axis: "#000",
        },
        curve: "curveLinear",
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 40
        },
        points: {
          visibleSize: 3,
          hoverSize: 6,
        },
        tooltip: {
          labels: false,
        },
        transition: {
          duration: 350,
          ease: "easeLinear",
        },
      },
      influenceGenre: 'overall',
      influenceCache: {}
    };
  },
  methods: {
    onDataLoaded: function(data) {
      console.log("data did load");
      console.log(data[0]);
      this.data = data;
      this.renderFilms()
      this.filterTrends('', '');
      this.updateInfluences()
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
            .attr('r', 4)
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
      this.drawPersonGenre(this.directors, d.director, '#dir-genre', 'dirNumMovies')
      this.drawPersonGenre(this.actors   , d.actor   , '#atr-genre', 'atrNumMovies')
      this.drawPersonGenre(this.actresses, d.actress , '#ats-genre', 'atsNumMovies')
      this.drawPersonRating(this.directors, d.director, '#dir-rate')
      this.drawPersonRating(this.actors   , d.actor   , '#atr-rate')
      this.drawPersonRating(this.actresses, d.actress , '#ats-rate')
    },
    colorFromGenre: function(genre) {
      //console.log(d3.schemeCategory10);
      return d3.schemeCategory10[Array.from(this.categories).indexOf(genre)];
    },
    drawPersonGenre: function(personType, personName, svgId, numMoviesProp) {
        d3.select(svgId).html('')
        if (personName === '') return;

        this[numMoviesProp] = personType[personName].movies;

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
    },
    drawPersonRating: function(personType, personName, svgId) {
        d3.select(svgId).html('')
        if (personName === '') return;

        // Create dummy data
        var stars = personType[personName].stars
        var data = {one:stars[0], two:stars[1], three:stars[2], four:stars[3], five: stars[4]};

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
          .domain(['one', 'two', 'three', 'four', 'five'])
          .range(d3.schemeRdYlGn[5])

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
    },
    getYear: function (years, year) {
      var theYear = years[year]
      if (theYear === undefined) {
        theYear = {
          when: year
        };
        let categories = Array.from(this.categories)
        for (var i = 0; i < categories.length; i++) {
          theYear[categories[i]] = 0;
        }
        years[year] = theYear;
      }
      return theYear;
    },
    filterTrends: function(filterProp, filterText) {
      // Filter data
      let data = this.data
      if (filterText !== '') {
        data = data.filter(d => d[filterProp] === filterText);
      }

      // Aggregate Data
      var years = {}
      for (var i = 0; i < data.length; i++) {
        let d = data[i];
        let y = this.getYear(years, d.year)
        y[d.subject] += 1;
      }

      let trends = []
      // Sort by year
      for (let y in years) {
        trends.push(years[y])
      }
      console.log(trends)

      this.trendData = trends;
    },
    searchTrendOptions: function(searchText) {
      let names = [];
      switch (this.trendFilterType) {
        case 'director':
          names = Object.keys(this.directors);
          break;
        case 'actor':
          names = Object.keys(this.actors);
          break;
        case 'actress':
          names = Object.keys(this.actresses);
          break;
      }
      let lcSearchText = searchText.toLowerCase();
      return names.filter(n => n.toLowerCase().indexOf(lcSearchText) !== -1)
    },
    submitTrendSearch: function(searchText) {
      this.filterTrends(this.trendFilterType, searchText);
    },
    calcInfluence: function (role) {
      if (this.influenceCache[role] !== undefined) {
        return this.influenceCache[role];
      }

      let data = this.data;
      let categories = Array.from(this.categories);
      var influence = {}
      for (var i = 0; i < data.length; i++) {
        let d = data[i];
        let name = d[role];
        if (name === '') continue;

        var person = influence[name];
        if (person === undefined) {
          person = { 
            name: name,
            sumRatings: {
              overall: 0
            },
            numMovies: {
              overall: 0
            },
            avgRating: {
              overall: 0
            }
          }
          for (i = 0; i < categories.length; i++) {
            person.sumRatings[categories[i]] = 0;
            person.numMovies[categories[i]] = 0;
            person.avgRating[categories[i]] = 0;
          }
          influence[name] = person;
        }

        person.numMovies.overall++;
        person.numMovies[d.subject]++;
        person.sumRatings[d.subject] += (d.popularity / 100);
      }

      for (let name in influence) {
        let sumAvgs = 0;
        person = influence[name];
        for (i = 0; i < categories.length; i++) {
          let genre = categories[i];
          person.avgRating[genre] = person.sumRatings[genre] / person.numMovies[genre];
          if (Number.isNaN(person.avgRating[genre])) {
            person.avgRating[genre] = 0;
          }
          sumAvgs += person.avgRating[genre];
        }

        person.avgRating.overall = sumAvgs / categories.length;
      }

      let dirs = [];
      for (var name in influence) {
        dirs.push(influence[name]);
      }

      this.influenceCache[role] = dirs

      return dirs;
    },
    showInfluential: function(role, svgId, namesId) {
      let dirs = this.calcInfluence(role);
      
      dirs = dirs
          .sort((d1, d2) => 1 - d1.avgRating[this.influenceGenre] > 1 - d2.avgRating[this.influenceGenre])
          .slice(0, 4)

      let props = ['overall'].concat(Array.from(this.categories));

      let radars = dirs.map(r => {
        return props.map( prop => { 
          return { axis: prop, value: r.avgRating[prop]}
        });
      });

      //console.log(radars);

      d3.select(svgId)
          .attr('width', 700)
          .attr('height', 700)
      
      RadarChart.draw(svgId, radars);

      
      let target = document.getElementById(namesId);
      let htmls = dirs.map( (d,i) => '<b style="background-color: ' + d3.schemeCategory10[i] + ';">' + i+1 + "." + d.name + '</b><br>')
      target.innerHTML = "";
      for (var i = 0; i < htmls.length; i++) {
        target.innerHTML += htmls[i];
      }
    },
    updateInfluences: function() {
      this.showInfluential('director' , '#inf1', 'names1');
      this.showInfluential('actor'    , '#inf2', 'names2');
      this.showInfluential('actress'  , '#inf3', 'names3');
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
  border: solid black 1px;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
}

.movieDetails {
  margin: auto auto;
}

#trendsHeader {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 4;
  grid-row-end: 4;
}

#trendsChart {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 5;
  grid-row-end: 5;
}

#roleHeader {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 6;
  grid-row-end: 6;
}

#roleContainer {

  grid-column-start: 1;
  grid-column-end: 5;
  grid-row-start: 7;
  grid-row-end: 7;
}
</style> 