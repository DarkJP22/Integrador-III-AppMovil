<script setup lang="ts">
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonChip, IonList, IonItem, IonLabel, IonNote, IonSpinner, useIonRouter, IonButton } from "@ionic/vue";
import { computed, ref } from "vue";
import useSubscriptionInvoices from "../composables/useSubscriptionInvoices";
import SubscriptionInvoicesItem from "../components/SubscriptionInvoicesItem.vue";
import { useRoute } from "vue-router";
import useUtilities from "@/composables/useUtilities";
import useUi from "@/composables/useUi";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
import useUploadVoucherSubscriptionInvoice from "../composables/useUploadVoucherSubscriptionInvoice";
import BaseFormatMoney from "@/components/BaseFormatMoney.vue";
import useAuth from "@/modules/auth/composables/useAuth";
import NoteMaxUploadFileSize from "@/components/NoteMaxUploadFileSize.vue";
const { subscriptionInvoices, isLoading, getSubscriptionInvoicePDF, isLoadingDownload } = useSubscriptionInvoices();
const { maxUploadSizeInMb, subscriptionInvoicePaidStatusesAsConst } = useGlobalSettings();
const { moneyFormat, bytesToSize, mbToBytes, openFile } = useUtilities();
const { alertMessage, toastMessage } = useUi();
const { auth } = useAuth();
const route = useRoute();
const router = useIonRouter();
const { id } = route.params;
const { uploadVoucher, isLoading: isLoadingUpload } = useUploadVoucherSubscriptionInvoice(+id);


const fileInput = ref<any>(null);
const invoice = computed(() => {
    return subscriptionInvoices.value.find((invoice) => {
        return invoice.id === +id;
    });
});

async function downloadPDF() {
    const uri = await getSubscriptionInvoicePDF(+id);
    if (!uri) return;

    await openFile(uri);
}

const invoiceTotal = computed(() => {
    return moneyFormat(invoice.value?.total, invoice.value?.currency);
});
const commissionByAppointment = computed(() => {
    if (!auth.value.user) return 0;
    if (!auth.value.user.subscription) return 0;
    if (!auth.value.user.subscription.plan) return 0;

    const amount = auth.value.user.specialities.length ? auth.value.user.subscription.plan.specialist_cost_commission_by_appointment : auth.value.user.subscription.plan.general_cost_commission_by_appointment;

    return amount;
});

const commissionDiscount = computed(() => {
    if (!auth.value.user) return 0;
    if (!auth.value.user.subscription) return 0;
    if (!auth.value.user.subscription.plan) return 0;

    return auth.value.user.subscription.plan.commission_discount;
});

const commissionDiscountRangeInMinutes = computed(() => {
    if (!auth.value.user) return 0;
    if (!auth.value.user.subscription) return 0;
    if (!auth.value.user.subscription.plan) return 0;

    return auth.value.user.subscription.plan.commission_discount_range_in_minutes;
});

const onChangeFileUpload = () => {
    let filesExceedingMaxSize = 0;

    const maxSizeInBytes = mbToBytes(maxUploadSizeInMb.value);
    const voucher = fileInput.value.files[0]


    if (voucher.size > maxSizeInBytes) { // 10mb
        filesExceedingMaxSize++;
        return
    }


    if (filesExceedingMaxSize) { // 10mb
        alertMessage('Error', 'Algunos archivos son demasiado grandes. El tamaño máximo de archivo es ' + bytesToSize(maxSizeInBytes));
        return
    }

    uploadVoucher({ voucher }, {
        onSuccess: () => {
            toastMessage("Cita actualizada como pendiente correctamente");
            
            router.canGoBack() ? router.back() : router.replace({ name: 'medic-subscription-invoices' });

        },
        onError: (error) => {
            alertMessage("Error", error.message);
        }
    })



};

