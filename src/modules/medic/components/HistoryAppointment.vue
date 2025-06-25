<template>
  <EstheticAppointment v-if="isEstheticAppointment" :appointment="appointment" />
  <ClinicAppointment v-else :appointment="appointment" />
</template>

<script setup lang="ts">
import useAuth from "@/modules/auth/composables/useAuth";
import { computed } from "vue";
import ClinicAppointment from "@/modules/patient/components/ClinicAppointment.vue";
import EstheticAppointment from "@/modules/patient/components/EstheticAppointment.vue";

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const { auth } = useAuth();

const isEstheticAppointment = computed(() => {
  return (
    auth.value.currentRole?.name === "esthetic" &&
    props.appointment.is_esthetic
  );
});

</script>
