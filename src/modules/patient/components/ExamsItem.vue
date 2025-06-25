<template>
    <ion-item lines="full">
        <ion-label>
            <h3>
                {{ exam.name }}
            </h3>
            <p>{{ moneyFormat(exam.price) }}</p>
            <p><ion-button color="light" size="small" @click="showInfo">
            Info
        </ion-button></p>
        </ion-label>


        <ion-badge color="danger" class="cart-quantity-badge">{{ cartQuantity }}</ion-badge>
        <ion-button color="primary" @click="removeItem(index)" v-if="index !== -1">
            <ion-icon slot="icon-only" :md="removeSharp" :ios="removeOutline"></ion-icon>
        </ion-button>
        <ion-button color="primary" @click="addItem(exam)">
            <ion-icon slot="icon-only" :md="addSharp" :ios="addOutline"></ion-icon>
        </ion-button>



    </ion-item>
</template>
<script setup lang="ts">
import useUtilities from '@/composables/useUtilities';
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge } from '@ionic/vue';
import { addSharp, addOutline, removeSharp, removeOutline } from 'ionicons/icons'
import useCartExams from '../composables/useCartExams';
import { computed } from 'vue';

import useUi from "@/composables/useUi";
const { moneyFormat } = useUtilities();
const { alertMessage } = useUi();
const { addItem, cart, removeItem } = useCartExams();
const props = defineProps({
    exam: {
        type: Object,
        required: true
    }
});
const index = computed(() => {
    return cart.value.items.findIndex(item => item.id === props.exam.id);
});
const cartQuantity = computed(() => {
    return cart.value.items.find(item => item.id === props.exam.id)?.cart_quantity;
});
function showInfo() {
    alertMessage(props.exam.name, props.exam.description)
}
</script>
<style scoped>
.cart-quantity-badge {
    margin-right: 1rem;
}
</style>