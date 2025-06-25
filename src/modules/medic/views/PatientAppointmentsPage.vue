<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Citas {{ patient.first_name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Default Segment -->
      <ion-segment v-model="segmentCase">

        <ion-segment-button value="history">
          <ion-label>Historial</ion-label>
        </ion-segment-button>
        <ion-segment-button value="next">
          <ion-label>Proximas</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div v-show="segmentCase == 'next'" class="ion-padding">
        <ion-list class="ion-padding">
          <ion-item lines="none" v-if="!nextAppointments.length && !isLoading" class="ion-text-center">
            <ion-label>No hay Citas registradas</ion-label>
          </ion-item>
          <AppointmentsItem v-for="item in nextAppointments" :key="item.id" lines="full" :appointment="item" from="next"></AppointmentsItem>
        </ion-list>
      </div>
      <div v-show="segmentCase == 'history'" class="ion-padding">
        <ion-list class="ion-padding">
          <ion-item lines="none" v-if="!historyAppointments.length && !isLoading" class="ion-text-center">
            <ion-label>No hay Citas registradas</ion-label>
          </ion-item>
          <AppointmentsItem v-for="item in historyAppointments" :key="item.id" :appointment="item" lines="full" from="history"></AppointmentsItem>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import AppointmentsItem from "@/modules/medic/components/AppointmentsItem.vue";
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
} from "@ionic/vue";
import useAppointments from "@/modules/medic/composables/useAppointments";
import { onMounted, ref } from "vue";

import { useRoute } from "vue-router";
import usePatients from "../composables/usePatients";

const route = useRoute();
const { id } = route.params;

const segmentCase = ref("history");

const {
  getPatient,
} = usePatients();

const {
  getPatientAppointments,
  nextAppointments,
  historyAppointments,
  isLoading,

} = useAppointments();

const patient = ref<any>({});

onMounted(async () => {

  await getPatientAppointments(+id);
  patient.value = await getPatient(+id);
});

</script>
