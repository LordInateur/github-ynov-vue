var app = new Vue({
  el: '#app',
  /*  data: {
    title: 'Titre : Une voiture',

    form : { 
      marque : "Mercedes",
      modele : "CLK",
      annee : 1995
    },
    voiture : {
      marque : "Mercedes",
      modele : "CLK",
      annee : 1995
    }
    

  }
  */
  created: function(){
    //created
  },
  mounted: function(){
    //
  },
  updated: function(){
    
  },
  destroyed: function(){

  },
  data: {
    date: {
      min : new Date().toJSON().slice(0,10), 
      max : new Date().toJSON().slice(0,10)
    },
    gitusers : [
      {pseudo : "LordInateur", repos : ["github-ynov-vue"], repoSelected:["github-ynov-vue"]},
      {pseudo : "benjaminbra", repos : ["github-ynov-vue"], repoSelected:["github-ynov-vue"]},
    ],
    userSelected : ["LordInateur"],
    commitsList : {}
  },
  methods: {
    console : function () {
      return console;
    }, 
    document : function(){
      return document;
    },
    getRepoData : function ( user, repo){
      // lordToken : f25f2cbf1b820c037516e027339beb37447775a4

      var myImage = document.querySelector('img');

      var myHeaders = new Headers();
      myHeaders.append('Authorization', 'token f25f2cbf1b820c037516e027339beb37447775a4');
      myHeaders.append('Accept', 'application/vnd.github.v3+json');

      var myInit = { method: 'GET',
                     headers: myHeaders,
                     mode: 'cors',
                     cache: 'default' };

      var myRequest = new Request(`https://api.github.com/repos/${user}/${repo}/commits`);

      var thus = this;

      fetch(myRequest,myInit).then(function(response) {
         return response.json().then(function(json) {
          thus.commitsList[`${user}/${repo}`].commits = json;
          thus.commitsList[`${user}/${repo}`].loading = false;
          thus.$forceUpdate();
        });
      })
      
    },
    getData(){
      return this.$data
    },
    setData(data){
      Object.assign(this.$data, JSON.parse(data))
    }
  },
  computed: {
    listOfRepo : function(){
      return this.gitusers.reduce((acc, value)=>{
        console.log(value.repoSelected)
        for ( repo in value.repoSelected){
          acc.push(`${value.pseudo}/${value.repoSelected[repo]}`)
          let title = `${value.pseudo}/${value.repoSelected[repo]}`;
          if(this.commitsList[title] == undefined){
            this.commitsList[title] = { 'title': title, loading : true }
            this.getRepoData(value.pseudo, value.repoSelected[repo])
          }
        }
        console.log(this.commitsList)
        return acc
      }, [])
    },

    getCommitsList : function(){
      this.listOfRepo ;
      // TODO : ajouter pour supprimer les objects qui ne sont pas dans listOfRepo
      return this.commitsList;
    }

  }
})
