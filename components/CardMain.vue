<template>
  <div class=" card-child card-report elevation-5">
    <div class="d-flex justify-center">
      <div
        class=" text-data text-primary d-flex align-center justify-space-between"
      >
        <img :src="iconSrc" class="img-icon icon-report mx-4" v-if="iconshow" />
        <h3>{{ title }}</h3>
      </div>
    </div>

    <div class=" mt-3 text-center" v-if="condition == true">
      <h2 class="margin success--text" v-if="value > 0">+{{ value }} บาท</h2>
      <h2 class="margin red--text" v-if="value < 0">{{ value }} บาท</h2>
    </div>
    <div class="card-icontitle mt-3 text-center" v-else>
      <h2 class=" margin " :class="titleclass">{{ value | numberFormat }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleclass: "",
    iconshow: {
      type: Boolean,
      default: true
    },
    condition: {
      type: Boolean,
      default: false
    },
    title: { type: String, default: "" },
    value: { type: [Number, String], default: "" },
    iconSrc: { type: String, default: "" }
  }
};
</script>

<style></style>
