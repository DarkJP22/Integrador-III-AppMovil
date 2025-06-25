<script setup lang="ts">
import useUtilities from '@/composables/useUtilities';
const { supportLink } = useUtilities();
</script>
<template>
    <a :href="supportLink" class="no-underline" target="_blank">
        <slot>Soporte</slot>
    </a>
</template>