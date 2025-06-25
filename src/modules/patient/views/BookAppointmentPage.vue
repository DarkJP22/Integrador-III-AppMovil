<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Reservar Cita </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="goToHome">Ir a Inicio</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <NextAppointment v-if="appointment.id" :appointment="appointment" @appointmentDeleted="setOpen()" />
      <NewAppointment v-else  :medic-id="+medicId" :office-id="+officeId" :date="selectedDate" :patients="patients" @appointmentCreated="summaryAppointment" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import NextAppointment from "@/modules/patient/components/NextAppointment.vue";
import NewAppointment from "@/modules/patient/components/NewAppointment.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
useIonRouter,
} from "@ionic/vue";
import {  ref } from "vue";
import { useRoute } from "vue-router";

import usePatients from "../composables/usePatients";


    const route = useRoute();
    const router = useIonRouter();

    
    const { patients } = usePatients();
  
    const { medicId, officeId } = route.params;
    const appointment = ref<any>({});
    const selectedDate = ref("");
 
    const setOpen = () => {
      appointment.value = {};
    };

    const summaryAppointment = async (appo: any) => {
      appointment.value = appo;
    };

  
 function goToHome(){
    appointment.value = {};
    router.replace('/patient/home');
 }
  
</script>
<style>
.calendar-wrap {
  margin-top: 1rem;
  position: relative;
}

.clinicName {
  min-height: 20px;
  margin-bottom: 15px;
}
</style>
