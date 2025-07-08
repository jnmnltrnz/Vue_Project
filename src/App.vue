<template>
  <div id="app">
    <router-view />
    <CacheDebugger />
  </div>
</template>

<script>
import CacheDebugger from '@/components/Debug/CacheDebugger.vue';

export default {
  name: "App",
  components: {
    CacheDebugger
  }
};
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