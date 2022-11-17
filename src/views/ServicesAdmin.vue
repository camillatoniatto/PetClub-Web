<template>
  <v-container>
    <!-- titulo -->
    <h1 class="text-left ml-3">Serviços</h1>
    <Services/>

  </v-container>
</template>

<script>
 import Services from '@/components/partnerservices/ServicesAdmin.vue'

  export default {
    name: 'ServicesView',
    components: {
      Services
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


