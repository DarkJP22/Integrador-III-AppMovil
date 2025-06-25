<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Resultados de {{ patient.first_name }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" :router-link="'/medic/patients/' + patient.id + '/lab-results/new'"><ion-icon :md="addSharp" :ios="addOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- <ion-searchbar
        placeholder="Buscar por nombre"
        debounce="500"
        v-model="filters.q"
      ></ion-searchbar> -->
      <!-- <ion-item lines="none" v-if="isLoading" class="ion-text-center">
        <ion-label>Cargando...</ion-label>
      </ion-item> -->
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!labresults.length && !isLoading" class="ion-text-center">
          <ion-label>No hay resultados registrados</ion-label>
        </ion-item>

        <ion-item v-for="item in labresults" :key="item.id" lines="full">
          <ion-label>
            <span @click="openFile(item.file_path)">
              <h2>{{ parseDate(item.date) }}</h2>
            </span>

          </ion-label>
          <ion-button slot="end" fill="clear" @click="openFile(item.file_path)">
            <ion-icon :ios="documentOutline" slot="end" :md="documentSharp"></ion-icon>
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
  // IonSearchbar,
} from "@ionic/vue";
import {
  addSharp,
  addOutline,
  documentOutline,
  documentSharp
} from "ionicons/icons";

import { onMounted, ref, watch } from "vue";
import useLabresults from "@/modules/medic/composables/useLabresults";
import { useRoute } from "vue-router";
import usePatients from "../composables/usePatients";
import useUtilities from "@/composables/useUtilities";

const { parseDate, openFile } = useUtilities();
const {
  labresults,
  isLoading,
  currentPage,
  getLabresults,
  nextPage,
  lastPage,
} = useLabresults();
const {
  getPatient,
} = usePatients();
const patient = ref<any>({});
const filters = ref({
  q: "",
});
const isDisabled = ref(false);
const route = useRoute();
const { id } = route.params;

const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {
  try {
    if (currentPage.value == lastPage.value) {
      ev.target.disabled = true;
      isDisabled.value = true;
      return;
    }

    await nextPage(+id, filters.value);

    ev.target.complete();
  } catch (error: any) {
    console.error(error);
  }
};

watch(filters.value, async () => {
  await getLabresults(+id, filters.value);
  isDisabled.value = false;
});

onMounted(async () => {
  await getLabresults(+id, { q: '' })
  patient.value = await getPatient(+id);
})

</script>
