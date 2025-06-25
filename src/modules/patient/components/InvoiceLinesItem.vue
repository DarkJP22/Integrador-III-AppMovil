<template>
  <ion-item>
    <ion-label class="ion-text-wrap">
      <small>{{ line.Detalle }}</small>
    </ion-label>

    <ion-note slot="end">{{ cantidad }} x {{ montoTotalLinea }} </ion-note>
  </ion-item>
</template>

<script setup lang="ts">
import { IonLabel, IonItem, IonNote } from "@ionic/vue";
import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";


const props = defineProps({
  line: {
    type: Object,
    required: true,
  },
  CodigoMoneda: {
    type: String,
    required: true,
  },
});

const { moneyFormat } = useUtilities();

const cantidad = computed(() => {
  return parseInt(props.line.Cantidad);
});

const montoTotalLinea = computed(() => {
  return moneyFormat(props.line.MontoTotalLinea, props.CodigoMoneda);
});

</script>
