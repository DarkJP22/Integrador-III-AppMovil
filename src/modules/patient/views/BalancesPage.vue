<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Saldos Acumulados</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header color="primary">
          <ion-card-title class="ion-text-center"> Total </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="ion-text-center">
            <h1 class="ion-padding-top">{{ accumulatedAmount }}</h1>
            <div>
              <ion-button color="primary" :router-link="{ name: 'search-medics' }">
                Canjear
              </ion-button>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
      <ion-accordion-group class="">
        <ion-accordion value="history">
          <ion-item slot="header" color="secondary">
            <ion-label>Mis compras</ion-label>
          </ion-item>

          <ion-list slot="content">
            <BalancesItem v-for="balance in balances" :key="balance.id" :balance="balance" />
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import BalancesItem from "../components/BalancesItem.vue";
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAccordion,
  IonAccordionGroup,
  IonButton,
} from "@ionic/vue";
// import {
//   trashOutline,
//   trashSharp,
//   settingsSharp,
//   settingsOutline,
// } from "ionicons/icons";

import { computed, onMounted, ref } from "vue";
import useAccumulateds from "@/modules/patient/composables/useAccumulateds";
import useAuth from "@/modules/auth/composables/useAuth";
import useUtilities from "@/composables/useUtilities";

const { getAccumulated } = useAccumulateds();
const { moneyFormat } = useUtilities();
const { auth } = useAuth();
const accumulated = ref<any>({});
const accumulatedAmount = computed(() => {
  return moneyFormat(accumulated.value.acumulado);
});
const balances = ref<any>([]);

onMounted(async () => {
  accumulated.value = await getAccumulated(auth.value.accumulatedId);
  balances.value = accumulated.value.transactions;
});

</script>
