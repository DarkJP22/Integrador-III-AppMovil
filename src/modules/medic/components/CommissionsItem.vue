<template>
  <ion-item>
    <ion-label>
      <h2>{{ commissionDate }}</h2>
      <ion-badge color="success" v-if="commissionItem.paid_at">Cancelado</ion-badge>
      <ion-badge color="warning" v-else>Pendiente</ion-badge>
    </ion-label>
    <ion-note slot="end" color="primary">{{ commissionTotal }}</ion-note>
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem, IonNote, IonBadge } from "@ionic/vue";
import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";


const props = defineProps({
  commission: {
    type: Object,
    required: true,
  },
});
const { parseDatetime, moneyFormat } = useUtilities();

const commissionDate = computed(() => {
  return parseDatetime(props.commission.created_at);
});
const commissionTotal = computed(() => {
  return moneyFormat(props.commission.Total, props.commission.CodigoMoneda);
});


const commissionItem = computed(() => props.commission);

</script>
<style scoped>
ion-note {
  font-size: 14px;
}
</style>
