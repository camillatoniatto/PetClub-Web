<template>
  <v-app>
    <v-navigation-drawer
      dark
      permanent
      app
      class="blue-grey darken-4"
      v-if="$router.currentRoute.path != '/login'"
    >
      <!-- <center><v-avatar color="white" size="150"></v-avatar></center> -->

      <img src="./assets/logo.png" :aspect-ratio="16/9"
      :width="200"/>
      <br />

      <v-subheader dark class="text-center"
        >Olá, {{ user.fullName }}</v-subheader
      >

      <hr />
      <br />

      <v-list v-if="userAcess">
        <v-list-item
          v-for="item in userAdmin === 'true'
            ? itemsAdmin
            : userPartner === 'true'
            ? itemsPartner
            : itemsClient"
          :key="item.link"
          link
          router-link
          :to="item.patch"
          tag="button"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block light class="blue-grey lighten-5" @click="logout">
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app dark class="blue-grey darken-3">
      <!-- -->
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app class="blue-grey darken-4">
      <!-- <v-container fluid> -->
      <!-- <v-card-text>
              <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" icon>
                <v-icon size="24px">
                  {{ icon }}
                </v-icon>
              </v-btn>
            </v-card-text>
            <v-divider></v-divider> -->
      <!-- <v-card-text class="white--text">
              {{ new Date().getFullYear() }} — <strong>PetClub</strong>
            </v-card-text>
        </v-container> -->
    </v-footer>
  </v-app>
</template>

<script>
// import setUser from './store/index.js'

export default {
  data: () => ({
    itemsAdmin: [
      { title: "Início", icon: "mdi-view-dashboard", patch: "/" },
      { title: "Usuários", icon: "mdi-account-circle", patch: "/usersadmin" },
      { title: "Animais", icon: "mdi-paw", patch: "/pets" },
      { title: "Serviços", icon: "mdi-toolbox-outline", patch: "/servicesAdmin" },
      { title: "Financeiro", icon: "mdi-chart-line", patch: "/cashflowadmin" },
    ],
    itemsPartner: [
      { title: "Início", icon: "mdi-view-dashboard", patch: "/" },
      { title: "Clientes", icon: "mdi-account-circle", patch: "/userspartner" },
      { title: "Animais", icon: "mdi-paw", patch: "/petspartner" },
      { title: "Serviços", icon: "mdi-toolbox-outline", patch: "/services" },
      { title: "Agenda", icon: "mdi-calendar-multiselect", patch: "/scheduler"},
      { title: "Vendas", icon: "mdi-account-cash", patch: "/purchaseorder" },
      { title: "Financeiro", icon: "mdi-chart-line", patch: "/cashflow" },
    ],
    itemsClient: [
      { title: "Início", icon: "mdi-view-dashboard", patch: "/" },
      { title: "Minha Conta", icon: "mdi-account-circle", patch: "/myaccount" },
      { title: "Meus Pets", icon: "mdi-paw", patch: "/petsuser" },
      { title: "Compras", icon: "mdi-account-cash", patch: "/myorders" },
    ],
    headers: [],
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    user: {
      fullName: window.localStorage.getItem("fullName"),
      isAdmin: window.localStorage.getItem("isAdmin"),
      isPartner: window.localStorage.getItem("isPartner"),
      token: window.localStorage.getItem("acessToken"),
    },
    welcome: ''
  }),
  computed: {
    userAdmin() {
      return window.localStorage.getItem("isAdmin");
    },
    userPartner() {
      return window.localStorage.getItem("isPartner");
    },
    userAcess() {
      console.log('acess user', window.localStorage.getItem("fullName") != null)
      return window.localStorage.getItem("fullName") != null
    },
    // userName(){
    //   if(window.localStorage.clear("fullName")){
    //     this.welcome = `Olá, ${this.user.fullName}`
    //   }
    // }
  },
  updated() {
    console.log("mounted");
    this.showHeaders();
  },
  methods: {
    logout() {
      window.localStorage.clear("accessToken");
      window.localStorage.clear("idUser");
      window.localStorage.clear("isAdmin");
      window.localStorage.clear("isPartner");
      window.localStorage.clear("cpf");
      window.localStorage.clear("fullName");
      this.$router.push(this.$route.query.redirect || "/login");
    },
    showHeaders() {
      this.user.fullName = window.localStorage.getItem("fullName");
      this.user.isAdmin = window.localStorage.getItem("isAdmin");
      this.user.isPartner = window.localStorage.getItem("isPartner");
      if (window.localStorage.getItem("isAdmin") === "true") {
        this.headers = this.itemsAdmin;
      } else if (window.localStorage.getItem("isPartner") === "true") {
        this.headers = this.itemsPartner;
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
