<template>
  <v-container>
    <!-- titulo -->
    <h1 class="text-left ml-3">Financeiro</h1>
    <v-container>
      <!-- abas -->
      <v-row no-gutters>
      <v-col cols="sm">
        <v-card class="pa-2" outlined tile @click="changeMyList"> Saídas e Entradas </v-card>
      </v-col>
      <!-- <v-col cols="sm">
        <v-card class="pa-2" outlined tile @click="changeMyListLog"> Log de Serviços </v-card>
      </v-col> -->
    </v-row>
    </v-container>

    <Bills v-if="!log"/>
    <!-- <LogServices v-else/> -->

  </v-container>
</template>

<script>
 import Bills from '@/components/cashflow/Bills.vue'
//  import LogServices from '@/components/partnerservices/LogServices.vue'

  export default {
    name: 'CashFlowView',
    components: {
      Bills,
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


