<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title> Cita reservada</ion-title>
        <ion-buttons slot="end">
          <ion-button default-href="/" text="" @click="onCancel" v-if="!isPastAppointment" :disabled="isLoading">Eiminar Cita</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div v-if="appointmentData.id">
        <NextAppointment v-if="appointmentData.status !== 1" :appointment="appointmentData" @appointmentDeleted="
          router.canGoBack()
            ? router.back()
            : router.replace({ name: 'patient-home' })
          "></NextAppointment>
        <HistoryAppointment v-else :appointment="appointmentData"></HistoryAppointment>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import NextAppointment from "@/modules/patient/components/NextAppointment.vue";
import HistoryAppointment from "@/modules/patient/components/HistoryAppointment.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/vue";
import useAppointments from "@/modules/patient/composables/useAppointments";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useUi from "@/composables/useUi";
import { isPast } from "date-fns";

const route = useRoute();
const router = useIonRouter();
const { id } = route.params;
const { getAppointment, deleteAppointment, isLoading } = useAppointments();
const { toastMessage, alertMessage } = useUi();

const appointmentData = ref<any>({});

const isPastAppointment = computed(() => {
  return isPast(new Date(appointmentData.value?.start));
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
    const { ok, message } = await deleteAppointment(+id);
    if (!ok) alertMessage("Error", message);
    else {

      toastMessage("Cita eliminada correctamente");

      router.canGoBack()
        ? router.back()
        : router.replace({ name: 'patient-home' })

    }
  }
};

onMounted(async () => {
  appointmentData.value = await getAppointment(parseInt(id.toString()));

});

</script>
