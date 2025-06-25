<script setup lang="ts">
import useProvinces from '@/composables/useProvinces';
import { computed } from 'vue';

const { getDistrictName } =
    useProvinces();

const props = defineProps({
    provinceId: {
        type: String,
        required: true
    },
    cantonId: {
        type: String,
        required: true
    },
    districtId: {
        type: String,
        required: true
    }
});
const districtName = computed(()=>{
    return getDistrictName(props.provinceId, props.cantonId, props.districtId);
});
</script>
<template>
    <span>{{ districtName }}</span>
</template>