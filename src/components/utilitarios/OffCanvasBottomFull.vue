<template>
  <div
    class="offcanvas offcanvas-bottom-full"
    tabindex="-1"
    :id="offcanvasId"
    ref="offcanvasElement"
    :aria-labelledby="offcanvasId + '-label'"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" :id="offcanvasId + '-label'">
        {{ currentTitle }}
      </h5>
      <!-- Botón de cierre condicional -->
      <button v-if="close" class="btn btn-sm btn-light" @click="confirmar">
        <i class="far fa-times"></i>
      </button>
    </div>
    <div class="offcanvas-body bg-light">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from "vue";
    import $ from "jquery";

    const emit = defineEmits(['reiniciarForm'])
    const props = defineProps({
        title: {
            type: String,
            default: "Offcanvas Bottom",
        },
        close: {
            type: Boolean,
            default: true, // Se muestra el botón por defecto
        },
        confirmacion: {
            type: Boolean,
            default: true
        }
    });

    const offcanvasElement = ref(null);
    const offcanvasId = ref("offcanvas-" + Math.random().toString(36).substr(2, 9)); // Generar ID único
    const currentTitle = ref(props.title);

    onMounted(() => {
        if (offcanvasElement.value) {
            $(offcanvasElement.value).hide();
        }
    });

    onUnmounted(() => {
        if (offcanvasElement.value) {
            $(offcanvasElement.value).hide();
        }
    });

    const show = (newTitle) => {
        if (newTitle) currentTitle.value = newTitle;
        if (offcanvasElement.value) {
            $(offcanvasElement.value).fadeIn(300).addClass("show");
        }
    };

    const hide = () => {
        if (offcanvasElement.value) {
            $(offcanvasElement.value).fadeOut(300).removeClass("show");
            emit('reiniciarForm')
        }
    };

    const confirmar = () => {
        if (!props.confirmacion) {
            hide()
            return
        }
        Swal.fire({
            title: "¿Estás seguro de salir?",
            text: "La información que ha ingresado se perderá",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                hide();
            }
        });
    };

defineExpose({ show, hide }); // Permite que el padre acceda a estas funciones
</script>

<style>
/* Puedes agregar estilos personalizados aquí si es necesario */
</style>
