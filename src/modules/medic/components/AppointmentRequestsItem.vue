<template>
  <ion-item>
    <ion-label>
      <h3>{{ appointmentPatientName }}</h3>
      <ion-text color="primary">
        <h2>{{ scheduledDate }}</h2>
      </ion-text>

      <ion-badge color="warning" v-if="appointment.status === 2" @click="showDetails">Pendiente</ion-badge>
      <ion-badge color="danger" v-if="appointment.status === 3" @click="showDetails">Cancelada</ion-badge>
      <ion-badge color="primary" v-if="appointment.status === 1" @click="showDetails">Agendada</ion-badge>

    </ion-label>

    <ion-button color="primary" size="small" slot="end" v-if="appointment.status === 0" @click="showDetails">
      {{ appointment.status === 3 ? 'Re-Agendar' : 'Agendar' }}</ion-button>
    <slot></slot>
   
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem, IonBadge, IonButton, IonText } from "@ionic/vue";
import { computed } from "vue";

import useUtilities from "@/composables/useUtilities";
import { useRouter } from "vue-router";


const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
});
const { parseDatetime } = useUtilities();
const router = useRouter();

// const appointmentDate = computed(() => {
//   return parseDate(props.appointment.date);
// });
const scheduledDate = computed(() => {
  return parseDatetime(props.appointment.start);
});

// const hours = computed(() => {
//   return (
//     parseTime12(props.appointment.date) +
//     " - " +
//     parseTime12(props.appointment.date)
//   );
// });

// const isHistory = computed(() => {
//   return props.from == "history";
// });
const appointmentPatientName = computed(() => {
  return props.appointment.patient?.first_name;
});
function showDetails() {
  // if (route === 'agendar') {
  //   router.push({ name: 'medic-appointment-request-agendar', params: { id: props.appointment.id, medicId: props.appointment.medic_id, officeId: props.appointment.office_id} });
  //   return;
  // }
  router.push({ name: 'medic-appointment-request', params: { id: props.appointment.id } });
}
</script>
