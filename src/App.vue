<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  height: 100%;
}
html, body{
  padding: 0;
  margin: 0;
  height: 100%;
}
.fullHeight{
  height: 100%;
}
.tdClass{ 
  padding-left: 5%; 
  text-align: left;
  cursor: pointer;
  width: 100%;
}
.close {
    position: absolute;
    z-index: 2;
    right: 0;
    margin-right: 3%;
    margin-top: 4%;
    top: 0;
    background-color: transparent;
    border: 0px;
}
</style>