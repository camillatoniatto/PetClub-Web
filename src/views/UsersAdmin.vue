<template>
  <v-container>
    <!-- titulo -->
    <h1 class="text-left ml-3">Usuários</h1>
    <v-container>
      <!-- abas -->
      <v-row no-gutters>
      <v-col cols="sm">
        <v-card class="pa-2" outlined tile @click="changeMyList"> Lista de Usuários </v-card>
      </v-col>
      <v-col cols="sm">
        <v-card class="pa-2" outlined tile @click="changeMyListAccount"> Minha Conta </v-card>
      </v-col>
    </v-row>
    </v-container>

    <UsersAdmin v-if="!myAccount"/>
    <MyUser v-else/>

  </v-container>
</template>

<script>
 import UsersAdmin from '@/components/users/UsersAdmin.vue'
 import MyUser from '@/components/users/MyUser.vue'

export default {
  name: 'UsersView',
  components: {
    UsersAdmin,
    MyUser
  },
  data() {
    return {
      myAccount: false
    }
  },
  methods: {
    changeMyList() {
          this.myAccount = false
    },
    changeMyListAccount() {
          this.myAccount = true
    }
  }
}
  </script>


