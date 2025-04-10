<template>
  <div class="row">
    <slot></slot>
    <div class="col-12">
      <label>Descripción del Reclamo</label>
      <textarea class="form-control" rows="3" v-model="descripcion"></textarea>
    </div>

    <div class="col-12">
      <label>Adjuntar Archivos</label>

      <div ref="dropzoneRef" class="dropzone"></div>

      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      <p>📷 Imágenes: {{ images.length }}</p>
      <p>🎥 Videos: {{ videos.length }}</p>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"
    import Dropzone from "dropzone"

    const descripcion = ref("")
    const images = ref([])
    const videos = ref([])
    const errorMessage = ref("")
    const dropzoneRef = ref(null)
    let dropzoneInstance = null

    const obtenerDatos = ()  => {
        return {
            descripcion: descripcion.value,
            images: images.value,
            videos: videos.value,
        }
    }

    const validar = () => {
        return images.value.length > 0 && videos.value.length > 0 && descripcion.value.trim() !== ""
    }

    const limpiar = () => {
        descripcion.value = ""
        images.value = []
        videos.value = []
        errorMessage.value = ""
        dropzoneInstance.removeAllFiles()
    }

    const iniciarDropzone = () => {
        dropzoneInstance = new Dropzone(dropzoneRef.value, {
            url: "#",
            autoProcessQueue: false,
            maxFilesize: 5,
            acceptedFiles: "image/jpeg, image/png, video/mp4",
            dictDefaultMessage:
            "Arrastra archivos aquí o haz clic para subir. <br> Solo Imágenes y Videos <br> <span><small>(Mínimo 1 Imagen y 1 Video)</small></span>",
            addRemoveLinks: true,
            dictRemoveFile: "❌ Eliminar",
            init: function () {
                this.on("addedfile", (file) => {
                    errorMessage.value = ""
                    if (file.size > 20 * 1024 * 1024) {
                        errorMessage.value = `El archivo ${file.name} excede los 20MB.`
                        this.removeFile(file)
                        return
                    }
                    if (file.type.startsWith("image/")) {
                        if (images.value.length >= 5) {
                            errorMessage.value = "Solo puedes subir hasta 5 imágenes."
                            this.removeFile(file);
                            return;
                        }
                        images.value.push(file);
                        } else if (file.type.startsWith("video/")) {
                        if (videos.value.length >= 5) {
                            errorMessage.value = "Solo puedes subir hasta 5 videos."
                            this.removeFile(file)
                            return
                        }
                        videos.value.push(file)
                    }
                })

                this.on("removedfile", (file) => {
                    images.value = images.value.filter((img) => img.name !== file.name)
                    videos.value = videos.value.filter((vid) => vid.name !== file.name)
                })
            },
        })
    }

    onMounted(() => {
        iniciarDropzone()
    })

    defineExpose({ validar, obtenerDatos, limpiar })
</script>

<style scoped>
.text-danger {
  color: red;
}
</style>
