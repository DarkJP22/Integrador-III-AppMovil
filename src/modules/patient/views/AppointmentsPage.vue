<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Citas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item color="secondary" lines="none" class="ion-text-center">
        <ion-label class="ion-text-wrap">

          <p class="appointments-message">
            <!-- <ion-badge color="primary"
                ><ion-icon :md="informationCircleSharp" :ios="informationCircleOutline"></ion-icon
              ></ion-badge> -->
            Este apartado solo se muestran citas de los médicos afiliados
          </p>
        </ion-label>
      </ion-item>
      <ion-button id="trigger-button-appoinments" fill="clear" expand="full">{{ currentPatientName }}
        <ion-icon :md="chevronDownSharp" :ios="chevronDownOutline" slot="end"></ion-icon></ion-button>

      <ion-popover trigger="trigger-button-appoinments" :dismiss-on-select="true">
        <ion-content>
          <ion-list class="ion-padding">
            <ion-item lines="none" v-if="isLoadingPatients" class="ion-text-center">
              <ion-label>Cargando...</ion-label>
            </ion-item>
            <ion-item lines="none" v-if="!patients.length && !isLoadingPatients" class="ion-text-center">
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
import {
  chevronDownSharp,
  chevronDownOutline
} from "ionicons/icons";
import AppointmentsItem from "@/modules/patient/components/AppointmentsItem.vue";
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
  IonPopover,
  IonIcon,
  IonButton,
  // IonBadge,
  // IonIcon
} from "@ionic/vue";
import useAppointments from "@/modules/patient/composables/useAppointments";
import { onMounted, ref, computed, watch } from "vue";
import usePatients from "../composables/usePatients";


const segmentCase = ref("next");
const {
  patients,
  isLoading: isLoadingPatients,
  currentPatient,
} = usePatients();

const {
  getAppointments,
  nextAppointments,
  historyAppointments,
  isLoading,
} = useAppointments();

const changePatient = (patient: any) => {

  currentPatient.value.id = patient.id;
  currentPatient.value.name = patient.first_name;
  currentPatient.value.ide = patient.ide;
};

const assignCurrentPatient = async () => {
  if (!patients.value.length) return;

  if (!currentPatient.value.id) {
    currentPatient.value.id = patients.value[0].id;
    currentPatient.value.name = patients.value[0].first_name;
    currentPatient.value.ide = patients.value[0].ide;

  } else {

    await getAppointments(1, { patient_id: currentPatient.value.id });

  }
};
watch(currentPatient.value, async () => {
  await getAppointments(1, { patient_id: currentPatient.value.id });

});
watch(patients, () => {
  assignCurrentPatient();
});


onMounted(async () => {
  assignCurrentPatient();
  //await getAppointments();
});

const currentPatientName = computed(() => currentPatient.value.name);

</script>
<style scoped>
.appointments-message {
  display: flex;
  align-items: center;
  margin-top: 5px;
}
</style>
