var app = new Vue({
  el: '#app',
  
  created: function(){
    //created
  },
  mounted: function(){
    //
    this.updateToken()
    this.listOfRepo()
  },
  beforeUpdate: function(){
    
  },
  update: function(){

  },
  destroyed: function(){

  },
  data: {
    date: {
      min : new Date(new Date().setTime(new Date().getTime() - (15 * 24 * 60 * 60 * 1000))).toJSON().slice(0,10), 
      max : new Date().toJSON().slice(0,10)
    },
    gitusers : [
      {pseudo : "LordInateur", repos : ["github-ynov-vue","gta-ynov-vue","SHI-FU-MI-clicker"], repoSelected:["github-ynov-vue"]},
      {pseudo : "benjaminbra", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "Nair0fl", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "mathiasLoiret", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:["github-ynov-vue"]},
      {pseudo : "thomaspich", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "TeofiloJ", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "Grigusky", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "Dakistos", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "mael61", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "KevinPautonnier", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "BenoitCochet", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "sfongue", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "ClementCaillaud", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "gfourny", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "Mokui", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "AntoineGOSSET", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "etienneYnov", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "Coblestone", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "AlexDesvallees", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "rudy8530", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "Killy85", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]},
      {pseudo : "alixnzt", repos : ["github-ynov-vue","gta-ynov-vue"], repoSelected:[]}
    ],
    userSelected : ["LordInateur", "mathiasLoiret"],
    commitsList : {/*"LordInateur/github-ynov-vuz":{"title":"LordInateur/github-ynov-vue","loading":true,"commits":[]}*/},
    display_removeToken : false,
    oauth_token : "initialisation"
  },
  methods: {
    console : function () {
      return console;
    }, 
    document : function(){
      return document;
    },
    sessionStorage : function(){
      return window.sessionStorage
    },
    getRepoData : function ( user, repo){

      if(this.oauth_token != undefined && this.oauth_token.length == 40 && repo != undefined){
 
        var myImage = document.querySelector('img');

        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'token ' + this.oauth_token);
        myHeaders.append('Accept', 'application/vnd.github.v3+json');

        var myInit = { method: 'GET',
                       headers: myHeaders,
                       mode: 'cors',
                       cache: 'default' };

        var myRequest = new Request(`https://api.github.com/repos/${user}/${repo}/commits`);

        var thus = this;

        fetch(myRequest,myInit)
        .then(function(response) {
           return response.json().then(function(json) {
            try {
              thus.commitsList[`${user}/${repo}`].commits = json;
              thus.commitsList[`${user}/${repo}`].loading = false;
              thus.$forceUpdate();
            }catch (e){}
            
          })
        })
        .catch ( function(error)  {
          alert("Probleme lors de la Request.")
          return error
        })
        
      }else if(!(this.oauth_token != "initialisation" && repo != undefined || repo == undefined )){
        console.log(repo)
        console.log(this.oauth_token)
        alert("Probleme sur le token de connexion")
        // this.removeToken()
      } else {
        console.log("Probleme sur le token de connexion")
        // this.removeToken()
      }
            
    },
    getData(){
      let tmpData = JSON.parse(JSON.stringify(this.$data))
      delete tmpData.commitsList
      return tmpData
    },
    setData(data){
      Object.assign(this.$data, JSON.parse(data))
    },

    listOfRepo : function(){
      return this.gitusers.reduce((acc, user)=>{
        //console.log(user.repoSelected)
        for ( i_repo in user.repos){
          let title = `${user.pseudo}/${user.repos[i_repo]}`;      

          if(user.repoSelected.indexOf(user.repos[i_repo]) < 0 ){
            if(this.commitsList[title] != undefined){
              console.log("remove : " + title)
              delete this.commitsList[title]
              // sinon pas moyen de le faire rafraichir
              // this.$forceUpdate();
            }
            
          }else{
            acc.push(`${user.pseudo}/${user.repoSelected[i_repo]}`)
            if(this.commitsList[title] == undefined){
              this.commitsList[title] = { 'title': title, loading : true }
              this.getRepoData(user.pseudo, user.repoSelected[i_repo])
            }

          }

        }
        
        return acc
      }, [])
    },
    removeToken : function(){
      this.sessionStorage().removeItem('oauth_token')
      this.oauth_token = "Removed"
      this.display_removeToken = false
    },
    updateToken : function(){
      try {
        this.oauth_token = this.sessionStorage().getItem('oauth_token');
        console.log(this.oauth_token)
        while(this.oauth_token == null || this.oauth_token == undefined || this.oauth_token.length != 40){
          
          this.oauth_token = prompt("Veuillez saisir votre token de connexion git", "")
          
        }
        this.sessionStorage().setItem('oauth_token', this.oauth_token)
        console.log("token -" + this.sessionStorage().getItem('oauth_token') + "- save in sessionStorage")
        console.log(this.oauth_token)
      } catch (e) {
        alert("Autoriser les cookies pour sauvegarder le token d'authentification sur la prochaine saisie")
        while(this.oauth_token == null || this.oauth_token == undefined || this.oauth_token.length != 40){
          this.oauth_token = prompt("Veuillez saisir votre token de connexion git", "")
        }
        alert("Token non sauvegarder.")
      }
      this.display_removeToken = !this.isToken
    }
  },
  computed: {
    isToken : function(){
      try {
        this.display_removeToken = this.sessionStorage().getItem('oauth_token').length == 40
      }catch (e){
        this.display_removeToken = false;
      }
      return this.display_removeToken;
    }
  }

  // add watch deep
})
