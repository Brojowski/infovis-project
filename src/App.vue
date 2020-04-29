<template>
  <div id="app">
    <film-vis></film-vis>
  </div>
</template>

<script>
/* eslint vue/no-unused-components: "off" */
import FilmVis from './components/FilmVis'

export default {
  name: 'App',
  components: {
    FilmVis
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
