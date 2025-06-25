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
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!commissions.length && !isLoading" class="ion-text-center">
          <ion-label>No hay Elementos registrados</ion-label>
        </ion-item>

        <CommissionsItem v-for="commission in commissions" :key="commission.id" :commission="commission" @click="showTransactions(commission)" />
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-modal :is-open="isOpenRef" @didDismiss="isOpenRef = false">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Transacciones</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="isOpenRef = false">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header color="primary">
            <ion-card-title class="ion-text-center">
              Comprobante
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="ion-text-center ion-margin-top">
              <!-- <h1 class="ion-padding-top">dd</h1> -->
              <a :href="comprobanteUrl" v-if="comprobanteUrl" target="_blank" download>Descargar</a>
              <ion-badge color="warning" v-else>Pendiente</ion-badge>
              <!-- <ion-button
              color="secondary"
              size="small"
              :router-link="'/medic/commissions'"
            >
              Ver Comisiones Pagadas
            </ion-button> -->
            </div>
          </ion-card-content>
        </ion-card>
        <ion-list class="ion-padding">
          <ion-item lines="none" v-if="!transactions.length && !isLoading" class="ion-text-center">
            <ion-label>No hay Elementos registrados</ion-label>
          </ion-item>

          <CommissionTransactionsItem v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" />
        </ion-list>
      </ion-content>
    </ion-modal>
    <!-- <ion-footer>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-label>
            <h2>Total Aplicado: {{ commissionPaid }}</h2>
            <h3>Total Generado: {{ commissionTotal }}</h3>
          </ion-label>
        </ion-title>
      </ion-toolbar>
    </ion-footer> -->
  </ion-page>
</template>

<script setup lang="ts">
import CommissionsItem from "../components/CommissionsItem.vue";
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
  IonLabel,
  IonItem,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonModal,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
onIonViewDidEnter,
} from "@ionic/vue";


import { onMounted, ref } from "vue";
//import useUtilities from "@/composables/useUtilities";
import useCommissions from "../composables/useCommissions";
//import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";
//const { subscribeUsers, pusherIsInit } = useMyBroadcastEvents();
const {
  clearNotifications,
  getCommissions,
  getTransactions,
  commissions,
  transactions,
  isLoading,
  currentPage,
  nextPage,
  lastPage,
  //addNotification
} = useCommissions();
//const { moneyFormat } = useUtilities();

const isOpenRef = ref(false);
const comprobanteUrl = ref("");
const showTransactions = async (commission: any) => {
  isOpenRef.value = true;
  if (commission?.id) {
    await getTransactions(commission.id);
    comprobanteUrl.value = commission.comprobante_url;
  }
};
// const { auth } = useAuth();
// const commissionPending = computed(() => {
//   return moneyFormat(totals.value?.TotalPending);
// });
// const commissionPaid = computed(() => {
//   return moneyFormat(totals.value?.TotalPaid);
// });
// const commissionTotal = computed(() => {
//   return moneyFormat(totals.value?.Total);
// });

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

// watch(pusherIsInit, (newVal) => {
//   if (newVal) {
//     subscribeUsers('CommissionPaidEvent', (data: any) => {
      
//       getCommissions();
//       addNotification(data.commission);
//     });
//   }
// }, { immediate: true });

onMounted(async () => {
  // clearNotifications();
  // await getCommissions();
});

onIonViewDidEnter(async() => {
  clearNotifications();
  await getCommissions();
});


</script>
