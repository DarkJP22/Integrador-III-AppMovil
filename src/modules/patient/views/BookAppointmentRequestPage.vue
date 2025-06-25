<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Reservar Cita </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="goToHome">Ir a inicio
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="appointmentRequest()">

     
      <ion-item>
        <ion-label>
        <ion-select label="A nombre de:" labelPlacement="floating" v-model="formAppointmentRequest.patient_id" required @ionChange="changePatient" :class="{ 'ion-invalid ion-touched': errors?.patient_id }" :errorText="errors?.patient_id">
          <ion-select-option :value="patient.id" v-for="patient in patients" :key="patient.id">{{ patient.fullname }}</ion-select-option>

        </ion-select>
        <ion-note color="danger" v-if="errors.patient_id">{{
          errors.patient_id[0]
        }}</ion-note>
        </ion-label>
      </ion-item>
      <div class="ion-padding">
        <ion-button type="submit" :strong="true" expand="block" shape="round" :disabled="isLoading">Confirmar</ion-button>

      </div>
    </form>
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
  IonBackButton,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonNote,
  useIonRouter,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import usePatients from "../composables/usePatients";
import useAuth from "@/modules/auth/composables/useAuth";
import useAppointmentRequests from "../composables/useAppointmentRequests";
import useUi from "@/composables/useUi";

const { auth } = useAuth();
const route = useRoute();
const router = useIonRouter();

const { alertMessage } = useUi();
const { patients, currentPatient } = usePatients();
const { createAppointmentRequest, isLoading, errors } = useAppointmentRequests();

const { medicId, officeId } = route.params;

const formAppointmentRequest = ref({
  medic_id: +medicId,
  user_id: auth.value.user?.id ?? null,
  patient_id: currentPatient.value?.id ?? null,
  office_id: +officeId
});

const changePatient = () => {

  const patient = patients.value.find(p => p.id === formAppointmentRequest.value.patient_id);

  if (patient) {
    currentPatient.value.id = patient.id;
    currentPatient.value.name = patient.first_name;
    currentPatient.value.ide = patient.ide;
  }

};

const appointmentRequest = async () => {
  const { ok, message } = await createAppointmentRequest(formAppointmentRequest.value);
  if (!ok) alertMessage("Error", message);
  else {

    alertMessage("Solicitud enviada", "Tu solicitud ha sido enviada correctamente");
    goToHome();
  }
};


function goToHome() {
  router.replace('/patient/home');
}

onMounted(async () => {

  formAppointmentRequest.value.patient_id = currentPatient.value?.id ?? (patients.value[0]?.id ?? null)
  changePatient();

});
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
