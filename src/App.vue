<template>
  <router-view></router-view>
  
  <div class="load-overlay">
    <span class="dashboard-spinner spinner-xxl"></span>
  </div>
  <div v-if="$storeOption.getters.getCargando > 0" class="load-overlay-global open">
    <span class="dashboard-spinner spinner-xxl"></span>
    <span @click="$Util.limpiarCarga" class="close">
      <i class="far fa-close"></i>
    </span>
  </div>
</template>
<script setup>  
</script>
<style scoped>
</style>
