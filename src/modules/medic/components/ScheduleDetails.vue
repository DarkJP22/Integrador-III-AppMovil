<template>
  <ion-card>
    <ion-item>
      <ion-icon :md="calendarSharp" :ios="calendarOutline" slot="start"></ion-icon>
      <ion-label class="ion-text-wrap">
        <ion-text>
          <h3>{{ hours }}</h3>
        </ion-text>
        <p>{{ scheduleDate }}</p>
      </ion-label>
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
      <ion-icon :md="createSharp" :ios="createOutline" slot="start"></ion-icon>
      <ion-label class="ion-text-wrap">{{ officeType }}</ion-label>
    </ion-item>
  </ion-card>
  <div class="ion-padding">
    <ion-button type="submit" color="danger" expand="block" :disabled="isLoading" shape="round" @click="onCancel">
      Eliminar Horario
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonLabel,
  IonIcon,
  IonItem,
  IonCard,
  IonText,
} from "@ionic/vue";
import {
  personSharp,
  personOutline,
  calendarSharp,
  calendarOutline,
  locationSharp,
  locationOutline,
  createSharp,
  createOutline,
} from "ionicons/icons";
import useSchedules from "../composables/useSchedules";
import useUtilities from "@/composables/useUtilities";
import { computed } from "vue";
import useUi from "@/composables/useUi";


const emit = defineEmits(["scheduleDeleted"]);

const props = defineProps({
  schedule: {
    type: Object,
    required: true,
  },
});

const { isLoading, deleteSchedule } = useSchedules();
const { toastMessage, alertMessage } = useUi();

const { parseDate, parseTime12 } = useUtilities();

const scheduleDate = computed(() => {
  return parseDate(props.schedule.date);
});

const hours = computed(() => {
  return (
    parseTime12(props.schedule.start) +
    " - " +
    parseTime12(props.schedule.end)
  );
});

const office = computed(() => {
  return props.schedule.office.name;
});

const medic = computed(() => {
  return props.schedule.user.name;
});

const officeType = computed(() => {
  return props.schedule.office?.type_name;
});

const onCancel = async () => {
  const { role } = await alertMessage(
    "Cancelar Cita",
    "¿Estas seguro?",
    "Confirmar",
    '',
    true
  );

  if (role == "confirm") {
    const { ok, message } = await deleteSchedule(props.schedule.id);
    if (!ok) alertMessage("Error", message);
    else {
      emit("scheduleDeleted", { id: props.schedule.id });
      toastMessage("Programación eliminada correctamente");
    }
  }
};


</script>
