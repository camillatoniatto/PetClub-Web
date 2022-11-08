<template>
    <v-container>
      <!-- titulo -->
      <h1 class="text-left ml-3">Agenda</h1>
  
      <Scheduler/>
  
    </v-container>
  </template>
  
  <script>
   import Scheduler from '@/components/scheduler/Scheduler.vue'
  
    export default {
      name: 'PageScheduler',
      components: {
        Scheduler
      },
      data() {
        return {
          log: true
        }
      }
    }
    </script>