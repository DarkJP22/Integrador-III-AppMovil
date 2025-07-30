<template>
<ion-page>
  <ion-header :translucent="true">
    <ion-toolbar color="primary">
      <ion-buttons slot="start">
        <ion-back-button default-href="/" text=""></ion-back-button>
      </ion-buttons>
      <ion-title>Servicios Afiliados </ion-title>
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
    </ion-content>
  
      <div class="home-page ion-padding grid h-full place-items-center">
      <ion-grid class="mb-24">
         <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <div class="ion-text-center">
                <img v-if="darkModeActive" src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
                <img v-else src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
              </div>

            </ion-col>
          </ion-row>
      <ion-row class="ion-justify-content-center" color="primary">
        <ion-col class="" size-md="12" size-lg="12" size-xs="12">
          <ion-button color="primary" expand="block" size="large" fill="solid" shape="round" @click="isOpenModal = true">
        Afiliarse
          </ion-button>
          <ion-modal ref="loginModal" :is-open="isOpenModal" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
          <ion-button @click="cancel()">Cerrar</ion-button>
            </ion-buttons>
           
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="max-w-2xl mx-auto px-6 py-6 border border-gray-300 text-gray-800 dark:text-gray-100 rounded-xl bg-white/70 dark:bg-black/30 dark:border-gray-800 text-center">
             <h3 class="text-xl font-semibold mb-4">Términos y Condiciones</h3>
                <p>
                  Aquí van los términos y condiciones de afiliación. Por favor, léelos cuidadosamente antes de continuar.
                 </p>
             </div>
          <div class="ion-padding">
            <ion-button expand="block" shape="round" color="primary" @click="acceptTerms">
          Aceptar y continuar
            </ion-button>
          </div>
        </ion-content>
          </ion-modal>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-center" color="primary">
        <ion-col class="" size-md="12" size-lg="12" size-xs="12">
          <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="'/patient/home/'">
            Cancelar
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
       </div>
          
</ion-page>
</template>

<script setup lang="ts">
import useUi from "@/composables/useUi";

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
  IonIcon,
  IonModal,
  IonGrid,
  IonCol,
  IonRow,
  IonPopover,
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonNote,
} from "@ionic/vue";
import {
chevronDownSharp,
chevronDownOutline
} from "ionicons/icons";
import { computed, onMounted, onUnmounted, watch } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import useAllergies from "../composables/useAllergies";
import usePatients from "../composables/usePatients";
import useAuth from "@/modules/auth/composables/useAuth";
import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";
const isOpenRef = ref(false);
const isOpenModal = ref(false);
const router = useRouter();
const form = ref({
  name: "",
});

const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  form.value.name = "";
};
const { auth } = useAuth();
const { patients, isLoading, currentPatient } = usePatients();
const { currentChannel } = useMyBroadcastEvents();
const assignCurrentPatient = () => {
  if (patients.value.length && !currentPatient.value.id) {
    const userPatient = patients.value.find(p => p.ide === auth.value.user.ide);
    currentPatient.value.id = userPatient ? userPatient.id : patients.value[0].id;
    currentPatient.value.name = userPatient ? userPatient.first_name : patients.value[0].first_name;
    currentPatient.value.ide = userPatient ? userPatient.ide : patients.value[0].ide;
  }
};
const darkModeActive = computed(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches;
});
onMounted(async () => {
  assignCurrentPatient();
});

watch(patients, () => {
  assignCurrentPatient();
});
const changePatient = (patient: any) => {
  currentPatient.value.id = patient.id;
  currentPatient.value.name = patient.first_name;
  currentPatient.value.ide = patient.ide;
};

const currentPatientName = computed(() => currentPatient.value.name);

function onWillDismiss() {
  isOpenModal.value = false;
}
function acceptTerms() {
  isOpenModal.value = false;

   
  router.push('/patient/affiliation/register');
}


function cancel() {
  isOpenModal.value = false;
}

</script>
<style scoped>
.logo {
  max-width: 8rem;
}

.chart-wrapper {
  margin-top: 1rem;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.center-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-page {
  /* display: grid;
  place-items: center; */
  padding-top: 6rem;
  width: 100%;
}
</style>