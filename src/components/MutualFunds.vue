<template>
  <div>
    <h1>Mutual Funds</h1>

    <svg id="vis5">
    </svg>

    <div id="focusbox">
    </div>

    <h2> Description </h2>
    <p>
        This visualization shows some of the properties of mutual funds based on
        the rating of the fund by plotting it on a radar grid. The vertical dimension
        is the rating in number of stars of the fund. Some of the things shown well One of the interesting things
        are that the most senior managers work for the highest rated funds and that 
        the lowest rated funds have the highest amount of fees. One of the less 
        expected things is that the 5 star funds do not have the highest yeilds. In
        fact, they have the second lowest yeilds, only above the 1 star funds.
    </p>
    </div>
</template>

<script>
/* eslint no-unused-vars: "off" */
import * as d3 from 'd3';
import {RadarChart} from './radarchart';

export default {
  name: 'MutualFunds',
  mounted: function() {
    let svgWidth = 1000;
    let svgHeight = 1000;

    d3.select('#vis5')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    function renderFilms(data) {
        let props = ["yield", "mgrTenure", "netAssets", "expenseRatio"]

        let byRating = {
            "*": { count:0 },
            "**": { count:0 },
            "***": { count:0 },
            "****": { count:0 },
            "*****": { count:0 }
        }

        for (var r in byRating) {
            props.forEach(prop => {
                byRating[r][prop] = 0
            })
        }

        data.forEach(d => {
            if (d.rating === undefined || d.rating === "") return;
            byRating[d.rating].count++;
            props.forEach(prop => {
                if (isNaN(d[prop])) return;
                byRating[d.rating][prop] += d[prop];
            })
        });

        let ratingScale = d3.scaleOrdinal()
            .domain(["*", "**", "***", "****", "*****"])
            .range([.2, .4, .6, .8, 1])

        let ratings = [];
        for (r in byRating) {
            let rate = {
                rating: r
            }

            props.forEach(prop => {
                rate[prop] = byRating[r][prop] / byRating[r].count
            })

            ratings.push(rate)
        }

        let scales = [];
        function getScale(prop) {
            if ( scales[prop] === undefined) {
                scales[prop] = d3.scaleLinear()
                    .domain(d3.extent( ratings.map(r => r[prop]) ))
                    .range([0, 1])
            }
            return scales[prop]
        }

        console.log(getScale('yield')(9))

        let radars = ratings.map(r => {
            var path = [];
            path.push({ axis: 'rating', value: ratingScale(r.rating) })

            props.forEach( prop => {
                path.push({ axis: prop, value: getScale(prop)(r[prop]) })
            })

            return path
        })
        
        console.log(radars)

        //Call function to draw the Radar chart
        //Will expect that data is in %'s
        RadarChart.draw("#vis5", radars);
    }
    
    function type(d) {
        d.yield = Number.parseFloat(d.yield)
        d.mgrTenure = Number.parseFloat(d.mgrTenure)
        d.netAssets = Number.parseInt(d.netAssets.replace(',', ''))
        d.expenseRatio = Number.parseFloat(d.expenseRatio)
        return d;
    }

    //console.log("a1-film")
    d3.csv('data/a1-mutualfunds.csv', type).then(renderFilms)
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
