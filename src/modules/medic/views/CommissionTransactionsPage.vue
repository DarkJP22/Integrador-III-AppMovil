<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Comisión Laboratorio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header color="primary">
          <ion-card-title class="ion-text-center">
            Acumulado Pendiente
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="ion-text-center">
            <h1 class="ion-padding-top">{{ commissionPending }}</h1>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list class="ion-padding">
        <ion-list-header color="light">
          <b>Referidos</b>
        </ion-list-header>
        <ion-item lines="none" v-if="!commissionTransactions.length && !isLoading" class="ion-text-center">
          <ion-label>No hay Elementos registrados</ion-label>
        </ion-item>

        <CommissionTransactionsItem v-for="transaction in commissionTransactions" :key="transaction.id" :transaction="transaction" />
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-footer>
      <ion-toolbar color="">
        <ion-buttons slot="primary">
          <ion-button color="primary" :router-link="'/medic/commissions'">
            Ver Historial
          </ion-button>
        </ion-buttons>
        <ion-title>
          <ion-label>
            <!-- <h2>Total Aplicado: {{ commissionPaid }}</h2> -->
            <h3>Total: {{ commissionTotal }}</h3>
          </ion-label>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import CommissionTransactionsItem from "../components/CommissionTransactionsItem.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFooter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";


import { computed, onMounted, ref } from "vue";
import useUtilities from "@/composables/useUtilities";
import useCommissionTransactions from "../composables/useCommissionTransactions";
import useCommissions from "../composables/useCommissions";

const {
  getCommissionTransactions,
  commissionTransactions,
  totals,
  isLoading,
  currentPage,
  nextPage,
  lastPage,
} = useCommissionTransactions();
const { clearNotifications } = useCommissions();
const { moneyFormat } = useUtilities();
// const { auth } = useAuth();
const commissionPending = computed(() => {
  return moneyFormat(totals.value?.TotalPending);
});
// const commissionPaid = computed(() => {
//   return moneyFormat(totals.value?.TotalPaid);
// });
const commissionTotal = computed(() => {
  return moneyFormat(totals.value?.Total);
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

onMounted(async () => {
  clearNotifications();
  await getCommissionTransactions();
});


</script>
