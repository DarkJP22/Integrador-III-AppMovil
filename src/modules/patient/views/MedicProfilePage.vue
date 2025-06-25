<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Perfil </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <MedicProfile :medic="medic" />
    
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,


} from "@ionic/vue";

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useMedics from "../composables/useMedics";
import MedicProfile from "@/components/MedicProfile.vue";

const route = useRoute();
const { getMedic } = useMedics();


const { id } = route.params;
const medic = ref<any>({});





onMounted(async () => {

  const resp = await getMedic(parseInt(id.toString()));
  medic.value = resp;


});

</script>


