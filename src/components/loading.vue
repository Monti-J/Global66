<template>
  <div class="center-loading">
      <img src="@/assets/Loader.png" alt="Loading...">
  </div>
</template>

<script>
export default {
  name: 'Loading',
  methods:{
  },
  mounted(){
  }
}
</script>


<style scoped>
.center-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
</style>
