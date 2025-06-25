<template>
    <ion-card>
        <img alt="Silhouette of mountains" :src="package.photo_url" />
        <ion-card-header>
            <ion-card-title>{{ package.name }}</ion-card-title>
           
        </ion-card-header>

        <ion-card-content>
            <ion-button color="primary" @click="requestAppointment">
                Solictar Cita
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>
<script setup lang="ts">

import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue';
import { computed } from 'vue';
import useLaboratories from '../composables/useLaboratories';

const {
    currentLab,
} = useLaboratories();
const props = defineProps({
    package: {
        type: Object,
        required: true
    }
});

const whatsappPhoneNumber = computed(() => {
      if (!currentLab.value.whatsapp_number) return false;
   

      return currentLab.value.whatsapp_number.startsWith("506")
        ? currentLab.value.whatsapp_number
        : "506" + currentLab.value.whatsapp_number;
    });
    const whatsappMessage = computed(() => {
      return encodeURIComponent(
        `Estoy interesado en realizar estos exámenes: ${props.package.name}.  ¿Pueden ayudarme?`
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