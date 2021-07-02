<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Loading/>
  </div>
</template>

<script>
// @ is an alias to /src
import Loading from '@/components/loading.vue'

export default {
  name: 'Home',
  components: {
    Loading
  }
}
</script>
