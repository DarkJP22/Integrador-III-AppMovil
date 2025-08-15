<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Paciente Afiliado</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" router-link="/notifications">
            <ion-icon :md="notificationsSharp" :ios="notificationsOutline"></ion-icon>
            <ion-badge slot="start" color="danger" v-if="newNotifications.length">{{ newNotifications.length }}</ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :color="darkModeActive ? '' : 'primary'">
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
            <ion-col size-md="12" size-lg="12" size-xs="12" class="ion-text-center">
              <img v-if="darkModeActive" src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
              <img v-else src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
            </ion-col>
          </ion-row>

          <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
            <ion-col size-md="12" size-lg="12" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/patient/search">
                Buscar Profesional
              </ion-button>
            </ion-col>

            <ion-col size-md="12" size-lg="12" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/patient/search-labs">
                <ion-icon :md="peopleSharp" :ios="peopleOutline" slot="start"></ion-icon> 
                Laboratorio
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <LoginModal v-model:is-open="openLoginModal"></LoginModal>
    </ion-content>

    <ion-footer v-if="isGuest">
      <ion-toolbar class="ion-text-center">
        <ion-title color="primary" router-link="/auth/login">Iniciar como Profesional</ion-title>
      </ion-toolbar>
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
  IonBadge
} from "@ionic/vue";
import {
  notificationsSharp,
  notificationsOutline,
  peopleOutline,
  peopleSharp
} from "ionicons/icons";
import useAuth from "@/modules/auth/composables/useAuth";
import useNotifications from "@/composables/useNotifications";
import { computed, ref } from "vue";
import LoginModal from "@/components/LoginModal.vue";

const { auth } = useAuth();
const { newNotifications } = useNotifications();
const openLoginModal = ref(false);

const darkModeActive = computed(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches;
});

const isGuest = computed(() => auth.value.status !== 'authenticated');
const currentUser = computed(() => auth.value.user?.name ?? 'Invitado');
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
  padding-top: 6rem;
  width: 100%;
}
</style>
