<template>
  <v-app dark>
    <v-container>
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
export default {
  fetch() {
    this.$store.commit("set_logout");
    localStorage.clear();
  }
};
</script>

<style></style>
