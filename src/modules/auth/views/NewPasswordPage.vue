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
      <ion-item color="secondary" lines="none" class="ion-text-ceter">
        <ion-label class="ion-text-wrap">

          <p class="agenda-message">
            Se envió un código al número de teléfono terminado en <b>{{ phoneNumber }}</b>
          </p>
        </ion-label>
      </ion-item>
      <form action="#" @submit.prevent="onPasswordReset()">
        <ion-grid>
          <ion-row class="ion-justify-content-center" color="primary">
            <ion-col class="ion-align-self-center" size-md="6" size-lg="5" size-xs="12">
              <div class="ion-text-center">
                <!-- <img src="../assets/logo2.svg" alt="Senex Logo" /> -->
              </div>
              <div class="ion-padding">
                <ion-item>
                  <ion-input label="Identificación" labelPlacement="floating" type="text" v-model="form.ide" required disabled></ion-input>
                  <ion-note color="danger" v-if="errors.ide">{{ errors.ide[0] }}</ion-note>
                </ion-item>
                <ion-item>
                  <ShowHidePasswordInput v-model="form.password" label="Nueva Contraseña" label-placement="floating" :required="true" />
                  <ion-note color="danger" v-if="errors.password">{{ errors.password[0] }}</ion-note>
                </ion-item>
                <ion-item>
                  <ShowHidePasswordInput v-model="form.password_confirmation" label="Confirmación de Contraseña" label-placement="floating" :required="true" />
                  <ion-note color="danger" v-if="errors.password_confirmation">{{ errors.password_confirmation[0] }}</ion-note>
                </ion-item>
                <ion-item>
                  <ion-input label="Código enviado por teléfono o correo" labelPlacement="floating" type="text" v-model="form.code" required></ion-input>
                  <ion-note color="danger" v-if="errors.code">{{ errors.code[0] }}</ion-note>
                </ion-item>
              </div>
              <div class="ion-padding">
                <ion-button type="submit" expand="block" shape="round" color="primary" :disabled="isLoading">
                  Confirmar
                </ion-button>
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
  IonLabel,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonNote,
  onIonViewDidEnter
} from "@ionic/vue";


import { ref, computed } from "vue";
import useUi from "@/composables/useUi";
import useAuth from "@/modules/auth/composables/useAuth";
import { useRoute, useRouter } from "vue-router";
import useAccounts from "../composables/useAccounts";
import ShowHidePasswordInput from "@/components/ShowHidePasswordInput.vue";

const { resetPassword, isLoading, errors } = useAuth();
const { getUserByIde } = useAccounts();

const { alertMessage, toastMessage } = useUi();
const router = useRouter();
const route = useRoute();
const { ide } = route.params;
const form = ref({
  ide: ide as string,
  password: "",
  password_confirmation: "",
  code: ""
});
const user = ref<any>({});
const phoneNumber = computed(() => {
  if (!user.value?.id) return '';
  return user.value.phone_number?.slice(-4);
});
onIonViewDidEnter(async () => {
  form.value.ide = ide as string;
  user.value = (await getUserByIde(ide)).user;
});

const clearForm = () => {
  form.value.ide = '';
  form.value.password = '';
  form.value.password_confirmation = '';
  form.value.code = '';
};
const onPasswordReset = async () => {
  const { ok, message } = await resetPassword(form.value);
  if (!ok) alertMessage("Error", message);
  else {
    toastMessage("Cambio realizado Correctamente");
    clearForm();
    router.push('/');
  }
};


</script>
