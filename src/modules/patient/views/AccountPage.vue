<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Cuenta </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="confirmDelete">
            Eliminar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="form">
        <form action="#" @submit.prevent="onSave()" novalidate>
          <ion-grid>
            <ion-row class="ion-justify-content-center" color="primary">
              <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                <div class="">
                  <ion-item>
                    <ion-input label="Identificación" labelPlacement="floating" type="number" v-model="form.ide" :class="{ 'ion-invalid ion-touched': errors?.ide }" :errorText="errors?.ide" required></ion-input>
                   
                  </ion-item>
                  <ion-item>
                    <ion-input label="Nombre" labelPlacement="floating" type="text" v-model="form.name" :class="{ 'ion-invalid ion-touched': errors?.name }" :errorText="errors?.name"  required></ion-input>
                   
                  </ion-item>

                  <ion-item>
                    <ion-input label="Teléfono" labelPlacement="floating" type="number" v-model="form.phone_number" :class="{ 'ion-invalid ion-touched': errors?.phone_number }" :errorText="errors?.phone_number"></ion-input>
                   
                  </ion-item>
                  <ion-item>
                    <ion-input label="Correo" labelPlacement="floating" type="email" v-model="form.email" :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email" required></ion-input>
                 
                  </ion-item>
                  <ion-item>
                    <ShowHidePasswordInput v-model="form.password" label="Cambiar contraseña" label-placement="floating" :error="errors?.password" />
                  </ion-item>
                </div>
                <div class="ion-padding">
                  <ion-button type="submit" expand="block" :disabled="isLoading" shape="round">
                    Guardar
                  </ion-button>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  alertController,
} from "@ionic/vue";

import { onMounted, ref } from "vue";
import useUi from "@/composables/useUi";
import useAccount from "@/modules/patient/composables/useAccount";
import { useRouter } from "vue-router";
import ShowHidePasswordInput from "@/components/ShowHidePasswordInput.vue";

const { updateUser, getUser, isLoading, errors, deleteAccount } = useAccount();
const { toastMessage, alertMessage } = useUi();
const form = ref<any>({});
const router = useRouter();


const onSave = async () => {
  if (form.value.id) {
    const { ok, message } = await updateUser(form.value);
    if (!ok) alertMessage("Error", message);
    else { toastMessage("Guardado correctamente");
        router.back();
    }
  }
};

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: "Cancelación de Cuenta",
    message: 'Estas seguro que deseas eliminar tu cuenta. Esta acción eliminara todos tus datos de la plataforma. Ten en cuenta que esta acción es irreversible',
    backdropDismiss: false,
    buttons: [
      {
        cssClass: "primary",
        text: "Confirmar",
        role: "confirm",
        handler: async () => {
        
          const { ok, message } = await deleteAccount();
          if (!ok) alertMessage("Error", message);
          else router.replace({ name: 'login' });
        }
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
    ],

  });

  await alert.present();


};

onMounted(async () => {
  const { user } = await getUser();
  form.value = user;
});


</script>
