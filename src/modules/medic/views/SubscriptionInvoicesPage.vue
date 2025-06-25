<script setup lang="ts">
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/vue";
import { computed, ref } from "vue";
import useSubscriptionInvoices from "../composables/useSubscriptionInvoices";
import SubscriptionInvoice from "../components/SubscriptionInvoice.vue";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
const { subscriptionInvoices } = useSubscriptionInvoices();
const { subscriptionInvoicePaidStatusesAsConst } = useGlobalSettings();
const segmentCase = ref("all");

const allInvoices = computed(() => {
    return subscriptionInvoices.value;
});
const pendingInvoices = computed(() => {
    return subscriptionInvoices.value.filter((invoice) => {
        return invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value.UNPAID;
    });
});
const paidInvoices = computed(() => {
    return subscriptionInvoices.value.filter((invoice) => {
        return invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value.PAID;
    });
});
</script>
<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Tus Facturas </ion-title>

            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-segment v-model="segmentCase">
                <ion-segment-button value="all">
                    <ion-label>Todas</ion-label>
                </ion-segment-button>
                <ion-segment-button value="pending" >
                    <ion-label>Pendientes</ion-label>
                </ion-segment-button>
                <ion-segment-button value="paid" >
                    <ion-label>Canceladas</ion-label>
                </ion-segment-button>
            </ion-segment>
            <div v-show="segmentCase == 'all'" class="">
                <SubscriptionInvoice :invoice="invoice" v-for="invoice in allInvoices" :key="invoice.id"></SubscriptionInvoice>
            </div>
            <div v-show="segmentCase == 'pending'" class="">
                <SubscriptionInvoice :invoice="invoice" v-for="invoice in pendingInvoices" :key="invoice.id"></SubscriptionInvoice>
            </div>
            <div v-show="segmentCase == 'paid'" class="">
                <SubscriptionInvoice :invoice="invoice" v-for="invoice in paidInvoices" :key="invoice.id"></SubscriptionInvoice>
            </div>
        </ion-content>
    </ion-page>
</template>
<style scoped>
ion-segment-button{
    font-size: 12px;
}
</style>    