<template>
  <main class="mt-5 pt-3">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 px-3 py-2">
          <slot name="header"></slot>
        </div>
      </div>
      <div class="row">
        <slot></slot>
      </div>
    </div>
  </main>
</template>

<script setup>

  const props = defineProps({
      title: String,
  })


</script>

<style scoped>

</style>