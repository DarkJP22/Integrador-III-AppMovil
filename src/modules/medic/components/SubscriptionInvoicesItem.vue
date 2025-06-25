<script setup lang="ts">
import { IonItem, IonLabel, IonNote } from "@ionic/vue";
import { InvoiceItem, SubscriptionInvoice } from "@/interfaces/subscriptionInvoices";
import { PropType, computed } from 'vue';
import useUtilities from "@/composables/useUtilities";
const { moneyFormat } = useUtilities();


const props = defineProps({
    invoice: {
        type: Object as PropType<SubscriptionInvoice>,
    },
    invoiceItem: {
        type: Object as PropType<InvoiceItem>,
        required: true
    },
})

const computedPrice = computed(() => {
    return moneyFormat(props.invoiceItem.total, props.invoice?.currency);
});

</script>
<template>
    <ion-item lines="none">
        <ion-label class="ion-text-wrap">
           {{ invoiceItem.name }}
        </ion-label>
        
        <ion-note slot="end" color="dark"><b>{{ invoiceItem.quantity }}</b> </ion-note>
    </ion-item>
    <ion-item >
        <ion-label class="ion-text-wrap">
           Monto 
        </ion-label>
        
        <ion-note slot="end" color="dark"><b>{{ computedPrice }}</b></ion-note>
    </ion-item>
    
</template>
<style scoped>
/* ion-label{
font-size: 12px !important;
} */
ion-note{
    font-size: 14px;
}
</style>