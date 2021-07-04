<template>
  <div class="container-fluid fullHeight">

    <div v-if="!cargando" class="row justify-content-center">
      <div class="col-11 col-md-7 align-middle">

        <div class="input-group mb-3 mt-5">
          <div class="input-group-prepend">
            <div class="input-group-text search">
              <img src="@/assets/search.png">
            </div>
          </div>
          <input 
            type="text" 
            class="form-control input-search" 
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
                <b-col class="col-8">
                  <button @click="backhome()" class="back-home-button">Go back Home</button>
                </b-col>
              </b-row>
            </b-container>
          </template>
          
          <template #cell(fav)="row">
            <button @click="manageFav(row)" class="btn btn-sm">
              <img v-if="validarFav(row.item)" src="@/assets/fav-active.png">
              <img v-else src="@/assets/fav-disabled.png">
            </button>
          </template>
          <template #cell(name)="row">
            <a @click="showDetails(row)">
              <div class="fullWidht">
                {{ capitalChar(row.item.name)}}
              </div>              
            </a>
          </template>

        </b-table>
      </div>
      <div class="footer">
        <b-container>
          <b-row class="justify-content-md-center" align-h="between">
            <b-col class="col-6 col-sm-6 col-md-5 col-lg-4 pt-2">
              <button @click="alternButton('all')" class="btn btn-sm footer-button" :class="fullList ? 'clicked-button' : 'unclicked-button'">
                <img src="@/assets/list.png" class="icons">
                All
              </button>
            </b-col>
            <b-col class="col-6 col-sm-6 col-md-5 col-lg-4 pt-2">
              <button @click="alternButton('fav')" class="btn btn-sm footer-button" :class="fullList ? 'unclicked-button' : 'clicked-button'">
                <img src="@/assets/star.png" class="icons">
                Favorites               
              </button>
            </b-col>
          </b-row>
        </b-container>
      </div>      
    </div>

    <div v-else>
      <loading />
    </div>

    <b-modal id="detailed-pokemon" centered hide-footer class="content-modal">
      <template #modal-title>        
        <img src="@/assets/fondo.png" class="img-fondo">
        <img :src="pokemonSelected.img" class="img-pokemon">
      </template>
      <template #modal-header-close class="btn-close">
        <img src="@/assets/btn-close.png">
      </template> 
      <div class="d-block text-center content-modal">
        <b-row class="row-spec">
          <div class="spec">
            <b>Name: </b>{{ capitalChar(pokemonSelected.name)}}
          </div>        
          <hr>
          <div class="spec">
            <b>Weight: </b>{{pokemonSelected.weight}}
          </div>
          <hr>
          <div class="spec">
            <b>Height: </b>{{pokemonSelected.height}}
          </div>
          <hr>
          <div class="spec">
            <b>Types: </b>{{pokemonSelected.types}}
          </div> 
          <hr>        
        </b-row>
        <b-container class="mt-3 row-spec">
          <b-row>
            <b-col class="col-8 pt-1">
              <button 
                class="btn btn-share" 
                @click="copy()">
                  Share to my friends
              </button>
            </b-col>
            <b-col class="col-4">
              <img v-if="validarFav(pokemonSelected)" src="@/assets/fav-active.png">
              <img v-else src="@/assets/fav-disabled.png">            
            </b-col>
          </b-row>
        </b-container>        
      </div>
        
    </b-modal>

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
      pokemonSelected: {},
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
            solid: true
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
    },
    showDetails(row){
      this.cargando = true;
      axios
        .get(row.item.url)
        .then((response) => {
          this.pokemonSelected.img = response.data.sprites.front_default;
          this.pokemonSelected.name = row.item.name;
          this.pokemonSelected.weight = response.data.weight;
          this.pokemonSelected.height = response.data.height; 
          let types = response.data.types.map((el) => {
            return this.capitalChar(el.type.name);
          });          
          this.pokemonSelected.types = types.join(', ');
          this.cargando = false;
          this.$bvModal.show('detailed-pokemon');
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
    capitalChar(string){
      if(string) return string.charAt(0).toUpperCase() + string.slice(1);
    },
    copy(){
      //copy to clipboard TO DO   
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
  width: 75%;
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
.img-fondo{
  max-width: 100%;
  z-index: 1;
  position:relative
}
.img-pokemon{
  z-index: 2;
  position:absolute;
  top: 10%;
  left: 40%;
}
.fullWidht{
  width: 100%;
}
.row-spec{
  width: 80%;
  margin-left: 10%;
}
.spec{
  text-align: left;
}
.btn-share{
  color:white;
  border-radius: 30px;
  background-color: #f22539;
  border: 0px;
}
.icons{
  width: 15px;
}
hr{
  margin-top: 6px;
  margin-bottom: 6px;
}
.fav-col{
  width: 20%;
}
.search{
  background-color: white;
  border-color: #ced4da;
  border-right: 0px;
  height: 100%;
}
.input-search{
  border-left: 0px;
}
.input-search:focus{
  outline: none;
  box-shadow: none;
  border-color: #ced4da;
}
</style>