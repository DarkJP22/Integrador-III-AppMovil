<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Cotización</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">

            <ion-list>
                <ion-item lines="none" v-if="!cart.items.length" class="ion-text-center">
                    <ion-label>
                        No hay elementos en el carrito
                    </ion-label>

                </ion-item>
                <ion-item v-for="(item, index) in cart.items" :key="item.id">

                    <ion-label>
                        <h2>{{ item.name }}</h2>
                        <p>{{ item.cart_quantity }} x {{ moneyFormat(item.price) }}</p>
                    </ion-label>
                    <ion-badge color="danger" class="cart-quantity-badge">{{ item.cart_quantity }}</ion-badge>
                    <ion-button color="primary" @click="removeItem(index)">
                        <ion-icon slot="icon-only" :md="removeSharp" :ios="removeOutline"></ion-icon>
                    </ion-button>
                    <ion-button color="primary" @click="addItem(item)">
                        <ion-icon slot="icon-only" :md="addSharp" :ios="addOutline"></ion-icon>
                    </ion-button>
                </ion-item>

            </ion-list>
            <!-- <ion-item lines="none" color="light" class="ison-text-center" v-if="cart.items.length">
        <ion-label>
            Total: {{ moneyFormat(cart.total) }}
        </ion-label>

</ion-item> -->
            <ion-accordion-group v-model="selected" v-if="cart.items.length">
               
                <ion-accordion value="cash">
                    <ion-item slot="header" color="primary">
                        <ion-label><b>Contado</b></ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content">

                        <ion-item color="light">
                            <ion-label>
                                <b>Subtotal: {{ moneyFormat(cart.total) }}</b>
                            </ion-label>

                        </ion-item>
                        <ion-item color="light" v-if="cashDiscount.amount">
                            <ion-label>
                                Descuento: {{ moneyFormat(cashDiscount.amount) }}
                            </ion-label>

                        </ion-item>
                        <ion-item color="light">
                            <ion-label>
                                <b>Total: {{ moneyFormat(cart.total - cashDiscount.amount) }}</b>
                            </ion-label>
                        </ion-item>

                        <ion-button color="primary" @click="requestAppointment">
                            Solictar Cita
                        </ion-button>
                    </div>
                </ion-accordion>

            </ion-accordion-group>


        </ion-content>

    </ion-page>
</template>
<script setup lang="ts">
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonBackButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonList,
    IonLabel,
    IonButton,
    IonIcon,
    IonAccordion,
    IonAccordionGroup,
    IonBadge

} from "@ionic/vue";

import { addSharp, addOutline, removeSharp, removeOutline } from 'ionicons/icons'
import useCartExams from '../composables/useCartExams';
import useUtilities from '@/composables/useUtilities';
import { computed, ref } from 'vue';
import useAuth from '@/modules/auth/composables/useAuth';
import useLaboratories from "../composables/useLaboratories";
const { addItem, removeItem, cart } = useCartExams();
const { auth } = useAuth();
const { moneyFormat } = useUtilities();
const {
    currentLab,
} = useLaboratories();
const selected = ref('cash');
const cashDiscount = computed(() => {
    const percent = (auth.value.global?.lab_exam_discount ?? 0) / 100;
    return {
        amount: cart.value.total * percent,
        percent,
    }

});
// const minFinanceAmount = computed(() => {
//     return auth.value.global?.lab.exam_finance?.min_amount ?? 0;

// });
// const financeMessageRestriction = computed(() => {
//     return auth.value.global?.lab.exam_finance?.message_restriction ?? 'Esta opcion solo esta disponible para montos igual o superiores a '+ moneyFormat(minFinanceAmount.value);

// });
// const cuotas = computed(() => {
//     const ctas = auth.value.global?.lab.exam_finance?.cuotas ?? [];
//     const cuotas: any[] = [];

//     ctas.forEach((cta: any) => {
//         cuotas.push({
//             name: cta.name,
//             percent: cta.percent * 100,
//             amount: cart.value.total * cta.percent,
//             date: cta.date,
//         })
//     })
//     return cuotas;
// });

const whatsappPhoneNumber = computed(() => {
    if (!currentLab.value?.whatsapp_number) return false;


    return currentLab.value?.whatsapp_number.startsWith("506")
        ? currentLab.value?.whatsapp_number
        : "506" + currentLab.value?.whatsapp_number;
});
const whatsappMessage = computed(() => {
    return encodeURIComponent(
        `${currentLab.value?.settings.lab_whatsapp_exam_message}`
    );
});

function requestAppointment() {
    window.open(
        "https://api.whatsapp.com/send/?phone=" +
        whatsappPhoneNumber.value +
        "&text=" +
        whatsappMessage.value +
        "&app_absent=0"
    );
}


</script>
<style scoped>
.cart-quantity-badge {
    margin-right: 1rem;
}
</style>