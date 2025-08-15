<template>
<ion-page>
 <ion-header :translucent="true">
    <ion-toolbar color="primary">
      <ion-buttons slot="start">
        <ion-back-button default-href="/" text=""></ion-back-button>
      </ion-buttons>
      <ion-title>Servicios Afiliados </ion-title>
    </ion-toolbar>
  </ion-header>
  <div class="terms-conditions ion-padding">
    <ion-content :fullscreen="true" class="ion-padding">
      <h2 class="ion-text-center">Términos y Condiciones de Afiliación</h2>
      <p>
        Al afiliarse, usted acepta los siguientes términos y condiciones:
      </p>
      <ul>
        <li>Proporcionar información veraz y actualizada.</li>
        <li>Respetar las políticas de privacidad y seguridad.</li>
        <li>Seguir las instrucciones del personal médico.</li>
      </ul>
      <p>
        Si tiene alguna pregunta, por favor contacte a nuestro equipo de soporte.
      </p>
      <ion-button expand="block" color="primary" @click="$router.push('/patient/home/')">
        Aceptar y Continuar
      </ion-button>
    </ion-content>



  </div>
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
  IonButton,
  IonIcon,
  IonModal,
  IonGrid,
  IonCol,
  IonRow,
  IonPopover,
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonNote,
} from "@ionic/vue";

</script>