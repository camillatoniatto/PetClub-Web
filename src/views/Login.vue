<template>
  <v-container>
      <Login/>
  </v-container>
</template>

<script>
import Login from '@/components/users/Login.vue'

export default {
  name: 'AppLogin',
  components: {
      Login
  }
}
</script>