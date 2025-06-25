<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Alergias</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="setOpen(true)"><ion-icon :md="addCircleSharp" :ios="addCircleOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-list class="ion-padding">
        <div class="ion-text-center">
          <ion-button color="primary" fill="outline" size="small" shape="round" @click="setOpen(true)">
            Agregar Alergia
          </ion-button>
        </div>
        <!-- <ion-item lines="none" v-if="isLoading" class="ion-text-center">
          <ion-label>Cargando...</ion-label>
        </ion-item> -->
        <ion-item lines="none" v-if="!isLoading && !allergies.length" class="ion-text-center">
          <ion-label>No hay alergias registradas</ion-label>
        </ion-item>

        <ion-item v-for="item in allergies" :key="item.id" lines="full">
          <ion-label>
            <h2>{{ item.name }}</h2>
          </ion-label>
          <ion-button color="danger" slot="end" fill="clear" @click="onConfirmDelete(item)" :disabled="isLoading">
            <ion-icon :ios="trashOutline" :md="trashSharp"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="isOpenRef" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Alergia</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form action="#" @submit.prevent="onSave()" novalidate>
            <ion-grid>
              <ion-row class="ion-justify-content-center" color="primary">
                <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                  <div class="">
                    <ion-item>
                      <ion-input label="Alergia" labelPlacement="floating" type="text" v-model="form.name"></ion-input>
                      <ion-note color="danger" v-if="errors.name">{{
                        errors.name[0]
                      }}</ion-note>
                    </ion-item>
                  </div>
                  <div class="ion-padding">
                    <ion-button type="submit" expand="block" shape="round" :disabled="isLoading">
                      Guardar
                    </ion-button>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </form>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useUi from "@/composables/useUi";

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
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonNote,
} from "@ionic/vue";
import {
  addCircleSharp,
  addCircleOutline,
  trashSharp,
  trashOutline,
} from "ionicons/icons";
import { ref } from "vue";
import { useRoute } from "vue-router";
import useAllergies from "../composables/useAllergies";

const route = useRoute();
const { id } = route.params;
const { allergies, createAllergy, onConfirmDelete, isLoading, errors } =
  useAllergies(parseInt(id.toString()));

const { alertMessage } = useUi();

const isOpenRef = ref(false);

const form = ref({
  name: "",
});

const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  form.value.name = "";
};

const onSave = async () => {
  const { ok, message } = await createAllergy(form.value);
  if (!ok) alertMessage("Error", message);
  else setOpen(false);
};


</script>
<style scoped>
.logo {
  max-width: 8rem;
}

.chart-wrapper {
  margin-top: 1rem;
}
</style>
