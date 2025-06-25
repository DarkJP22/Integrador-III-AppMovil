<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Pacientes con Resultados</ion-title>
        <ion-buttons slot="end">
          <!-- <ion-button fill="clear" router-link="/medic/patients/new"
            ><ion-icon :md="addSharp" :ios="addOutline"></ion-icon
          ></ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
      <!-- <ion-item lines="none" v-if="isLoading" class="ion-text-center">
        <ion-label>Cargando...</ion-label>
      </ion-item> -->
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!patients.length && !isLoading" class="ion-text-center">
          <ion-label>No hay Pacientes registrados</ion-label>
        </ion-item>

        <ion-item v-for="item in patients" :key="item.id" lines="full">
          <ion-label :router-link="'/medic/patients/' + item.id + '/lab-results'">
            <h2>{{ item.first_name }}</h2>
            <h3>{{ item.ide }}</h3>
          </ion-label>
          <ion-badge slot="end" color="danger" v-if="item.unread_labresults_count">{{ item.unread_labresults_count }}</ion-badge>
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
  //IonButton,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonBadge,
  IonItem,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonSearchbar,
  onIonViewDidEnter,
} from "@ionic/vue";

import { onMounted, onUnmounted, ref, watch } from "vue";
import usePatientsLabresults from "@/modules/medic/composables/usePatientsLabresults";
import useLabresults from "../composables/useLabresults";
import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";
const { currentChannel } = useMyBroadcastEvents();
const {
  patients,
  isLoading,
  currentPage,
  getPatients,
  nextPage,
  lastPage,
} = usePatientsLabresults();

const { clearNotifications, addNotification } = useLabresults();

const filters = ref({
  q: "",
  labresults: 1,
});
const isDisabled = ref(false);

const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {
  try {
    if (currentPage.value == lastPage.value) {
      ev.target.disabled = true;
      isDisabled.value = true;
      return;
    }

    await nextPage(filters.value);

    ev.target.complete();
  } catch (error: any) {
    console.error(error);
  }
};

watch(filters.value, async () => {
  await getPatients(filters.value);
  isDisabled.value = false;
});


onIonViewDidEnter(async() => {
  clearNotifications();
  await getPatients(filters.value);
});

onMounted(async () => {
  currentChannel.value?.listen('LabResultCreatedEvent', (data: any) => {
    console.log('LabResultCreatedEvent LabResultsPage', data.labresult);
      getPatients(filters.value);
      addNotification(data.labresult);
    });
});

onUnmounted(() => {
  currentChannel.value?.stopListening('LabResultCreatedEvent');
});

</script>
