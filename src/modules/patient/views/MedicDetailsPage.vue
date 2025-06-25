<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Profesional </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-card>
        <ion-card-content>

          <img :src="medic.avatar_path" v-show="medic.avatar_path" />

          <h2>{{ medicName }}</h2>

          <h3 class="specialities">
            <span v-for="(speciality, index) in specialities" :key="speciality + index">{{ speciality }}</span>
          </h3>

          <ion-button :router-link="`/patient/medics/${medic.id}/profile`">Ver Perfil</ion-button>
        </ion-card-content>
        <ion-list class="ion-clinics">

          <ion-list-header>
            <h3>Clínicas o Consultorios</h3>
          </ion-list-header>

          <MedicOfficeItem v-for="clinic in medicOffices" :key="clinic.id" :clinic="clinic" :medic-id="medic.id" :settings="medic.settings" :schedules="medic.schedules" :appointments="medic.appointments" @book-appointment="handleBookAppointment" @book-appointment-request="handleBookAppointmentRequest" @book-teleconsultation="handleBookTeleconsultation" />

        </ion-list>

        <LoginModal v-model:is-open="openLoginModal" @cancel="setUrlIntended('')">
        </LoginModal>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonList,
  IonListHeader,
  IonCard,
  IonCardContent,
  IonButton,
} from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useMedics from "../composables/useMedics";
import useAuth from "@/modules/auth/composables/useAuth";
import useMyGeolocation from "@/composables/useMyGeolocation";
import useMapboxDirections from "@/composables/useMapboxDirections";
import LoginModal from "@/components/LoginModal.vue";
import useUtilities from "@/composables/useUtilities";
import MedicOfficeItem from "../components/MedicOfficeItem.vue";
const route = useRoute();
const router = useRouter();
const { coords } = useMyGeolocation();
const { getMedic } = useMedics();
const {
  today } = useUtilities();

const { auth, setUrlIntended } = useAuth();
const { getDrivingDistance } = useMapboxDirections();
const { id } = route.params;
const medic = ref<any>({});
const openLoginModal = ref(false);

const medicName = computed(() => {
  return medic.value.name; //temporalmente desabilitado
});

const handleBookAppointment = ({ medicId, officeId }: { medicId: number | string, officeId: number | string }) => {
  if (auth.value.status !== 'authenticated') {
    openLoginModal.value = true;
    setUrlIntended(`/patient/medics/${medicId}/offices/${officeId}/book-appointment`);
  } else {
    router.push({ name: 'book-appointment', params: { medicId, officeId } });
  }
};

const handleBookAppointmentRequest = ({ medicId, officeId }: { medicId: number | string, officeId: number | string }) => {
  if (auth.value.status !== 'authenticated') {
    openLoginModal.value = true;
    setUrlIntended(`/patient/medics/${medicId}/offices/${officeId}/book-appointment-request`);
  } else {
    router.push({ name: 'book-appointment-request', params: { medicId, officeId } });
  }
};

const handleBookTeleconsultation = ({ medicId, officeId }: { medicId: number | string, officeId: number | string }) => {
  if (auth.value.status !== 'authenticated') {
    openLoginModal.value = true;
    setUrlIntended(`/patient/medics/${medicId}/offices/${officeId}/teleconsultation`);
  } else {
    router.push({ name: 'book-teleconsultation', params: { medicId, officeId } });
  }
};

const specialities = computed(() => {
  if (!medic.value.id) return "";

  if (!medic.value.specialities.length) {
    return medic.value.type_of_health_professional === 'medico' ? ["Médico General"] : '';
  }

  return medic.value.specialities.map((s: any) => s.name);
});

const medicOffices = computed(() => {
  return medic.value.offices;
});

async function getDistance(clinic: any) {
  if (!coords.value.lat) return;

  const coordsArr = [coords.value.lng, coords.value.lat, clinic.lon, clinic.lat];
  const distance = await getDrivingDistance(coordsArr);

  clinic.distanceMapbox = distance;

}


onMounted(async () => {

  const resp = await getMedic(parseInt(id.toString()), { lat: coords.value.lat, lon: coords.value.lng, date: today() });
  medic.value = resp;

  medic.value.offices.forEach((clinic: any) => {
    getDistance(clinic);
  });



});

</script>

<style scoped>
/* .ion-clinics ion-item:nth-child(even) {

} */

.ion-clinics ion-item:nth-child(odd) {
  --background: var(--ion-color-odd);
}

ion-card {
  margin-top: 100px !important;
  overflow: visible;
  contain: none;
}

ion-card-content {
  background: var(--ion-color-medium);
  color: #ffffff;
  text-align: center;
  padding-bottom: 28px;
}

ion-card-content img {
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-top: -100px;
  border: solid 4px #ffffff;
  display: inline;
  object-fit: cover;
  object-position: center;
}

ion-card-content h2 {
  font-size: 1.5rem;
  margin-top: 0.5rem;
  color: white !important;
}

ion-card-content h3 {
  font-size: 1rem;
  color: white !important;
}

ion-label h2 {
  font-size: 1.3rem;
}

h3.specialities span {
  padding-right: .5rem;
}

h3.specialities span:last-child {
  padding-right: 0;
}
</style>
