<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Cambio de Contraseña</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form action="#" @submit.prevent="onSendCode()">
        <ion-grid>
          <ion-row class="ion-justify-content-center" color="primary">
            <ion-col class="ion-align-self-center" size-md="6" size-lg="5" size-xs="12">
              <div class="ion-text-center">
                <!-- <img src="../assets/logo2.svg" alt="Senex Logo" /> -->
              </div>

              <div class="ion-padding">
                <ion-item>
                  <ion-input label="Identificación" labelPlacement="floating" type="text" v-model="form.ide" required></ion-input>
                  <ion-note color="danger" v-if="errors.ide">{{ errors.ide[0] }}</ion-note>
                </ion-item>
              </div>
              <div class="ion-padding">
                <ion-button type="submit" expand="block" shape="round" color="primary" :disabled="isLoading">
                  Solicitar Código
                </ion-button>
              </div>
              <div class="ion-text-center ion-margin-top">
                <SupportLink />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonNote
} from "@ionic/vue";

import { ref } from "vue";
import useUi from "@/composables/useUi";
import useAuth from "@/modules/auth/composables/useAuth";
import { useRouter } from "vue-router";
import SupportLink from "@/components/SupportLink.vue";

const { sendResetCode, isLoading, errors } = useAuth();
const { alertMessage, toastMessage } = useUi();
const router = useRouter();
const form = ref({
  ide: "",
});

const onSendCode = async () => {
  const { ok, message } = await sendResetCode(form.value);
  if (!ok) alertMessage("Error", message);
  else {
    toastMessage(message);
    router.push({ name: 'new-password', params: { ide: form.value.ide } });
  }
};


</script>
