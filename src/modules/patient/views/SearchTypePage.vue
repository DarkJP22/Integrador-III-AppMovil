<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Busqueda de profesionales</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="px-2 absolute top-0 left-0 inset-x-0">
        <MedicStories></MedicStories>
     </div>
     <div class="grid h-full place-items-center">
        <ion-grid >
          <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <div class="ion-text-center mb-4">
                <img v-if="darkModeActive" src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-20" />
                <img v-else src="@/assets/logo.png" alt="Doctor Blue" class="logo inline-block w-20" />
              </div>

            </ion-col>
          </ion-row>
            <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
              
  
              <ion-col class="" size-md="12" size-lg="12" size-xs="12" v-for="type in typesOfHealthProfessional" :key="type.id">
                <ion-button color="primary" expand="block" size="large" shape="round" :router-link="'/patient/search-medics?type='+ type.id">
                  {{ type.name }}</ion-button>
              </ion-col>
            
            </ion-row>
            
          </ion-grid>
        </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";


import { useGlobalSettings } from "@/composables/useGlobalSettings";
import { computed } from "vue";
import MedicStories from "@/components/MedicStories.vue";


const { typesOfHealthProfessional } = useGlobalSettings();
const darkModeActive = computed(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches;
});






</script>

