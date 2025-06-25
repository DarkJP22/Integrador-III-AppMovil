<template>
  <ion-item>
    <ion-label>
      <h3>{{ appointmentPatientName }}</h3>
      <ion-text color="primary">
        <h2>{{ scheduledDate }}</h2>
      </ion-text>

  
      <ion-badge color="primary" v-if="appointment.status === 0" @click="showDetails">Reservada</ion-badge>

    </ion-label>

  <ion-button slot="end" fill="clear" @click="showDetails">
      <ion-icon :ios="arrowForwardCircleOutline" :md="arrowForwardCircleSharp"></ion-icon>
    </ion-button>
   
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem, IonBadge, IonText, IonButton, IonIcon } from "@ionic/vue";
import { computed } from "vue";

import useUtilities from "@/composables/useUtilities";
import { useRouter } from "vue-router";
import { arrowForwardCircleOutline, arrowForwardCircleSharp } from "ionicons/icons";


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
  router.push({ name: 'medic-teleconsultation', params: { id: props.appointment.id } });
}
</script>
