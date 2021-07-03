<template>
  <div class="container-fluid fullHeight">
    <div v-if="!cargando" class="row justify-content-center fullHeight">
      <div class="col-12 col-lg-7 align-middle">
        <div class="row">
          <img src="@/assets/mask-group.png" class="pb-4">
        </div>        
        <div class="row justify-content-center">
          <div class="col-8">
            <h3 class="title pt-3"><b>{{title}}</b></h3>
            <p class="text pt-3 pb-3">{{text}}</p>
            <button @click="start()" class="btn btn-sm start-button">Get started</button>
          </div>
        </div>        
      </div>
    </div>
    <div v-else>
      <loading />
    </div>
  </div>  
</template>

<script>
import Loading from '@/components/loading.vue'

export default {
  name: 'start',
  components: {
    Loading
  },
  data(){
    return{
      title: "Welcome to Pokédex",
      text: "The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the Pokémon world.",
      cargando: false
    }
  },
  methods:{
    start(){
      this.cargando = true;
      //Solo para mostrar la pantalla de carga al iniciar.
      //En lugar del time out podría procesarse el login, por ejemplo.
      setTimeout(() =>{
        this.$router.push({
          name: "home",
        });
      },2000);
    },
  }
}
</script>

<style scoped>
.start-button{
  color: white;
  background-color: #f22539;
  padding: 0.4em 1em 0.4em 1em;
  border-radius: 30px;
  border: 0px;
}
.start-button:focus{
  background-color: #d32133;
}
img{
  width: 280px;
}
.half-screen {  
  width: 100%;
  height: 50%;
}
.row{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>