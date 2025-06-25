<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Consultorios</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" router-link="/medic/offices/new"><ion-icon :md="addSharp" :ios="addOutline"></ion-icon></ion-button>
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
        <ion-item lines="none" v-if="!offices.length && !isLoading" class="ion-text-center">
          <ion-label>No hay consultorios registrados</ion-label>
        </ion-item>

        <ion-item v-for="item in offices" :key="item.id" lines="full">
          <ion-label :router-link="'/medic/offices/' + item.id">
            <h2>{{ item.name }}</h2>
            <h3>{{ item.address }}</h3>
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
  //IonSearchbar,
} from "@ionic/vue";
import {
  ellipsisHorizontal,
  ellipsisVertical,
  addSharp,
  addOutline,
} from "ionicons/icons";

import { onMounted, ref } from "vue";
import useOffices from "@/modules/medic/composables/useOffices";

const {
  offices,
  getOffices,
  isLoading,
  currentPage,
  nextPage,
  lastPage,
  presentOptions,
} = useOffices();

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

onMounted(async () => {
  await getOffices();
});


</script>
