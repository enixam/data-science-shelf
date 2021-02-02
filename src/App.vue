<template>
  <nav-bar></nav-bar>
  <div class="content"><router-view /></div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
  components: {
    "nav-bar": NavBar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
}
</style>
