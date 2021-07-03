<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-11 col-md-7 align-middle">

        <div class="input-group mb-3 mt-5">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <b-icon-search />
            </div>
          </div>
          <input 
            type="text" 
            class="form-control" 
            aria-label="Text input with checkbox"
            placeholder="Search"
            @input="find()" 
            v-model="filter">
        </div>

        <b-table
          hover 
          :items="filterResult" 
          :fields="fields"
          thead-class="d-none"
          show-empty
        >
          <template #empty="">
            <b-container>
              <b-row class="justify-content-center row-empty mt-3" align-h="center">
                <h2><b>{{emptyTitle}}</b></h2>
                <p>{{emptyText}}</p>
                <b-col class="col-6 col-sm-6 col-md-5 col-lg-4">
                  <button @click="backhome()" class="back-home-button">Go back Home</button>
                </b-col>
              </b-row>
            </b-container>
          </template>
          
          <template #cell(fav)="row" class="text-center">
            <button @click="manageFav(row)" class="btn btn-sm">
              <img v-if="validarFav(row.item)" src="@/assets/fav-active.png">
              <img v-else src="@/assets/fav-disabled.png">
            </button>
          </template>

        </b-table>

      </div>
    </div>

    <div  class="footer">
      <b-container>
        <b-row class="justify-content-md-center" align-h="between">
          <b-col class="col-6 col-sm-6 col-md-5 col-lg-4">
            <button @click="alternButton('all')" class="btn btn-sm footer-button" :class="fullList ? 'clicked-button' : 'unclicked-button'">
              <i class="bi bi-list-ul"></i>
              All
            </button>
          </b-col>
          <b-col class="col-6 col-sm-6 col-md-5 col-lg-4">
            <button @click="alternButton('fav')" class="btn btn-sm footer-button" :class="fullList ? 'unclicked-button' : 'clicked-button'">
              <svg class="bi" width="32" height="32" fill="currentColor">
                <use xlink:href="bootstrap-icons.svg#toggles"/>
              </svg>
              Favorites
            </button>
          </b-col>
        </b-row>
      </b-container>

    </div>
  </div>
</template>

<script>
import Loading from '@/components/loading.vue';
import axios from 'axios';

export default {
  name: 'home',
  components: {
    Loading
  },
  data(){
    return{
      emptyText: "You look lost on your journey!",
      emptyTitle: "Uh-oh!",
      fields:[
        {
          key: 'name',
          label: "",
          tdClass: "tdClass align-middle"
        },
        {
          key: 'fav',
          label:"",
        }
      ],
      items:[],
      cargando: false,
      filter: "",
      filterResult: [],
      fullList: true,
    }
  },
  beforeMount(){
    this.cargando = true;
    this.getAllData();
  },
  computed:{
    allFavs(){
      return this.$store.getters.favoriteList;
    }
  },
  methods:{
    getAllData(){
      axios
        .get("https://pokeapi.co/api/v2/pokemon")
        .then((response) => {
          this.items = response.data.results;
          this.filterResult = this.items;
          this.cargando = false;
        })
        .catch(() => {
          this.$bvToast.toast("contenido", {
            title: "titulo",
            variant: "danger",
            solid: true,
          });
          this.cargando = false;
        });
    },
    find(){
      if(this.filter === ""){
        this.filterResult = this.fullList ? this.items : this.allFavs;
      }else{
        // Una alternativa para mejorar la performance en caso de ser muchos items
        // es realizar el filtro únicamente cuando se presione enter y no cuando 
        // se presione una tecla en el input
        let resultado = this.fullList ? this.items.filter(pokemon => pokemon.name.indexOf(this.filter) > -1) :
                                        this.allFavs.filter(pokemon => pokemon.name.indexOf(this.filter) > -1);
        this.filterResult = resultado;
      }      
    },
    alternButton(whoIsClicked){
      this.fullList = whoIsClicked == 'all' ? true : false;
      if (this.fullList){
        this.find();
      }else{
        this.filterResult = this.allFavs;
        this.find();
      }
    },
    manageFav(row){
      let exist = this.allFavs.findIndex((pokemon) => pokemon.name == row.item.name);
      if(exist == -1){
        this.$store.commit('newFav', row.item);
      }else{
        this.$store.commit('delFav', exist);
      }
    },
    validarFav(row){
      let exist = this.allFavs.findIndex((pokemon) => pokemon.name == row.name);
      return exist > -1 ? true : false
    },
    backhome(){
      this.filter = "";
      this.alternButton('all');
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: white;
  position: fixed; 
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
}
.footer-button{
  color: white;
  background-color: #f22539;
  padding: 0.4em 1em 0.4em 1em;
  border-radius: 30px;
  border: 0px;
  width: 60%;
}
.clicked-button{
  background-color: #f22539;
}
.unclicked-button{
  background-color: #b4b2b2;
}
.row-empty{
  text-align: center
}
.b-table-empty-row{
  border-bottom: 0px !important;
}
.back-home-button{
  color: white;
  background-color: #f22539;
  padding: 0.3em 1.1em 0.3em 1.1em;
  border-radius: 30px;
  border: 0px;
}
.toLeft{
  text-align: left !important;
}
.centerFav{
  text-align: center;
}
.rowClass{
  text-align: left;
}
</style>