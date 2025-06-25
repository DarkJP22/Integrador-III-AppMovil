<script setup lang="ts">
import { useGlobalSettings } from '@/composables/useGlobalSettings';
import  useUtilities from '@/composables/useUtilities';
import { IonNote } from '@ionic/vue';
import { computed } from 'vue';

const { mbToBytes, bytesToSize } = useUtilities();
const { maxUploadSizeInMb } = useGlobalSettings();

const maxSizeInBytes = computed(() => mbToBytes(maxUploadSizeInMb.value));

</script>
<template>
    <ion-note v-show="maxSizeInBytes">
        Tamaño máximo de archivo: {{ bytesToSize(maxSizeInBytes) }}
    </ion-note>
</template>
<style scoped>
ion-note {
    font-size: 0.8rem;
    color: var(--ion-color-primary);
    border: none;
}
</style>