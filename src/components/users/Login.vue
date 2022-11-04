<template>
<div id="app">
  <v-app id="inspire">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card ref="form">
            <v-card-title>
              <v-icon large left>mdi-login</v-icon>
               <span class="text-h5 font-weight-light">PetClub</span>
            </v-card-title>

            <v-card-text>
              <v-text-field v-model="login.userName" type="text" label="Login" required></v-text-field>
              <v-text-field v-model="login.password" type="password" label="Senha" required></v-text-field>
            </v-card-text>
          <v-divider class="mt-12"></v-divider>
          <v-card-actions>
            <v-btn text>
              Cancelar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="loginUser(login)">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</div>
</template>

<script>
import register from '@/store/modules/users'
export default {
    name: 'PageLogin',
    data () {
      return {
        login: {
          userName: '',
          password: '',
          refreshToken: '',
          grantType: 'password',
        },
        responseLogin: {
          accessToken: '',
          refreshToken: '',
          expiresIn: '',
          dateExpire: '',
          idUser: '',
          fullName: '',
          cpf: '',
          email: '',
          birthdate: '',
          lastNumberCard: '',
          nameCard: '',
          phoneNumber: '',
          image: '',
          userPerfil: '',
          isAdmin: false,
          isPartner: false
        },
        loading: true,
        errors: [],
    }
  },
  methods:{
    async loginUser(login) {
        await register.loginUser(login).then(response => {

        window.localStorage.clear('accessToken');
        window.localStorage.clear('idUser');
        window.localStorage.clear('isAdmin');
        window.localStorage.clear('isPartner');
        window.localStorage.clear('cpf');
        window.localStorage.clear('fullName');

        this.responseLogin = response.data.data
        window.localStorage.setItem('accessToken', response.data.data['accessToken']);
        // window.localStorage.setItem('dateExpire', response.data.data['dateExpire']);
        window.localStorage.setItem('idUser', response.data.data['idUser']);
        window.localStorage.setItem('isAdmin', response.data.data['isAdmin']);
        window.localStorage.setItem('isPartner', response.data.data['isPartner']);
        window.localStorage.setItem('cpf', response.data.data['cpf']);
        window.localStorage.setItem('fullName', response.data.data['fullName']);
        console.log('LOGADO!: ', response.data.data)
        console.log('LOGADO localStorage!: ', window.localStorage.getItem('accessToken'))
        if(response.data.success === true){
          this.$router.push(this.$route.query.redirect || '/')
        }
      }).catch(e => {
        console.log('ERRO LOGIN: ',e)
      })
    },
  }
}
</script>