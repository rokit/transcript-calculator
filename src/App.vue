<template>
  <div id="app">
    <div id="bg"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
$bg-width: 600px/4;
$bg-height: 600px/4;

body {
  margin: 0px;
  overflow: hidden;
}
#bg {
  position: absolute;
  z-index: -100;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('./assets/diamonds.svg');
  background-size: $bg-width $bg-height;
  min-width:  200vw;
  min-height: 200vh;
  // animation: move-bg 30s linear infinite;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
@keyframes move-bg {
  from {
    transform: translate(0,0) rotate(0.01deg);
  }
  to {
    transform: translate(-$bg-width, $bg-height) rotate(0.01deg);
  }
}
</style>
