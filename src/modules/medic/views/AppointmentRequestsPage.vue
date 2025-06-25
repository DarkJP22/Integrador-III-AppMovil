<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Solicitudes de Citas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
      <ion-item>
        <ion-select label="Filtrar" label-placement="floating" :multiple="true" v-model="filters.status">
          <ion-select-option value="">Todas</ion-select-option>
          <ion-select-option value="1">Agendada</ion-select-option>
          <ion-select-option value="2">Pendiente</ion-select-option>
          <ion-select-option value="3">Cancelada</ion-select-option>
        </ion-select>
      </ion-item>
      <!-- Default Segment -->
      <ion-segment v-model="segmentCase">
        <ion-segment-button value="next">
          <ion-label>Proximas</ion-label>
        </ion-segment-button>
        <ion-segment-button value="history">
          <ion-label>Historial</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div v-show="segmentCase == 'next'" class="ion-padding">
        <ion-list class="ion-padding">
          <ion-item lines="none" v-if="!nextAppointmentRequests.length && !isLoading" class="ion-text-center">
            <ion-label>No hay Citas registradas</ion-label>
          </ion-item>
          <AppointmentRequestsItem v-for="item in nextAppointmentRequests" :key="item.id" lines="full" :appointment="item" from="next"></AppointmentRequestsItem>
        </ion-list>
      </div>
      <div v-show="segmentCase == 'history'" class="ion-padding">
        <ion-list class="ion-padding">
          <ion-item lines="none" v-if="!historyAppointmentRequests.length && !isLoading" class="ion-text-center">
            <ion-label>No hay Citas registradas</ion-label>
          </ion-item>
          <AppointmentRequestsItem v-for="item in historyAppointmentRequests" :key="item.id" :appointment="item" lines="full" from="history"></AppointmentRequestsItem>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import AppointmentRequestsItem from "../components/AppointmentRequestsItem.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  onIonViewDidEnter,
} from "@ionic/vue";

import { ref } from "vue";
import useAppointmentRequests from "@/modules/medic/composables/useAppointmentRequests";

const segmentCase = ref("next");
const {
  // getAppointmentRequests,
  clearNotifications,
  nextAppointmentRequests,
  historyAppointmentRequests,
  isLoading,
  //nextPage,
  filters

} = useAppointmentRequests();


onIonViewDidEnter(() => {
  clearNotifications();
});


</script>
