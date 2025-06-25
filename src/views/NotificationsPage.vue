<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Notificaciones</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="onRefresh">
            <ion-icon :md="refreshSharp" :ios="refreshOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" @click="setOpen(true)" v-if="auth.isPatient">
            <ion-icon :md="settingsSharp" :ios="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!notifications.length && !isLoading" class="ion-text-center">
          <ion-label>No hay notificaciones</ion-label>
        </ion-item>
        <ion-card v-for="notification in notifications" :key="notification.id">
          <img :src="notification.data.media" v-if="notification.data.media && notification.data.mediaType == 'image'" />
          <div class="player" v-html="convertEmbedUrl(notification.data.media)" v-if="notification.data.media && notification.data.mediaType == 'video'"></div>
          <ion-card-header>
            <ion-card-subtitle>{{ parseDatetime(notification.created_at) }}</ion-card-subtitle>
            <ion-card-title>{{ notification.data.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-html="notification.data.body"></div>

            <ion-item lines="none">
              <ion-button slot="end" fill="solid" expand="block" @click="onConfirmDelete(notification)" color="danger">
                <ion-icon :ios="trashOutline" :md="trashSharp"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-modal :is-open="isOpenRef" @didDismiss="setOpen(false)">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Configuración</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="setOpen(false)" :disabled="isLoading">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Recibir notificaciones de:</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item lines="full">
                <ion-label> Farmacias </ion-label>
                <ion-toggle color="primary" v-model="form.pharmacy_notifications" @IonChange="onSave"></ion-toggle>
              </ion-item>
              <ion-item lines="full">
                <ion-label> Clínicas </ion-label>
                <ion-toggle color="primary" v-model="form.clinic_notifications" @IonChange="onSave"></ion-toggle>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonModal,
  IonToggle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  onIonViewDidEnter,
} from "@ionic/vue";
import {
  trashOutline,
  trashSharp,
  refreshSharp,
  refreshOutline,
  settingsSharp,
  settingsOutline,
} from "ionicons/icons";

import { ref } from "vue";
import useNotifications from "@/composables/useNotifications";
import useUtilities from "@/composables/useUtilities";
import useUi from "@/composables/useUi";
import useAuth from "@/modules/auth/composables/useAuth";

const { auth } = useAuth();
const {
  notifications,
  getNotifications,
  onConfirmDelete,
  isLoading,
  currentPage,
  lastPage,
  nextPage,
  updateConfigNoti,
  clearNotifications
} = useNotifications();
const { convertEmbedUrl, parseDatetime } = useUtilities();
const { alertMessage, toastMessage } = useUi();
const isOpenRef = ref(false);
const setOpen = (state: boolean) => (isOpenRef.value = state);
const form = ref({
  pharmacy_notifications: auth.value.user.pharmacy_notifications,
  clinic_notifications: auth.value.user.clinic_notifications,
});
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

const onSave = async () => {
  const { ok, message } = await updateConfigNoti(form.value);
  if (!ok) alertMessage("Error", message);
  else toastMessage("Guardado correctamente");
};

const onRefresh = async () => {
  await getNotifications();
  isDisabled.value = false;
};

onIonViewDidEnter(async () => {
  clearNotifications();
});
</script>
