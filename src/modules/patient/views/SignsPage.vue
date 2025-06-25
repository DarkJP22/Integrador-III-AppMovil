<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Signos Vitales </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <h3>Médiciones</h3>
        </ion-list-header>

        <div class="ion-padding ion-text-center">

          <ion-button size="large" shape="round" expand="block" fill="outline" :router-link="'/patient/expedient/' + id + '/signs/pressure'">
            Presion arterial
            <ion-icon slot="end" :md="heartSharp" :ios="heartOutline"></ion-icon>
          </ion-button>
          <ion-button size="large" shape="round" expand="block" fill="outline" :router-link="'/patient/expedient/' + id + '/signs/glicemia'">
            Glicemia
            <ion-icon slot="end" :md="waterSharp" :ios="waterOutline"></ion-icon>
          </ion-button>


        </div>

      </ion-list>
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
  IonList,
  IonListHeader,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import {
  heartSharp,
  heartOutline,
  waterOutline,
  waterSharp
} from "ionicons/icons";
import { useRoute } from "vue-router";

const route = useRoute();

const { id } = route.params;


</script>
<style scoped>
.logo {
  max-width: 8rem;
}
</style>
