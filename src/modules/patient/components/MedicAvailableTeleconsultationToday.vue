<template>
  <ion-badge color="warning" v-show="hasTeleconsulta">
    Disponible para Teleconsulta
  </ion-badge>
</template>
<script setup lang="ts">
import {
  IonBadge,
} from "@ionic/vue";
import { PropType } from "vue";
import useAvailabilitySchedule from "@/composables/useAvailabilitySchedule";

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  schedules: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  appointments: {
    type: Array as PropType<any[]>,
    default: () => []
  },
});

const { hasTeleconsulta } = useAvailabilitySchedule(props);

</script>