<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Medicamentos</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Medicamentos</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="ion-padding">
        <h1 class="ion-text-center">Página de Medicamentos</h1>
        <p class="ion-text-center">Esta página está funcionando correctamente</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonTitle, 
  IonContent,
  IonBackButton
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DrugsPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonBackButton
  },
  setup() {
    // Por ahora solo un setup básico
    return {
      // Aquí puedes agregar variables cuando las necesites
    };
  }
});
</script>

<style scoped>
/* Estilos básicos */
h1 {
  margin-top: 20px;
}

p {
  margin-top: 10px;
  color: #666;
}
</style>