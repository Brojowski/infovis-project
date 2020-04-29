<template>
  <div id="app">
    <cars-vis></cars-vis>
    <cereal-vis></cereal-vis>
    <film-vis></film-vis>
    <grocery-vis></grocery-vis>
    <mutual-vis></mutual-vis>
  </div>
</template>

<script>
/* eslint vue/no-unused-components: "off" */
import CarsVis from './components/Cars'
import CerealVis from './components/Cereals'
import FilmVis from './components/FilmVis'
import GroceryVis from './components/GroceryStores'
import MutualVis from './components/MutualFunds'

export default {
  name: 'App',
  components: {
    CarsVis,
    CerealVis,
    FilmVis,
    GroceryVis,
    MutualVis
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
