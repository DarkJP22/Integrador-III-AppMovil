<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Pacientes</ion-title>
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
          <ion-label @click="goToPatientAppointments(item)">
            <h2>{{ item.first_name }}</h2>
            <h3>{{ item.ide }}</h3>
           
          </ion-label>
          <ion-badge slot="end" color="danger" v-if="item.unread_labresults_count">{{ item.unread_labresults_count }}</ion-badge>
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
  IonSearchbar,
  alertController,
  IonBadge,
  onIonViewDidEnter
} from "@ionic/vue";
import {
  ellipsisHorizontal,
  ellipsisVertical,
} from "ionicons/icons";

import { onMounted, onUnmounted, ref, watch } from "vue";
import usePatients from "@/modules/medic/composables/usePatients";
import useUi from "@/composables/useUi";

import { useRouter } from "vue-router";
import useLabresults from "../composables/useLabresults";
import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";

const { currentChannel } = useMyBroadcastEvents();
const { clearNotifications, addNotification } = useLabresults();
const {
  patients,
  isLoading,
  currentPage,
  getPatients,
  nextPage,
  lastPage,
  requestPatientAuthorization,
  checkPatientAuthorization,
  presentOptions,
} = usePatients();

const { alertMessage, toastMessage } = useUi();
const router = useRouter();
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

async function presentAuthorizationCodeAlert(patient: any) {
  const hideNumber = patient.phone_number?.slice(-4);
  const alert = await alertController.create({
    header: "Código de autorización",
    message: 'Se ha enviado un código de autorización al número de teléfono del paciente terminado en ' + hideNumber,
    backdropDismiss: false,
    buttons: [
      {
        cssClass: "secondary",
        text: "Confirmar",
        role: "confirm",
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
    ],
    inputs: [
      {
        placeholder: "Código",
      },
    ],
  });

  await alert.present();

  const { role, data } = await alert.onDidDismiss();

  if (role !== "confirm") return;

  const { ok, message } = await checkPatientAuthorization(patient.id, data.values[0]);

  if (!ok) {
    const { role } = await alertMessage(
      "Error",
      message,
      "Reintentar",
      null,
      true
    );

    if (role !== "confirm") {
      return;
    }

    await presentAuthorizationCodeAlert(patient);
  } else {
 

    toastMessage("Autorizado correctamente");

  }
}
const goToPatientAppointments = async (patient: any) => {

  if (patient.authorized_medic) {
    router.push("/medic/patients/" + patient.id + "/appointments");
  } else {
    // alertMessage('Citas de Pacientes', 'Este apartado solo esta disponible si el paciente te ha autorizado para ver su expediente')
    const alert = await alertController.create({
      header: "Citas de Pacientes",
      message: 'Este apartado solo esta disponible si el paciente te ha autorizado para ver su expediente. ¿Deseas solicitar acesso a su expediente? Solicita el código de confirmación',
      backdropDismiss: false,
      buttons: [
        {
          cssClass: "secondary",
          text: "Solicitar",
          role: "confirm",
          async handler() {
            const { ok } = await requestPatientAuthorization(patient);
            if (ok) {
              presentAuthorizationCodeAlert(patient);
            }
          },
        },
        {
          text: "Cerrar",
          role: "cancel",
        },
      ],

    });

    await alert.present();

  }


};

onIonViewDidEnter(async() => {
  clearNotifications();
  //await getPatients(filters.value);
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
