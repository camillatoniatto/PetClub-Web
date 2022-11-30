<template>
  <v-container>
    <!-- titulo -->
    <h1 class="text-left ml-3">Meus Animais</h1>

    <Pets v-if="!log"/>

  </v-container>
</template>

<script>
 import Pets from '@/components/pets/PetUser.vue'

  export default {
    name: 'ServicesView',
    components: {
      Pets,
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