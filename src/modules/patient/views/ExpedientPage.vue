<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Expediente </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button id="trigger-button" fill="clear" expand="full">{{ currentPatientName }}
        <ion-icon :md="chevronDownSharp" :ios="chevronDownOutline" slot="end"></ion-icon></ion-button>
      <ion-popover trigger="trigger-button" :dismiss-on-select="true">
        <ion-content>
          <ion-list class="ion-padding">
            <ion-item lines="none" v-if="isLoading" class="ion-text-center">
              <ion-label>Cargando...</ion-label>
            </ion-item>
            <ion-item lines="none" v-if="!patients.length && !isLoading" class="ion-text-center">
              <ion-label>No hay Pacientes registrados</ion-label>
            </ion-item>

            <ion-item v-for="item in patients" :key="item.id" lines="full" role="button" @click="changePatient(item)">
              <ion-label>
                <h2>{{ item.first_name }}</h2>
                <h3>{{ item.ide }}</h3>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>

      <ion-grid v-if="currentPatient.id">
        <ion-row class="ion-justify-content-center" color="primary">
          <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="'/patient/expedient/' + currentPatient.id + '/lab-results'
              ">
              <!-- <ion-icon :md="medkitSharp" :ios="medkitOutline" slot="start"></ion-icon> -->
              Mis Examenes
              <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="notificationsLabresults.length">{{ notificationsLabresults.length }}</ion-badge>
            </ion-button>
          </ion-col>
          <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="'/patient/expedient/' + currentPatient.id + '/signs'
              ">
              <!-- <ion-icon :md="thermometerSharp" :ios="thermometerOutline" slot="start"></ion-icon> -->
              Control de Signos</ion-button>
          </ion-col>


        </ion-row>
        <ion-row class="ion-justify-content-center" color="primary">
          <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="'/patient/expedient/' + currentPatient.id + '/medicines'
              ">
            
              Mis Medicamentos</ion-button>
          </ion-col>
          <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="'/patient/appointments'">
              <!-- <ion-icon :md="calendarSharp" :ios="calendarOutline" slot="start"></ion-icon> -->
              Historial de Citas</ion-button>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center" color="primary">
          <!-- <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="
            `/patient/expedient/${currentPatient.id}/compras`
            ">
             <ion-icon :md="cashSharp" :ios="cashOutline" slot="start"></ion-icon> 
              Historial Compras</ion-button>
          </ion-col> -->
          <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="'/patient/expedient/' + currentPatient.id + '/allergies'
              ">
              <!-- <ion-icon :md="manSharp" :ios="manOutline" slot="start"></ion-icon> -->
              Alergias Medicamentos</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonCol,
  IonRow,
  IonBadge,
} from "@ionic/vue";
import {
  chevronDownSharp,
  chevronDownOutline,
} from "ionicons/icons";
import { computed, onMounted, onUnmounted, watch } from "vue";
import useLabresults from "@/modules/patient/composables/useLabresults";
import usePatients from "../composables/usePatients";
import useAuth from "@/modules/auth/composables/useAuth";
import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";

const { auth } = useAuth();
const { patients, isLoading, currentPatient } = usePatients();
const { notificationsLabresults, addNotification } = useLabresults();
const { currentChannel } = useMyBroadcastEvents();
const assignCurrentPatient = () => {
  if (patients.value.length && !currentPatient.value.id) {
    const userPatient = patients.value.find(p => p.ide === auth.value.user.ide);
    currentPatient.value.id = userPatient ? userPatient.id : patients.value[0].id;
    currentPatient.value.name = userPatient ? userPatient.first_name : patients.value[0].first_name;
    currentPatient.value.ide = userPatient ? userPatient.ide : patients.value[0].ide;
  }
};

onMounted(async () => {
  assignCurrentPatient();
});

watch(patients, () => {
  assignCurrentPatient();
});

onMounted(() => {
  currentChannel.value?.listen('LabResultCreatedEvent', (data: any) => {
      addNotification(data.labresult);
    });
});
onUnmounted(() => {
  currentChannel.value?.stopListening('LabResultCreatedEvent');
});

const changePatient = (patient: any) => {
  currentPatient.value.id = patient.id;
  currentPatient.value.name = patient.first_name;
  currentPatient.value.ide = patient.ide;
};


const currentPatientName = computed(() => currentPatient.value.name);

</script>
