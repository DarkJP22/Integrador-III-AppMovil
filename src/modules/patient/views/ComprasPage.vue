<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Historial de Compras Farmacias</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list class="ion-padding">
        <ion-list-header>
          <h5>Compras en comercios Afiliados a Doctor Blue</h5>
        </ion-list-header>

        <ion-item
          lines="none"
          v-if="!compras.length && !isLoading"
          class="ion-text-center"
        >
          <ion-label>No hay elementos registrados</ion-label>
        </ion-item>

        <ion-item v-for="item in compras" :key="item.id" lines="full">
          <ion-label>
            <h3>
              <span v-if="item.TotalUnidades"
                >{{ item.TotalUnidades }} Unid</span
              >
              <span v-if="item.TotalFracciones"
                >{{ item.TotalFracciones }} Frac</span
              >
              x {{ item.Detalle }}
            </h3>
            <p>{{ item.pharmacy }} - {{ item.created_at }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonItem,
  IonList,
  IonLabel,
  IonListHeader,
} from "@ionic/vue";
import {
  notificationsSharp,
  notificationsOutline,
  people,
  documentText,
  heart,
  thermometer,
  addSharp,
  addOutline,
  trashSharp,
  trashOutline,
} from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import useCompras from "../composables/useCompras";
export default defineComponent({
  name: "ComprasPage",
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonBackButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const { compras, isLoading, errors } = useCompras(parseInt(id.toString()));

    const isOpenRef = ref(false);

    return {
      notificationsSharp,
      notificationsOutline,
      people,
      documentText,
      heart,
      thermometer,
      addSharp,
      addOutline,
      trashSharp,
      trashOutline,
      isOpenRef,
      isLoading,
      errors,
      compras,
    };
  },
});
</script>
<style scoped>
.logo {
  max-width: 8rem;
}
.chart-wrapper {
  margin-top: 1rem;
}
</style>
