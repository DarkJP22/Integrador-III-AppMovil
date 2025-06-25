<template>
  <EstheticAppointment v-if="appointment.is_esthetic" :appointment="appointment" />
  <ClinicAppointment v-else :appointment="appointment" />
</template>

<script setup lang="ts">
import ClinicAppointment from "@/modules/patient/components/ClinicAppointment.vue";
import EstheticAppointment from "@/modules/patient/components/EstheticAppointment.vue";

defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

</script>
