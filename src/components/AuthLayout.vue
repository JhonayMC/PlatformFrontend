<template>
  <div>
    <div class="background-image">
      <router-view></router-view>
    </div>
    <div class="footer">
        <p>© 2024 M&M. Todos los derechos reservados</p>
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style scoped>
  .footer {
    position:absolute;
    width: 100%;
    bottom: 0;
    background: var(--bs-dark);
    color: var(--bs-text-dark);
    text-align: center;
    padding-top: .5rem;
    padding-bottom: .5rem;
  }
  .background-image {
    height: 100%; 
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>