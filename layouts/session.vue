<template>
  <v-app dark>
    <v-container>
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
import dayjs from "dayjs";
export default {
  fetch() {
    this.$store.commit("set_logout");
    localStorage.clear();

    console.log(dayjs('16:30:01', 'HH:mm:ss').get('h'));
  
  }
};
</script>

<style></style>
