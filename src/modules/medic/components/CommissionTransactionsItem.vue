<template>
  <ion-item>
    <ion-label>
      <h2>{{ cliente }}</h2>
      <p>{{ invoiceDate }}</p>
    </ion-label>
    <ion-note slot="end" color="primary">{{ transactionTotal }}</ion-note>
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem, IonNote } from "@ionic/vue";
import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";


const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const { parseDatetime, moneyFormat } = useUtilities();

const invoiceDate = computed(() => {
  if (!props.transaction.resource_type)
    return parseDatetime(props.transaction.created_at);

  return props.transaction.resource_type.includes("Invoice") &&
    props.transaction.resource
    ? parseDatetime(props.transaction.resource.created_at)
    : parseDatetime(props.transaction.created_at);
});
const transactionTotal = computed(() => {
  return moneyFormat(
    props.transaction.Total,
    props.transaction.CodigoMoneda
  );
});
const numeroConsecutivo = computed(() => {
  if (!props.transaction.resource_type) return props.transaction.resource_id;
  return props.transaction.resource_type.includes("Invoice") &&
    props.transaction.resource
    ? props.transaction.resource.NumeroConsecutivo
    : props.transaction.resource_id;
});
const cliente = computed(() => {
  if (!props.transaction.resource_type) return '';
  return props.transaction.resource_type.includes("Invoice") &&
    props.transaction.resource
    ? props.transaction.resource.cliente
    : '';
});


</script>
<style scoped>
ion-note {
  font-size: 14px;
}
</style>
