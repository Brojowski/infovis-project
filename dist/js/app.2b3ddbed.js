(function(t){function e(e){for(var s,n,o=e[0],c=e[1],u=e[2],l=0,v=[];l<o.length;l++)n=o[l],Object.prototype.hasOwnProperty.call(i,n)&&i[n]&&v.push(i[n][0]),i[n]=0;for(s in c)Object.prototype.hasOwnProperty.call(c,s)&&(t[s]=c[s]);d&&d(e);while(v.length)v.shift()();return a.push.apply(a,u||[]),r()}function r(){for(var t,e=0;e<a.length;e++){for(var r=a[e],s=!0,o=1;o<r.length;o++){var c=r[o];0!==i[c]&&(s=!1)}s&&(a.splice(e--,1),t=n(n.s=r[0]))}return t}var s={},i={app:0},a=[];function n(e){if(s[e])return s[e].exports;var r=s[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=s,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(r,s,function(e){return t[e]}.bind(null,s));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var u=0;u<o.length;u++)e(o[u]);var d=c;a.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},"034f":function(t,e,r){"use strict";var s=r("85ec"),i=r.n(s);i.a},"56d7":function(t,e,r){"use strict";r.r(e);r("e260"),r("e6cf"),r("cca6"),r("a79d");var s=r("2b0e"),i=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"app"}},[r("film-vis")],1)},a=[],n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"grid-container"},[r("div",{attrs:{id:"header"}},[r("h1",[t._v("Film")]),r("autocomplete",{attrs:{id:"movieSearch",search:t.searchMovie},on:{submit:t.submitMovieSearch}})],1),r("div",{attrs:{id:"genreKey"}},t._l(t.categories,(function(e){return r("div",{key:e},[r("div",{style:{background:t.colorFromGenre(e)}},[t._v(" "+t._s(e)+" ")])])})),0),r("svg",{attrs:{id:"vis3"}}),r("div",{attrs:{id:"focusbox"}},[r("h1",[t._v(" "+t._s(t.focused.title)+" ")]),r("table",{staticClass:"movieDetails"},[r("tr",[t._m(0),r("td",[t._v(" "+t._s(t.focused.year)+" ")])]),r("tr",[t._m(1),r("td",[t._v(" "+t._s(t.focused.length)+" ")])]),r("tr",[t._m(2),r("td",[t._v(" "+t._s(t.focused.subject)+" ")])]),r("tr",[t._m(3),r("td",[t._v(" "+t._s(t.focused.popularity)+" ")])]),r("tr",[t._m(4),r("td",[t._v(" "+t._s(t.focused.awards)+" ")])])]),r("table",[t._m(5),r("tr",[r("th",[t._v("#Movies ")]),t._v(" "),r("td",[t._v(" "+t._s(t.dirNumMovies)+" ")]),t._v(" "),r("td",[t._v(" "+t._s(t.atrNumMovies)+" ")]),t._v(" "),r("td",[t._v(" "+t._s(t.atsNumMovies)+" ")])]),r("tr",[r("th",[t._v("Name ")]),t._v(" "),r("td",[t._v(" "+t._s(t.focused.director)+" ")]),t._v(" "),r("td",[t._v(" "+t._s(t.focused.actor)+" ")]),t._v(" "),r("td",[t._v(" "+t._s(t.focused.actress)+" ")])]),r("tr",[r("th",[t._v("Genres ")]),t._v(" "),r("td",[r("svg",{attrs:{id:"dir-genre"}})]),t._v(" "),r("td",[r("svg",{attrs:{id:"atr-genre"}})]),t._v(" "),r("td",[r("svg",{attrs:{id:"ats-genre"}})])]),r("tr",[r("th",[t._v("Ratings ")]),t._v(" "),r("td",[r("svg",{attrs:{id:"dir-rate"}})]),t._v(" "),r("td",[r("svg",{attrs:{id:"atr-rate"}})]),t._v(" "),r("td",[r("svg",{attrs:{id:"ats-rate"}})])])])])])},o=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("td",[r("b",[t._v(" Year ")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("td",[r("b",[t._v(" Length ")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("td",[r("b",[t._v(" Subject ")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("td",[r("b",[t._v(" Popularity ")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("td",[r("b",[t._v(" Awards ")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("tr",[r("th"),t._v(" "),r("th",[t._v("Director ")]),t._v(" "),r("th",[t._v("Actor ")]),t._v(" "),r("th",[t._v("Actress ")])])}],c=(r("4de4"),r("a630"),r("c975"),r("d3b7"),r("6062"),r("3ca3"),r("ddb0"),r("5698")),u=r("95bf"),d={name:"FilmVis",components:{Autocomplete:u["a"]},mounted:function(){this.vis3=c["k"]("#vis3").attr("width",this.svgWidth).attr("height",this.svgHeight),this.dataGroup=this.vis3.append("g").attr("class","films data-group"),c["c"]("data/a1-film.csv",this.type).then(this.onDataLoaded),console.log(this.categories)},data:function(){var t=50;return{data:[],svgWidth:1500,svgHeight:500,pieRadius:t,xProp:"year",yProp:"popularity",colorProp:"length",vis3:null,dataGroup:null,categories:new Set,dirNumMovies:0,atrNumMovies:0,atsNumMovies:0,actors:{},actresses:{},directors:{},movieTitles:[],focused:{year:"",length:"",title:"Hover over a movie to see info",subject:"",actor:"",actress:"",director:"",popularity:"",awards:""},pie:c["f"]().sort(null),arc:c["a"]().innerRadius(0).outerRadius(t)}},methods:{onDataLoaded:function(t){console.log("data did load"),console.log(t[0]),this.data=t,this.renderFilms()},renderFilms:function(){var t=this,e=this.data,r=c["g"]().domain(c["e"](e,(function(e){return e[t.xProp]}))).range([5,this.svgWidth-5]),s=c["g"]().domain(c["e"](e,(function(e){return e[t.yProp]}))).range([this.svgHeight-5,5]),i=c["g"]().domain(c["e"](e,(function(e){return e[t.colorProp]}))).range([.1,1]),a=c["h"]().domain(this.categories).range(c["i"]);console.log(a);var n=this.dataGroup.selectAll("circle").data(e);n.enter().append("circle").attr("cx",(function(e){return r(e[t.xProp])})).attr("cy",(function(e){return s(e[t.yProp])})).attr("r",2).style("fill",(function(e){return c["b"](a(e.subject)).copy({opacity:i(e[t.colorProp])})})).on("mouseover",this.focusMovie),n.exit().remove()},type:function(t){return t.year=+t.year,t.length=+t.length,t.popularity=+t.popularity,this.movieTitles.push(t.title),this.categories.add(t.subject),this.recordPerson(this.directors,t.director,t),this.recordPerson(this.actors,t.actor,t),this.recordPerson(this.actresses,t.actress,t),t},recordPerson:function(t,e,r){""!==e&&(void 0===t[e]&&(t[e]={stars:[0,0,0,0,0],genres:{},movies:0}),t[e].movies+=1,t[e].stars[Math.floor(r.popularity/100*5)]+=1,void 0===t[e].genres[r.subject]?t[e].genres[r.subject]=1:t[e].genres[r.subject]+=1)},searchMovie:function(t){return this.movieTitles.filter((function(e){return-1!==e.toLowerCase().indexOf(t.toLowerCase())}))},submitMovieSearch:function(t){var e=this.data.filter((function(e){return e.title===t}))[0];this.focusMovie(e)},focusMovie:function(t){this.focused=t,this.drawPersonGenre(this.directors,t.director,"#dir-genre","dirNumMovies"),this.drawPersonGenre(this.actors,t.actor,"#atr-genre","atrNumMovies"),this.drawPersonGenre(this.actresses,t.actress,"#ats-genre","atsNumMovies"),this.drawPersonRating(this.directors,t.director,"#dir-rate"),this.drawPersonRating(this.actors,t.actor,"#atr-rate"),this.drawPersonRating(this.actresses,t.actress,"#ats-rate")},colorFromGenre:function(t){return c["i"][Array.from(this.categories).indexOf(t)]},drawPersonGenre:function(t,e,r,s){if(c["k"](r).html(""),""!==e){this[s]=t[e].movies;var i=t[e].genres,a=100,n=100,o=8,u=Math.min(a,n)/2-o,d=c["k"](r).append("svg").attr("width",a).attr("height",n).append("g").attr("transform","translate("+a/2+","+n/2+")"),l=c["h"]().domain(this.categories).range(c["i"]),v=c["f"]().value((function(t){return t.value})),f=v(c["d"](i));d.selectAll("whatever").data(f).enter().append("path").attr("d",c["a"]().innerRadius(0).outerRadius(u)).attr("fill",(function(t){return l(t.data.key)})).attr("stroke","black").style("stroke-width","2px").style("opacity",.7)}},drawPersonRating:function(t,e,r){if(c["k"](r).html(""),""!==e){var s=t[e].stars,i={one:s[0],two:s[1],three:s[2],four:s[3],five:s[4]},a=100,n=100,o=8,u=Math.min(a,n)/2-o,d=c["k"](r).append("svg").attr("width",a).attr("height",n).append("g").attr("transform","translate("+a/2+","+n/2+")"),l=c["h"]().domain(["one","two","three","four","five"]).range(c["j"][5]),v=c["f"]().value((function(t){return t.value})),f=v(c["d"](i));d.selectAll("whatever").data(f).enter().append("path").attr("d",c["a"]().innerRadius(0).outerRadius(u)).attr("fill",(function(t){return l(t.data.key)})).attr("stroke","black").style("stroke-width","2px").style("opacity",.7)}}}},l=d,v=(r("d800"),r("2877")),f=Object(v["a"])(l,n,o,!1,null,"7729649a",null),h=f.exports,p={name:"App",components:{FilmVis:h}},_=p,g=(r("034f"),Object(v["a"])(_,i,a,!1,null,null,null)),m=g.exports;s["a"].config.productionTip=!1,new s["a"]({render:function(t){return t(m)}}).$mount("#app")},"85ec":function(t,e,r){},"8f33":function(t,e,r){},d800:function(t,e,r){"use strict";var s=r("8f33"),i=r.n(s);i.a}});
//# sourceMappingURL=app.2b3ddbed.js.map