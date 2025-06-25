<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle de cita</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="appointmentData.id">
        <NextAppointment v-if="!appointmentData.status" :appointment="appointmentData" @appointmentDeleted="
          router.canGoBack()
            ? router.back()
            : router.replace({ name: 'medic-home' })
          "></NextAppointment>
        <HistoryAppointment v-else :appointment="appointmentData"></HistoryAppointment>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import NextAppointment from "@/modules/patient/components/NextAppointment.vue";
import HistoryAppointment from "@/modules/medic/components/HistoryAppointment.vue";
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
import useAppointments from "@/modules/medic/composables/useAppointments";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useIonRouter();
const { id } = route.params;
const { getAppointment } = useAppointments();
const appointmentData = ref<any>({});

onMounted(async () => {
  appointmentData.value = await getAppointment(parseInt(id.toString()));
  
});


</script>
