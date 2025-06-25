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

      <MedicProfile :medic="auth.user" />
    
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


import MedicProfile from "@/components/MedicProfile.vue";
import useAuth from "@/modules/auth/composables/useAuth";
const { auth } = useAuth();

</script>


