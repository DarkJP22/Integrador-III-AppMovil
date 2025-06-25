<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Pacientes</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" router-link="/patient/patients/new"><ion-icon :md="addSharp" :ios="addOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- <ion-item lines="none" v-if="isLoading" class="ion-text-center">
        <ion-label>Cargando...</ion-label>
      </ion-item> -->
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!patients.length && !isLoading" class="ion-text-center">
          <ion-label>No hay Pacientes registrados</ion-label>
        </ion-item>

        <ion-item v-for="item in patients" :key="item.id" lines="full">
          <ion-label :router-link="'/patient/patients/' + item.id">
            <h2>{{ item.first_name }}</h2>
            <h3>{{ item.ide }}</h3>
            <ion-text color="danger" v-if="!item.complete_information">
              <small>Información Incompleta</small>
            </ion-text>
          </ion-label>
          <ion-button slot="end" fill="clear" @click="presentOptions(item)">
            <ion-icon :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
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
  IonLabel,
  IonIcon,
  IonItem,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonText
} from "@ionic/vue";
import {
  ellipsisHorizontal,
  ellipsisVertical,
  addSharp,
  addOutline,
} from "ionicons/icons";

import { ref } from "vue";
import usePatients from "@/modules/patient/composables/usePatients";

const {
  patients,
  isLoading,
  currentPage,
  nextPage,
  lastPage,
  presentOptions,
} = usePatients();


const isDisabled = ref(false);

const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {
  try {
    if (currentPage.value == lastPage.value) {
      ev.target.disabled = true;
      isDisabled.value = true;
      return;
    }

    await nextPage();

    ev.target.complete();
  } catch (error: any) {
    console.error(error);
  }
};

</script>
