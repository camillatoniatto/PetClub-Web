<template>
  <v-container>
    <!-- titulo -->
    <h1 class="text-left ml-3">Serviços</h1>
    <v-container>
      <!-- abas -->
      <v-row no-gutters>
      <v-col cols="sm">
        <v-card class="pa-2" outlined tile @click="changeMyList"> Lista de Serviços </v-card>
      </v-col>
      <v-col cols="sm">
        <v-card class="pa-2" outlined tile @click="changeMyListLog"> Serviços Arquivados </v-card>
      </v-col>
    </v-row>
    </v-container>

    <Services v-if="!log"/>
    <LogServices v-else/>

  </v-container>
</template>

<script>
 import Services from '@/components/partnerservices/Services.vue'
 import LogServices from '@/components/partnerservices/LogServices.vue'

  export default {
    name: 'ServicesView',
    components: {
      Services,
      LogServices
    },
    data() {
      return {
        log: false
      }
    },
    methods: {
      changeMyList() {
            this.log = false
      },
      changeMyListLog() {
            this.log = true
      }
    }
  }
  </script>


