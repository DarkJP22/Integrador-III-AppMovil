<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Bienvenido</ion-title>
        <ion-buttons slot="end">
           <ion-button fill="clear" color="warning" router-link="/medic/appointments">
            <ion-icon :md="callSharp" :ios="callOutline" size="large"></ion-icon>
          </ion-button>
          <ion-button fill="clear" router-link="/notifications">
            <ion-icon :md="notificationsSharp" :ios="notificationsOutline"></ion-icon>
            <ion-badge slot="start" color="danger" v-if="newNotifications.length">{{ newNotifications.length }}</ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" :color="darkModeActive ? '' : 'primary'">
      <div class="username ion-text-center">
        <ion-chip color="dark">
          <ion-avatar>
            <img alt="User" src="@/assets/avatar.svg" />
          </ion-avatar>
          <ion-label>{{ currentUser }}</ion-label>
        </ion-chip>
      </div>
      <div class="home-page ion-padding">
        <ion-grid>
          <ion-row class="ion-justify-content-center" color="primary">
            <ion-col class="" size-md="12" size-lg="12" size-xs="12">
              <div class="ion-text-center">
                <img v-if="darkModeActive" src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
                <img v-else src="@/assets/logo-white.png" alt="Doctor Blue" class="logo inline-block w-32" />
              </div>

            </ion-col>
          </ion-row>
          <ion-row class="ion-justify-content-center" color="primary">
            <ion-col class="" size-md="6" size-lg="5" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" :router-link="appointmentsUrl">
                <ion-icon :md="listSharp" :ios="listOutline" slot="start"></ion-icon>
                Citas Médicas
                <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="appointmentsNotifications.length">{{ appointmentsNotifications.length }}</ion-badge>
              </ion-button>
            </ion-col>
            <ion-col class="" size-md="6" size-lg="5" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" router-link="/medic/patients" shape="round">
                <ion-icon :md="peopleSharp" :ios="peopleOutline" slot="start"></ion-icon>Pacientes
                <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="notificationsLabresults.length">{{ notificationsLabresults.length }}</ion-badge>
              </ion-button>
            </ion-col>
            <ion-col class="" size-md="6" size-lg="5" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/medic/agenda">
                <ion-icon :md="calendarSharp" :ios="calendarOutline" slot="start"></ion-icon>Programar Agenda
              </ion-button>
            </ion-col>

            <!-- <ion-col class="" size-md="6" size-lg="5" size-xs="12">
              <ion-button :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/medic/lab-results">
                <ion-icon :md="thermometerSharp" :ios="thermometerOutline" slot="start"></ion-icon>Laboratorios
                <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="notificationsLabresults.length">{{ notificationsLabresults.length }}</ion-badge>
              </ion-button>
            </ion-col> -->
            <ion-col class="" size-md="6" size-lg="5" size-xs="12">
              <ion-button v-if="enableCommissionLab" :color="darkModeActive ? 'primary' : 'light'" expand="block" size="large" shape="round" router-link="/medic/commission-transactions">
                <ion-icon :md="cashSharp" :ios="cashOutline" slot="start"></ion-icon>Comisión Laboratorio
                <ion-badge slot="end" color="danger" class="ion-margin-start" v-if="notificationsCommissions.length">{{ notificationsCommissions.length }}</ion-badge>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useAuth from "@/modules/auth/composables/useAuth";
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
  IonBadge,
  IonChip,
  IonAvatar,
  IonLabel,
  onIonViewDidEnter
} from "@ionic/vue";
import {
  notificationsSharp,
  notificationsOutline,
  listSharp,
  listOutline,
  calendarOutline,
  calendarSharp,
  peopleOutline,
  peopleSharp,
  cashOutline,
  cashSharp,
  callOutline,
  callSharp,
  //thermometerOutline,
  //thermometerSharp,
} from "ionicons/icons";
import { computed, onMounted } from "vue";
import useLabresults from "../composables/useLabresults";
import useCommissions from "../composables/useCommissions";
import useUi from "@/composables/useUi";
import useAppointmentRequests from "../composables/useAppointmentRequests";
import useAppointments from "../composables/useAppointments";
import { useRouter } from "vue-router";
import useNotifications from "@/composables/useNotifications";

const { auth, setUrlIntended, enableCommissionLab } = useAuth();
const { alertMessage } = useUi();
const { notificationsLabresults } = useLabresults();
const { notificationsCommissions } = useCommissions();
const { notificationsAppointmentRequests } = useAppointmentRequests();
const { notificationsAppointments } = useAppointments();
const { newNotifications } = useNotifications();
const router = useRouter();


const darkModeActive = computed(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches;
});

const appointmentsUrl = computed(() => {
  return '/medic/appointments';
  // return enableAgenda.value
  //   ? "/medic/appointments"
  //   : "/medic/appointment-requests";
});

const appointmentsNotifications = computed(() => {
  return [...notificationsAppointments.value, ...notificationsAppointmentRequests.value];
  // return enableAgenda.value
  //   ? notificationsAppointments.value
  //   : notificationsAppointmentRequests.value;
});
const goToCreateOffice = () => {
  router.push({ name: 'office', params: { id: 'new' } });
};

onIonViewDidEnter(async () => {
  if (!auth.value.user?.offices_count) {
    alertMessage(
      "Completar Perfil",
      "Aun no tienes consultorios",
      "Registrar Mi Consultorio",
      goToCreateOffice,
      true
    );
  }

  // currentChannel.value?.listen('AppointmentRequestCreatedEvent', (data: any) => {
  //   addNotificationAppointmentRequest(data.appointmentRequest);
  //   }).listen('AppointmentCreatedEvent', (data: any) => {
  //     addNotification(data.appointment);
  //   }).listen('LabResultCreatedEvent', (data: any) => {
  //     addNotificationLabresult(data.labresult);
  //   }).listen('CommissionPaidEvent', (data: any) => {
  //     addNotificationCommission(data.commission);
  //   });
});

onMounted(() => {
  if (auth.value.url_intended) {
    router.push(auth.value.url_intended);
    setUrlIntended('');
  }

});
const currentUser = computed(() => {
  const prefix = auth.value.user?.type_of_health_professional === 'medico' ? 'Dr(a).' : 'Lic.';
  return `${prefix} ${auth.value.user?.name}`;
});

</script>
<style scoped>
.logo {
  max-width: 18rem;
}

ion-button {
  text-transform: capitalize;
}

.username {
  font-weight: bold;
  position: absolute;
  width: 100%;
  margin-top: .5em;
}

.home-page {
  display: flex;
  place-items: center;
  height: 100%;
}
</style>
