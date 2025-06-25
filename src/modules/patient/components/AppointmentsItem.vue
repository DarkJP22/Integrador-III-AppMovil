<template>
  <ion-item @click="showDetails">
    <ion-label>
      <h2>{{ appointmentDate }}</h2>
      <h3>{{ appointmentTitle }}</h3>
      <p>{{ hours }}</p>
      <p>{{ medicName }}</p>
      <p>{{ clinicName }}</p>
      <ion-badge color="danger" v-if="appointment.status !== 1 && isHistory">No atendida o cancelada</ion-badge>
    </ion-label>
    <ion-button slot="end" fill="clear" @click="showDetails">
      <ion-icon :ios="arrowForwardCircleOutline" :md="arrowForwardCircleSharp"></ion-icon>
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
import { IonButton, IonLabel, IonIcon, IonItem, IonBadge } from "@ionic/vue";
import {
  arrowForwardCircleOutline,
  arrowForwardCircleSharp,
} from "ionicons/icons";

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

const { parseDate, parseTime12 } = useUtilities();
const router = useRouter();

const appointmentDate = computed(() => {
  return parseDate(props.appointment.date);
});
const appointmentTitle = computed(() => {
  return props.appointment.title;
});

const medicName = computed(() => {
  const prefix = props.appointment.user?.type_of_health_professional === 'medico' ? 'Dr(a).' : 'Lic.';
  return `${prefix} ${props.appointment.user?.name}`;
});
const clinicName = computed(() => {
  return props.appointment.office?.name;
});

const hours = computed(() => {
  return (
    parseTime12(props.appointment.start) +
    " - " +
    parseTime12(props.appointment.end ?? props.appointment.start)
  );
});

const isHistory = computed(() => {
  return props.from == "history";
});
const showDetails = () => {
  router.push("/patient/appointments/" + props.appointment.id);
};

</script>
