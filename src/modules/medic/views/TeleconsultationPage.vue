<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle de solicitud</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="isLoading" class="ion-text-center">
        <ion-spinner slot="start" class="spinner-button"></ion-spinner>
      </div>
      <div v-if="teleconsultation">
        <AppointmentRequestPatientInfo :appointment-request="teleconsultation" />
       
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonBackButton,
} from "@ionic/vue";
import AppointmentRequestPatientInfo from "../components/AppointmentRequestPatientInfo.vue";
import { useRoute } from "vue-router";

import useTeleconsultation from "../composables/useTeleconsultation";

const route = useRoute();
const { id } = route.params;

const { teleconsultation, isLoading } = useTeleconsultation(+id);





</script>
