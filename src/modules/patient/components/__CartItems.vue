<template>
    <ion-modal ref="modal" :is-open="cart.isOpen" @didDismiss="cart.isOpen = false;" :initial-breakpoint="1" :breakpoints="[0, .5]" handle-behavior="cycle">
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
                <ion-accordion value="finance">
                    <ion-item slot="header" color="primary">
                        <ion-label> <b>Financiado</b> </ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content">
                        <ion-item color="light">
                            <ion-label>
                              <b>Total: {{ moneyFormat(cart.total) }}</b>
                            </ion-label>

                        </ion-item>
                        <div class="">

                       
                        <ion-item color="light">
                            <ion-label>Prima ({{ prima.percent }}%): {{  moneyFormat(prima.amount) }} <p><ion-badge color="danger">{{ prima.date }}</ion-badge></p></ion-label>
                        </ion-item>
                        <ion-item color="light" v-for="(cuota) in cuotas" :key="cuota">
                            <ion-label>{{ cuota.number }} Cuota ({{ cuota.percent }}%): {{  moneyFormat(cuota.amount) }}  <p><ion-badge color="danger">{{ cuota.date }}</ion-badge></p></ion-label>
                           
                        </ion-item>
                        <!-- <ion-item color="light">
                            <ion-label>2 Cuota (25%): xxx 30 Junio</ion-label>
                        </ion-item> -->
                    </div>
                        <ion-button color="primary" @click="requestAppointment">
                            Solictar Cita
                        </ion-button>
                    </div>
                </ion-accordion>
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
                        <ion-item color="light">
                            <ion-label>
                                Descuento ({{ cashDiscount.percent }}%): {{ moneyFormat(cashDiscount.amount) }}
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
    </ion-modal>
</template>
<script setup lang="ts">
import {
    IonModal,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonButton,
    IonIcon,
    IonAccordion,
    IonAccordionGroup,
    IonBadge
} from '@ionic/vue';
import { addSharp, addOutline, removeSharp, removeOutline } from 'ionicons/icons'
import useCartExams from '../composables/useCartExams';
import useUtilities from '@/composables/useUtilities';
import { computed, ref } from 'vue';
import useAuth from '@/modules/auth/composables/useAuth';
import { addMonths } from 'date-fns';
const { addItem, removeItem, cart } = useCartExams();
const { auth } = useAuth();
const { moneyFormat, parseDate } = useUtilities();
const selected = ref('');
const cashDiscount = computed(() => {
    return {
        amount: cart.value.total * (auth.value.global?.lab_exam_cash_discount ?? 0),
        percent: (auth.value.global?.lab_exam_cash_discount ?? 0) * 100,
    }

});
const prima = computed(() => {
    return {
        amount: cart.value.total * (auth.value.global?.lab_exam_finance?.prima ?? 0),
        percent: (auth.value.global?.lab_exam_finance?.prima ?? 0) * 100,
        date: 'Hoy'
    }

});
const cuotas = computed(() => {
    const ctas = auth.value.global?.lab_exam_finance?.cuotas ?? [];
    const cuotas: any[] = [];

    ctas.forEach((cta:any, index:number) =>{
        cuotas.push({
            number: index + 1,
            percent: cta.percent * 100,
            amount: cart.value.total * cta.percent,
            date: parseDate(addMonths(new Date(), index + 1).toISOString()),
        })
    })
    return cuotas;
});

const whatsappPhoneNumber = computed(() => {
      if (!auth.value.global?.lab_whatsapp_number) return false;
   

      return auth.value.global?.lab_whatsapp_number.startsWith("506")
        ? auth.value.global?.lab_whatsapp_number
        : "506" + auth.value.global?.lab_whatsapp_number;
    });
    const whatsappMessage = computed(() => {
      return encodeURIComponent(
        `Hola deseo ser contactado para asesoría de examenes de laboratorio`
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
</style>