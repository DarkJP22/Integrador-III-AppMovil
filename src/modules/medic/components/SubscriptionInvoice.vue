<script setup lang="ts">
import { IonButton, IonItem, IonLabel, IonBadge } from "@ionic/vue";
import { SubscriptionInvoice } from "@/interfaces/subscriptionInvoices";
import { PropType, computed } from 'vue';
import { useRouter } from "vue-router";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
const router = useRouter();
const { subscriptionInvoicePaidStatusesAsConst } = useGlobalSettings();

const props = defineProps({
    invoice: {
        type: Object as PropType<SubscriptionInvoice>,
        required: true
    },
})
const colorStatus = computed(() => {
    if (props.invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.UNPAID) {
        return "danger";
    } else if (props.invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.CHECKING) {
        return "warning";
    } else if (props.invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.PAID) {
        return "primary";
    } else if (props.invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.REFUSED) {
        return "medium";
   
    } else {
        return "danger";
    }
});
</script>
<template>
    <ion-item>
        <ion-label class="ion-text-wrap">
            <h2>{{ invoice.invoice_number }}</h2>
            <p>{{ invoice.notes }}</p>
            <IonButton size="small" @click="() => router.push({ name: 'medic-subscription-invoice-details', params:{ id: invoice.id } })">Ver Detalles</IonButton>
        </ion-label>
        
        <ion-badge  slot="end" :color="colorStatus">{{ invoice.paid_status_label }}</ion-badge >
    </ion-item>
    
</template>