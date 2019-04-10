<template>
  <div id="app">
    <v-app>
      <header />
      <v-content>
        <v-container fluid><router-view></router-view></v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Header from '@/components/TheHeader'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style></style>
