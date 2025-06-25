<template>
  <ion-item>
    <ion-label>
      <h2>Monto: {{ paymentTotal }}</h2>
      <p>{{ paymentDate }}</p>
      <small>{{ payment.comprobante }} </small>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem } from "@ionic/vue";
import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";

const props = defineProps({
  payment: {
    type: Object,
    required: true,
  },
  CodigoMoneda: {
    type: String,
    required: true,
  },
});

const { moneyFormat, parseDatetime } = useUtilities();

const paymentDate = computed(() => {
  return parseDatetime(props.payment.created_at);
});

const paymentTotal = computed(() => {
  return moneyFormat(props.payment.amount, props.CodigoMoneda);
});

</script>
