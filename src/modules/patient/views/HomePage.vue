<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Bienvenido</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" router-link="/notifications"><ion-icon :md="notificationsSharp" :ios="notificationsOutline"></ion-icon> <ion-badge slot="start" color="danger" v-if="newNotifications.length">{{ newNotifications.length }}</ion-badge></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :color="darkModeActive ? '' : 'primary'">
      <!-- <div class="px-2  top-0 left-0 z-10 inset-x-0">
        <MedicStories v-if="!isGuest"></MedicStories>

      </div> -->
      <ion-item color="secondary" lines="none" class="ion-text-center" v-if="patientsWithIncompleteInformation">
        <ion-label class="ion-text-wrap">

          <p class="patient-information-complete-message">

            Recuerda completar tu expediente

          </p>
          <ion-button color="primary" router-link="/patient/patients"><ion-icon :md="peopleOutline" :ios="peopleOutline" slot="start"></ion-icon>
            Completar</ion-button>
        </ion-label>
      </ion-item>

      <div class="username ion-text-center">
        <ion-chip color="dark">
          <ion-avatar>
            <img alt="User" src="@/assets/avatar.svg" />
          </ion-avatar>
          <ion-label>{{ currentUser }}</ion-label>
        </ion-chip>
      </div>
      <div class="home-page ion-padding grid h-full place-items-center">
        <ion-grid class="mb-24">
          <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <div class="ion-text-center">
                <img v-if="darkModeActive" src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
                <img v-else src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
              </div>

            </ion-col>
          </ion-row>
          <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
            <!-- <ion-col class="" size-md="6" size-lg="5" size-xs="12">
            <ion-button
              color="primary"
              expand="block"
              size="large"
              router-link="/patient/balances"
              
              ><ion-icon
                :md="cashSharp"
                :ios="cashOutline"
                slot="start"
              ></ion-icon>
              Saldos Acumulados</ion-button
            >
          </ion-col> -->

            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/patient/search">
                Buscar Profesional</ion-button>
            </ion-col>
           <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/patient/search-labs">
                <ion-icon :md="peopleSharp" :ios="peopleOutline" slot="start"></ion-icon> 
                Laboratorio</ion-button>
            </ion-col>
          </ion-row>
          <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" @click="goToExpedient">
                <!-- <ion-icon :md="documentTextSharp" :ios="documentTextOutline" slot="start"></ion-icon> -->
                Mi Expediente <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="notificationsLabresults.length">{{ notificationsLabresults.length }}</ion-badge></ion-button>
            </ion-col>

            <ion-col class="" size-md="12" size-lg="12" size-xs="12"> </ion-col>
          </ion-row>

                    <ion-row class="ion-justify-content-center ion-align-items-center">
            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" @click="goToPharmacies">
                Farmacias <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="notificationsLabresults.length">{{ notificationsLabresults.length }}</ion-badge></ion-button>
            </ion-col>

            <ion-col class="" size-md="12" size-lg="12" size-xs="12"> </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <LoginModal v-model:is-open="openLoginModal"></LoginModal>
    </ion-content>
    <ion-footer v-if="isGuest">
      <ion-toolbar class="ion-text-center"> <ion-title color="primary" router-link="/auth/login">Iniciar como Profesional</ion-title></ion-toolbar>

    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
  IonChip,
  IonAvatar,
  IonLabel,
  IonFooter,
  IonItem,
  IonBadge,
} from "@ionic/vue";
import {
  notificationsSharp,
  notificationsOutline,
  peopleOutline,
  peopleSharp,
} from "ionicons/icons";
import useAuth from "@/modules/auth/composables/useAuth";
import { computed, watch, onMounted, ref } from "vue";
import useUi from "@/composables/useUi";
import { useRouter } from "vue-router";
import LoginModal from "@/components/LoginModal.vue";
import useLabresults from "../composables/useLabresults";
//import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";
import useNotifications from "@/composables/useNotifications";
import MedicStories from "@/components/MedicStories.vue";
const { notificationsLabresults } = useLabresults();
//const { currentChannel } = useMyBroadcastEvents();
const { newNotifications } = useNotifications();
const { auth, setUrlIntended } = useAuth();
const router = useRouter();
const { alertMessage } = useUi();

const openLoginModal = ref(false);

const darkModeActive = computed(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches;
});

const isGuest = computed(() => auth.value.status !== 'authenticated');
const goTo = () => {
  router.push({ name: 'patient-account' });
};

const goToExpedient = () => {
  if (isGuest.value) {
    // alertMessage('Autentificación', 'Necesitas REGISTRARTE COMO PACIENTE para ver esta sección. Si ya tienes una cuenta inicia sesión', 'Ingresar', goToAuth, 'Despues');
    openLoginModal.value = true;

  } else {

    router.push({ name: 'expedient' });
  }
};
const goToPharmacies = () => {
  if (isGuest.value) {
    // alertMessage('Autentificación', 'Necesitas REGISTRARTE COMO PACIENTE para ver esta sección. Si ya tienes una cuenta inicia sesión', 'Ingresar', goToAuth, 'Despues');
    openLoginModal.value = true;

  } else {

    router.push({ name: 'branches' });
  }
};
watch(auth, async (newVal) => {
  if (isGuest.value) return;
  if (!newVal.user.changed_password) {
    alertMessage('Cambiar contraseña', 'Parece que es la primera vez que inicias sesión. Por cuestiones de seguridad se recomienda que cambies tu contraseña', 'Cambiar', goTo, 'Despues');


  }
}, { immediate: true })


onMounted(() => {

  if (auth.value.url_intended) {
    router.push(auth.value.url_intended);
    setUrlIntended('');
  }
})

const currentUser = computed(() => auth.value.user?.name ?? 'Invitado');
const patientsWithIncompleteInformation = computed(() => !!auth.value.user?.patients_with_incomplete_information_count);

</script>
<style scoped>
.logo {
  max-width: 18rem;
}

.username {
  font-weight: bold;
  position: absolute;
  width: 100%;
  margin-top: .5em;
}

.home-page {
  /* display: grid;
  place-items: center; */
  padding-top: 6rem;
  width: 100%;
}
</style>
