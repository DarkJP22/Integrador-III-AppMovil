<script setup lang="ts">
import useProvinces from '@/composables/useProvinces';
import { computed, onMounted, ref } from 'vue';
import { IonNote } from '@ionic/vue';

const { getDistrictName } = useProvinces();

const props = defineProps({
    offices: {
        type: Array,
        required: true
    }
});
const districts = ref<any[]>([]);

const officeDistricts = computed(() => {
    return [...new Set(districts.value)];
});
onMounted(() => {
    props.offices.forEach((office: any) => {
        districts.value.push(getDistrictName(office.province, office.canton, office.district));
    });
});


</script>
<template>
    <ion-note color=""><span>{{ officeDistricts.join(' - ') }}</span></ion-note>
</template>
<style></style>