<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Facturación</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item color="secondary" lines="none" class="ion-text-center">
        <ion-label class="ion-text-wrap">

          <p class="appointments-message">
            Compras en comercios Afiliados a Doctor Blue
          </p>
        </ion-label>
      </ion-item>
      <ion-button id="trigger-button-invoices" fill="clear" expand="full">{{ currentPatientName }}
        <ion-icon :md="chevronDownSharp" :ios="chevronDownOutline" slot="end"></ion-icon></ion-button>
      <ion-popover trigger="trigger-button-invoices" :dismiss-on-select="true">
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

      <ion-list>
        <ion-list-header>
          <h3>Historial de transacciones</h3>
        </ion-list-header>
        <ion-item lines="none" v-if="!invoices.length && !isLoading" class="ion-text-center">
          <ion-label>No hay registros disponibles</ion-label>
        </ion-item>
        <InvoicesItem v-for="invoice in invoices" :key="invoice.id" :invoice="invoice" />
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import InvoicesItem from "../components/InvoicesItem.vue";
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
  IonListHeader,
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPopover,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { chevronDownSharp, chevronDownOutline } from "ionicons/icons";
import { computed, onMounted, ref, watch } from "vue";
import useInvoices from "@/modules/patient/composables/useInvoices";
import usePatients from "../composables/usePatients";

const {
  getInvoices,
  nextPage,
  currentPage,
  lastPage,
  invoices,
  isLoading,
} = useInvoices();
const {
  patients,
  isLoading: isLoadingPatients,
  currentPatient,
} = usePatients();

const isDisabled = ref(false);

const changePatient = (patient: any) => {
  currentPatient.value.id = patient.id;
  currentPatient.value.name = patient.first_name;
  currentPatient.value.ide = patient.ide;
};

const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {
  try {
    if (currentPage.value == lastPage.value) {
      ev.target.disabled = true;
      isDisabled.value = true;
      return;
    }

    await nextPage(currentPatient.value.ide);

    ev.target.complete();
  } catch (error: any) {
    console.error(error);
  }
};

watch(currentPatient.value, async () => {
  await getInvoices(currentPatient.value.ide);
  isDisabled.value = false;
});
const assignCurrentPatient = async () => {
  if (!patients.value.length) return;

  if (!currentPatient.value.id) {
    currentPatient.value.id = patients.value[0].id;
    currentPatient.value.name = patients.value[0].first_name;
    currentPatient.value.ide = patients.value[0].ide;
  } else {
    await getInvoices(currentPatient.value.ide);
    isDisabled.value = false;
  }
};
watch(patients, () => {
  assignCurrentPatient();
});

onMounted(() => {
  assignCurrentPatient();
});

const currentPatientName = computed(() => currentPatient.value.name);

</script>
