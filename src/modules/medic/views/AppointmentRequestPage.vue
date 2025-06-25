<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <!-- <ion-back-button default-href="/" text="" @click="backAction"></ion-back-button> -->
        </ion-buttons>
        <ion-title>Detalle de solicitud</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="isLoading" class="ion-text-center">
        <ion-spinner slot="start" class="spinner-button"></ion-spinner>
      </div>
      <div v-if="appointmentRequest">
        <AppointmentRequestPatientInfo :appointment-request="appointmentRequest" />
        <ion-row class="ion-justify-content-center" color="primary">
          <ion-col class="" size-md="12" size-lg="4" size-xs="12">
            <ion-button color="primary" expand="block" shape="round" @click="onSchedule" :disabled="isUpdating">
              {{ appointmentRequest?.scheduled_date ? 'Modificar Fecha' : 'Programar' }}
            </ion-button>
          </ion-col>
          <ion-col class="" size-md="6" size-lg="4" size-xs="12">
            <ion-button color="warning" expand="block" shape="round" @click="onPending" :disabled="isUpdating">
              Pendiente
            </ion-button>
          </ion-col>
          <ion-col class="" size-md="6" size-lg="4" size-xs="12">
            <ion-button color="danger" expand="block" shape="round" @click="onCancel" :disabled="isUpdating">
              Cancelar
            </ion-button>
          </ion-col>
        </ion-row>
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
  useIonRouter,
  IonButton,
  IonRow,
  IonCol,
  IonSpinner
} from "@ionic/vue";
import AppointmentRequestPatientInfo from "../components/AppointmentRequestPatientInfo.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import useAppointmentRequest from "../composables/useAppointmentRequest";
import useAppointmentRequestUpdateStatus from "../composables/useAppointmentRequestUpdateStatus";
import useUi from "@/composables/useUi";

const route = useRoute();
const ionRouter = useIonRouter();
const { id } = route.params;

const { appointmentRequest, isLoading } = useAppointmentRequest(+id);
const { updateStatus, isLoading: isUpdating } = useAppointmentRequestUpdateStatus();
const { alertMessage, toastMessage } = useUi();


const form = ref<{ id: number, status: number | undefined }>({
  id: +id,
  status: 2
});


const onPending = async () => {
  form.value.status = 2;
  updateStatus(form.value, {
    onSuccess: () => {
      toastMessage("Cita actualizada como pendiente correctamente");

      ionRouter.canGoBack() ? ionRouter.back() : ionRouter.replace({ name: 'medic-appointments' });

    },
    onError: (error) => {
      alertMessage("Error", error.message);
    }
  });

};

const onCancel = async () => {
  form.value.status = 3;
  updateStatus(form.value, {
    onSuccess: () => {
      toastMessage("Cita Cancelada correctamente");
      ionRouter.canGoBack() ? ionRouter.back() : ionRouter.replace({ name: 'medic-appointments' });
    },
    onError: (error) => {
      alertMessage("Error", error.message);
    }
  });

};
const onSchedule = () => {
  ionRouter.push({ name: 'medic-appointment-request-agendar', params: { id: appointmentRequest.value.id, medicId: appointmentRequest.value.medic_id, officeId: appointmentRequest.value.office_id } });
}



</script>
