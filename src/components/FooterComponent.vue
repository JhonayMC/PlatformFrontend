<template>    
    <footer class="main-footer" :class="(!menu) ? 'm-0': ''">        
        <div class="copyright">
            © 2024 M&M. Todos los derechos reservados
        </div>
    </footer>
</template>

<script setup>
    import moment from 'moment'
    import { ref } from 'vue'

    const props = defineProps({
        menu: {
            require: true,
            type: Boolean,
            default: false,
        }
    })

    let updated = moment().format('YYYY')

</script>

<style scoped>
.main-footer {
    bottom: 0;
    left: 0;
    position: fixed;
    display: flex;
    right: 0;
    background-color: var(--bs-theme-1);
    border-top: 1px solid #dee2e6;
    background: var(--bs-theme-1);
    
    padding:  .7rem var(--offcanvas-width);
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
.main-footer .copyright {
    text-align: center;
    padding-left: .5rem;
    color: var(--bs-light);
}

@media (max-width: 768px) {
    .main-footer {
        display: none;
    }
}

</style>