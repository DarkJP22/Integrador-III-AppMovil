<template>
  <ion-item>
    <ion-label>
      <h2>Saldo: {{ balanceTotal }}</h2>
      <p>{{ invoiceDate }}</p>
      <small>{{ balance.place }} - {{ numeroConsecutivo }} </small>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem } from "@ionic/vue";
import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";

const props = defineProps({
  balance: {
    type: Object,
    required: true,
  },
});

const { parseDatetime, moneyFormat } = useUtilities();

const invoiceDate = computed(() => {
  if (!props.balance.resource_type)
    return parseDatetime(props.balance.created_at);

  return props.balance.resource_type.includes("Invoice") &&
    props.balance.resource
    ? parseDatetime(props.balance.resource.created_at)
    : parseDatetime(props.balance.created_at);
});

const balanceTotal = computed(() => {
  return moneyFormat(
    props.balance.MontoTransaccion,
    props.balance.CodigoMoneda
  );
});
const numeroConsecutivo = computed(() => {
  if (!props.balance.resource_type) return props.balance.resource_id;
  return props.balance.resource_type.includes("Invoice") &&
    props.balance.resource
    ? props.balance.resource.NumeroConsecutivo
    : props.balance.resource_id;
});

</script>
