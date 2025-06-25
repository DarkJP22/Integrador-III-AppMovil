<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Autorizaciones de médicos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- <ion-item lines="none" v-if="isLoading" class="ion-text-center">
        <ion-label>Cargando...</ion-label>
      </ion-item> -->
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!medicAuthorizations.length && !isLoading" class="ion-text-center">
          <ion-label>No hay autorizaciones</ion-label>
        </ion-item>

        <ion-item v-for="item in medicAuthorizations" :key="item.id" lines="full">
          <ion-label>
            <h2>{{ item.user.type_of_health_professional === 'medico' ? 'Dr(a).' : 'Lic.' }} {{ item.user.name }}</h2>
            <small>Paciente: {{ item.patient.first_name }}</small>
            <!-- <ion-text color="danger" v-if="!item.complete_information">
              <small>Información Incompleta</small>
            </ion-text> -->
            <p>
              <ion-button slot="end" color="danger" @click="onConfirmDeauthorize(item)">
                Desautorizar
              </ion-button>
            </p>
          </ion-label>

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
  IonItem,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  //IonText
} from "@ionic/vue";
// import {
//   ellipsisHorizontal,
//   ellipsisVertical,
//   addSharp,
//   addOutline,
// } from "ionicons/icons";

import { ref } from "vue";
import useMedicAuthorizations from "../composables/useMedicAuthorizations";

const {
  medicAuthorizations,
  onConfirmDeauthorize,
  isLoading,
  currentPage,
  nextPage,
  lastPage,
} = useMedicAuthorizations();


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
