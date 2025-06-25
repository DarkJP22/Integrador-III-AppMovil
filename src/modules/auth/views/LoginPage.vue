<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Iniciar</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/" text=""><ion-icon :md="homeSharp" :ios="homeOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :color="darkModeActive ? '' : 'primary'">
      <form action="#" @submit.prevent="onLogin()">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col class="ion-align-self-center" size-md="6" size-lg="5" size-xs="12">
              <div class="ion-text-center bg-green">
                <img v-if="darkModeActive" src="@/assets/logo-white.png" alt="Citta" class="logo inline-block" />
                <img v-else src="@/assets/logo-white.png" alt="Citta" class="logo inline-block" />
              </div>
              <div class="ion-padding">
                <ion-item :color="darkModeActive ? '' : 'primary'" :class="darkModeActive ? '' : 'primary-green'">
                  <ion-input label="Email ó idenficación" labelPlacement="floating" type="text" v-model="form.email" :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email" required></ion-input>
                </ion-item>
                <ion-item :color="darkModeActive ? '' : 'primary'" :class="darkModeActive ? '' : 'primary-green'">
                  <ShowHidePasswordInput v-model="form.password" label="Contraseña" label-placement="floating" :required="true" />
                </ion-item>
              </div>
              <div class="ion-padding">
                <ion-button type="submit" expand="block" shape="round" :color="darkModeActive ? 'primary' : 'light'">
                  Iniciar
                </ion-button>
                <div style="margin-bottom: 2rem; margin-top: 2rem; text-align: center;">
                  <p>Si aun no tienes cuenta debes registrarte primero</p>
                </div>
                <ion-button @click="() => router.push('/auth/register')" expand="block" shape="round" :color="darkModeActive ? 'primary' : 'light'" class="ion-margin-top">
                  Registrarse como Paciente
                </ion-button>
                <ion-button @click="() => router.push('/auth/register-medic')" expand="block" shape="round" :color="darkModeActive ? 'primary' : 'light'" class="ion-margin-top">
                  Registrarse como Profesional
                </ion-button>
                <ion-button @click="() => router.push('/auth/forgot-password')" fill="clear">
                  Olvidaste la contraseña?
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
      <ion-footer collapse="fade">
        <ion-toolbar :color="darkModeActive ? '' : 'primary'">
          <ion-title class="ion-text-center">
            <small>v.{{ versionApp }}</small> <br>
            <small>
              <SupportLink />
            </small>
          </ion-title>

        </ion-toolbar>
      </ion-footer>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonButton,
  IonInput,
  IonItem,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  menuController,
  alertController,
  IonFooter,
  IonButtons,
  IonBackButton,
  IonIcon,
  onIonViewDidEnter
} from "@ionic/vue";
import { homeSharp, homeOutline } from 'ionicons/icons'
import { computed, onMounted, ref } from "vue";
import useAuth from "@/modules/auth/composables/useAuth"
import useUi from "@/composables/useUi";
import { useRouter } from "vue-router";
import useAppUpdater from "@/composables/useAppUpdater";
import SupportLink from "@/components/SupportLink.vue";
import ShowHidePasswordInput from "@/components/ShowHidePasswordInput.vue";


onIonViewDidEnter(() => {
  menuController.swipeGesture(false);
});

const { login, auth, checkMedicAuthorization, errors } = useAuth();
const { alertMessage, loadingMessage, dismissLoading } = useUi();
const { versionApp } = useAppUpdater();
const router = useRouter();
const form = ref({
  email: "",
  password: "",
});

const darkModeActive = computed(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches;
});

onMounted(() => {
  form.value.email = "";
  form.value.password = "";
});

const onLogin = async () => {
  loadingMessage();

  const resp = await login(form.value);

  dismissLoading();

  if (resp.ok) {
    if (auth.value.isMedic) {
   
      router.push("/medic/home");
    } else {
      router.push("/patient/home");
    }
  } else {
    alertMessage("Error", errors.value.email);
  }

};

const presentAuthorizationCodeAlert = async () => {
  const alert = await alertController.create({
    header: "Código de autorización",
    backdropDismiss: false,
    buttons: [
      {
        cssClass: "secondary",
        text: "Confirmar",
        role: "confirm",
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
    ],
    inputs: [
      {
        placeholder: "Código",
      },
    ],
  });

  await alert.present();

  const { role, data } = await alert.onDidDismiss();

  if (role !== "confirm") return;

  const { ok, message, code } = await checkMedicAuthorization(data.values[0]);

  if (!ok) {
    const { role } = await alertMessage(
      "Error",
      message,
      "Reintentar",
      null,
      true
    );

    if (role !== "confirm") {
      return;
    }

    await presentAuthorizationCodeAlert();
  } else {
  

    router.push({ name: 'registerMedic', params: { code } })
  }
};

</script>

<style scoped>
.logo {
  max-width: 8rem;
}
</style>