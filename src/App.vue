<template>
  <v-app>
    <v-content>
      <NavBar v-show="user.user" />
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
  computed: {
    ...mapState(['user']),
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Exo:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap');

#app {
  font-family: 'Exo', sans-serif;
}
</style>
