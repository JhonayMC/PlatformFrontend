<template>
    <ul class="nav nav-pills justify-content-between bg-white border rounded-lg">
        <li v-for="(step, index) in steps" :key="index" class="nav-item step rounded-lg">
            <a 
                :class="`nav-link rounded-lg ${step.activo ? 'active' : ''} ${step.enable ? 'enable' : 'disabled'}`"
                @click="selectStep(index + 1)"
            >
                <h5>Paso {{ step.id }}</h5> 
                <span>{{ step.titulo }}</span>
            </a>
        </li>
    </ul>
</template>

<script setup>

const props = defineProps({
    steps: Array,
    activeStep: Number
})

const emit = defineEmits(['update:activeStep'])

const selectStep = (step) => {
    if (props.steps[step - 1].enable) {
        emit('update:activeStep', step)
    }
}

</script>

<style scoped>
.step {
    width: 20%; 
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
.step a {
    width: 100%;
}

.nav-link.active {
    border-radius: .8rem;
    background: var(--bs-theme-1);
}

.nav-link.enable {
    cursor: pointer;
}

.nav-link.disabled {
    cursor: not-allowed;
}
</style>
