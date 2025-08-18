<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1d1c1d;
  min-height: 100vh;
  background: #ffffff;
}

body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}

/* Minimal base */
h1, h2, h3 {
  font-weight: 700;
}
</style>
