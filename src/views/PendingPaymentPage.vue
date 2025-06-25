<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">

                <ion-title>Pagos Pendientes</ion-title>

            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-item color="danger" lines="none" class="ion-text-center" v-if="pendingInvoices.length">
                <ion-label class="ion-text-wrap">

                <p class="agenda-message">
                   Actualiza el pago para volver a ingresar a la plataforma
                </p>
                </ion-label>
            </ion-item>
            <SubscriptionInvoice :invoice="invoice" v-for="invoice in pendingInvoices" :key="invoice.id"></SubscriptionInvoice>
            <ion-list>
                <ion-list-header  class="ion-text-center" v-if="!pendingInvoices.length">
                    <h2>No tienes pagos pendientes. Reinicia sesión para ingresar a la plataforma</h2>
                </ion-list-header>
                <ion-item v-if="!pendingInvoices.length">
                    <ion-label class="ion-text-wrap ion-text-center" >
                        <ion-button  @click="onLogin" color="primary">Iniciar Sesión</ion-button>
                    </ion-label>


                </ion-item>
            </ion-list>


        </ion-content>

    </ion-page>
</template>
<script setup lang="ts">
import {
    IonPage,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader

} from "@ionic/vue";

import { computed, watch } from "vue";
import useSubscriptionInvoices from "@/modules/medic/composables/useSubscriptionInvoices";
import SubscriptionInvoice from "@/modules/medic/components/SubscriptionInvoice.vue";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
import useAuth from "@/modules/auth/composables/useAuth";
import { useRouter } from "vue-router";

const { subscriptionInvoices } = useSubscriptionInvoices();
const { subscriptionInvoicePaidStatusesAsConst } = useGlobalSettings();
const { auth, checkAuthentication } = useAuth();
const router = useRouter();

const pendingInvoices = computed(() => {
    return subscriptionInvoices.value.filter((invoice) => {
        return invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.UNPAID || invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.REFUSED || invoice.paid_status === subscriptionInvoicePaidStatusesAsConst.value?.CHECKING;
    });
});

watch(() => auth.value.disabled_by_payment, (value) => {
    if (!value) {
        console.log('dddd');

        router.push({ name: "login" });
    }
});

function onLogin() {
    checkAuthentication(true);
}
</script>