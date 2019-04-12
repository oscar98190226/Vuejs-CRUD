<template>
  <div id="app">
    <v-app>
      <app-header />
      <v-content>
        <v-container fluid><router-view></router-view></v-container>
      </v-content>
      <notifications group="alert" position="bottom right" />
    </v-app>
  </div>
</template>

<script>
import AppHeader from '@/components/TheHeader'

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style></style>