</script>
<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Detalle de factura </ion-title>

            </ion-toolbar>
        </ion-header>

        <ion-content>
            <div v-if="isLoading" class="ion-text-center ion-padding">
                <ion-spinner slot="start" class="spinner-button" color="primary"></ion-spinner>
            </div>
            <ion-card v-if="invoice?.id">
                <ion-card-header color="primary">
                    <div>
                        <div>
                            <ion-card-subtitle>Detalle de</ion-card-subtitle>
                            <ion-card-title>Factura</ion-card-title>
                            <ion-button color="secondary" expand="block" shape="round" size="small" @click="downloadPDF" v-show="!isLoading" :disabled="isLoadingDownload" download="true">
                                Descargar
                            </ion-button>
                        </div>
                        <ion-chip color="medium">{{ invoice?.paid_status_label }}</ion-chip>
                    </div>

                </ion-card-header>

                <ion-card-content>
                    <ion-list>
                        <ion-item>
                            <ion-label><b>Nombre</b></ion-label>
                            <ion-note slot="end" color="dark">{{ invoice?.customer.name }}</ion-note>
                        </ion-item>
                        <ion-item class="ion-text-wrap">
                            <ion-label class="ion-text-wrap"><b>Periodo</b></ion-label>
                            <ion-note slot="end" color="dark" class="ion-text-wrap">{{ invoice?.notes }}</ion-note>
                        </ion-item>
                        <ion-item class="ion-text-wrap">
                            <ion-label class="ion-text-wrap"><b>Vence</b></ion-label>
                            <ion-note slot="end" color="dark" class="ion-text-wrap">{{ invoice?.due_date }}</ion-note>
                        </ion-item>
                        <ion-item class="ion-text-wrap">
                            <ion-label class="ion-text-wrap"><b>Comisión por cita:</b></ion-label>
                            <ion-note slot="end" color="dark" class="ion-text-wrap">
                                <BaseFormatMoney :amount="commissionByAppointment" :currency="invoice?.currency" />
                            </ion-note>
                        </ion-item>
                        <ion-item class="ion-text-wrap">
                            <ion-label class="ion-text-wrap"><b>Descuento de Comisión:</b>
                                <p>Rango de tiempo para aplicar: {{ commissionDiscountRangeInMinutes }} min.</p>
                            </ion-label>
                            <ion-note slot="end" color="dark" class="ion-text-wrap">
                                {{ commissionDiscount }}%
                            </ion-note>
                           
                        </ion-item>
                    </ion-list>
                    <ion-list>
                        <SubscriptionInvoicesItem :invoice="invoice" :invoice-item="item" v-for="item in invoice?.items" :key="item.id"></SubscriptionInvoicesItem>

                    </ion-list>
                    <hr>
                    <ion-list>
                        <ion-item lines="none">
                            <ion-label><b>Monto Total</b></ion-label>
                            <ion-note slot="end" color="dark"> <b>{{ invoiceTotal }}</b></ion-note>
                        </ion-item>
                    </ion-list>
                </ion-card-content>

            </ion-card>

            <div class="ion-padding" v-if="invoice?.paid_status === subscriptionInvoicePaidStatusesAsConst?.UNPAID || invoice?.paid_status === subscriptionInvoicePaidStatusesAsConst?.REFUSED">
                <input type="file" ref="fileInput" @change="onChangeFileUpload" class="hidden" accept="image/*,.pdf" />

                <ion-button color="primary" expand="block" shape="round" @click="($refs.fileInput as HTMLInputElement).click()" v-show="!isLoading" :disabled="isLoadingUpload">
                    Subir Comprobante
                </ion-button>
                <ion-item lines="none">
                    <small>
                        <NoteMaxUploadFileSize />
                    </small>
                </ion-item>
            </div>
            <div class="ion-padding" v-else>
                <!-- <a :href="invoice?.comprobante_url" download target="_blank">Descargar Comprobante</a> -->
                <ion-button color="secondary" expand="block" shape="round" size="small" :href="invoice?.comprobante_url" download="true">
                                Descargar Comprobante
                            </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>
<style scoped>
ion-card-header>div {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

ion-card-header ion-badge {
    display: flex;

}

ion-note {
    font-size: 14px;
}

ion-chip {
    color: white;
}

hr {
    border-top: 2px solid var(--ion-color-light);
    margin: 10px 0;
}</style>    