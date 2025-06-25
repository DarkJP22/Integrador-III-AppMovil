<template>
  <ion-item @click="showDetails">
    <ion-label>
      <h2>Monto: {{ invoiceTotal }}</h2>
      <p>{{ invoiceDate }}</p>
      <ion-text color="primary">
        <small>{{ invoiceClinic }}</small>
      </ion-text>
    </ion-label>
    <ion-button slot="end" fill="clear" @click="showDetails">
      <ion-icon :ios="arrowForwardCircleOutline" :md="arrowForwardCircleSharp"></ion-icon>
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
import { IonButton, IonLabel, IonIcon, IonItem, IonText } from "@ionic/vue";
import {
  arrowForwardCircleOutline,
  arrowForwardCircleSharp,
} from "ionicons/icons";

import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";
import { useRouter } from "vue-router";


const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});

const { parseDatetime, moneyFormat } = useUtilities();
const router = useRouter();

const invoiceDate = computed(() => {
  return parseDatetime(props.invoice.created_at);
});
const invoiceClinic = computed(() => {
  return props.invoice.clinic?.name ?? '';
});
const invoiceTotal = computed(() => {
  return moneyFormat(
    props.invoice.TotalComprobante,
    props.invoice.CodigoMoneda
  );
});

const showDetails = () => {
  router.push("/patient/invoices/" + props.invoice.id);
};

</script>
