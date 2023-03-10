<template>
    <div class="loading" v-show="visible">
        <div class="spinner"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
