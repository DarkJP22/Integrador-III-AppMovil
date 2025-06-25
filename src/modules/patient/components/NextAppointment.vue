<template>
  <ion-card>
    <ion-item>
      <ion-icon :md="calendarSharp" :ios="calendarOutline" slot="start"></ion-icon>
      <ion-label>{{ appointmentDate }} - {{ hours }}</ion-label>
    </ion-item>

    <ion-item>
      <ion-icon :md="locationSharp" :ios="locationOutline" slot="start"></ion-icon>
      <ion-label>{{ office }}</ion-label>
    </ion-item>

    <ion-item>
      <ion-icon :md="personSharp" :ios="personOutline" slot="start"></ion-icon>
      <ion-label>{{ medic }}</ion-label>
    </ion-item>

    <ion-item>
      <ion-icon :md="accessibilitySharp" :ios="accessibilityOutline" slot="start"></ion-icon>
      <ion-label>{{ patient }}</ion-label>
    </ion-item>
    <ion-item>
      <ion-icon :md="createSharp" :ios="createOutline" slot="start"></ion-icon>
      <ion-label class="ion-text-wrap">{{ reason }}</ion-label>
    </ion-item>
  </ion-card>
  <!-- <div class="ion-padding">
    <ion-button type="submit" color="danger" shape="round" fill="outline" :disabled="isLoading" @click="onCancel" v-if="!isPastAppointment">
      Cancelar Cita 
    </ion-button>
  </div> -->
</template>

<script setup lang="ts">
import { IonLabel, IonIcon, IonItem, IonCard } from "@ionic/vue";
import {
  accessibilitySharp,
  accessibilityOutline,
  personSharp,
  personOutline,
  calendarSharp,
  calendarOutline,
  locationSharp,
  locationOutline,
  createSharp,
  createOutline,
} from "ionicons/icons";
import useAppointments from "../composables/useAppointments";
import useUtilities from "@/composables/useUtilities";
import { computed } from "vue";
import useUi from "@/composables/useUi";
import { isPast } from "date-fns";


const emit = defineEmits(["appointmentDeleted", "fileUploaded"]);

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const { isLoading, deleteAppointment } = useAppointments();
const { toastMessage, alertMessage } = useUi();

const { parseDate, parseTime12 } = useUtilities();
const isPastAppointment = computed(() => {
  return isPast(new Date(props.appointment.start));
});

const appointmentDate = computed(() => {
  return parseDate(props.appointment.date);
});

const hours = computed(() => {
  return parseTime12(props.appointment.start);
});

const office = computed(() => {
  return props.appointment.office?.name;
});

const medic = computed(() => {
  return props.appointment.user?.name ?? props.appointment.medic_name;
});

const patient = computed(() => {
  return props.appointment.patient?.first_name;
});

const reason = computed(() => {
  return props.appointment.title;
});

const onCancel = async () => {

  const { role } = await alertMessage(
    "Cancelar Cita",
    "¿Estas seguro?",
    "Confirmar",
    null,
    true
  );

  if (role == "confirm") {
    const { ok, message } = await deleteAppointment(props.appointment.id);
    if (!ok) alertMessage("Error", message);
    else {
      emit("appointmentDeleted", { id: props.appointment.id });
      toastMessage("Cita eliminada correctamente");
    }
  }
};

</script>
