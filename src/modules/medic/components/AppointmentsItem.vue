<template>
  <ion-item>
    <ion-label>

      <h3>{{ appointmentPatientName }}</h3>
      <!-- <p><small>{{ appointmentDate }}</small></p> -->
      <ion-text color="primary">
        <h2>{{ hours }}</h2>
      </ion-text>
      <!-- <ion-badge color="danger" v-if="!appointment.status && isHistory"
        >No atendida</ion-badge
      > -->
      <ion-badge color="danger" v-if="appointment.status === 2 || appointment.status === 99" @click="$emit('onAgendar')">Cancelada</ion-badge>
      <ion-badge color="primary" v-if="appointment.status === 0" @click="$emit('onCancel')">Agendada</ion-badge>

      <div>
        <slot></slot>
      </div>

    </ion-label>

    <ion-button slot="end" fill="clear" @click="showDetails">
      <ion-icon :ios="arrowForwardCircleOutline" :md="arrowForwardCircleSharp"></ion-icon>
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
import { IonButton, IonLabel, IonIcon, IonItem, IonBadge, IonText } from "@ionic/vue";
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


const { parseDate, parseDatetime } = useUtilities();
const router = useRouter();

const appointmentDate = computed(() => {
  return parseDate(props.appointment.date);
});

const hours = computed(() => {
  return parseDatetime(props.appointment.start)
  // return (
  //   parseTime12(props.appointment.start) +
  //   " - " +
  //   parseTime12(props.appointment.end ?? props.appointment.start)
  // );
});
const isHistory = computed(() => {
  return props.from == "history";
});
const appointmentPatientName = computed(() => {
  return props.appointment.patient?.first_name;
});
function showDetails() {
  router.push("/medic/appointments/" + props.appointment.id);
}

</script>
