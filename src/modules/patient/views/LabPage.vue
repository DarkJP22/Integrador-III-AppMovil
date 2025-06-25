<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Laboratorio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <div v-if="isLoading" class="ion-text-center">
                <ion-spinner slot="start" class="spinner-button"></ion-spinner>
            </div>
            <ion-card v-if="currentLab?.id && !isLoading">
                <ion-card-content>

                    <img :src="currentLab?.logo_path" v-show="currentLab?.logo_path" />

                    <h2>{{ currentLab?.name }}</h2>
                    <h3 class="specialities">
                        {{ fullAddress }}
                    </h3>
                    <ion-text color="primary">
                        <p v-if="currentLab?.distanceMapbox">{{ "Aprox. " + currentLab.distanceMapbox + " km" }} </p>
                    </ion-text>

                </ion-card-content>
            </ion-card>
            <ion-grid v-show="currentLab?.id && !isLoading">
                <ion-row class="ion-justify-content-center" color="primary">
                    <ion-col class="" size-md="6" size-lg="5" size-xs="12">
                        <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="`/patient/lab/${currentLab?.id}/search-exams`">
                            <!-- <ion-icon :md="documentSharp" :ios="documentOutline" slot="start"></ion-icon> -->
                            Cotizar Examen

                        </ion-button>
                    </ion-col>
                    <ion-col class="" size-md="6" size-lg="5" size-xs="12">
                        <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="`/patient/lab/${currentLab?.id}/search-exams-packages`">
                            <!-- <ion-icon :md="bagSharp" :ios="bagOutline" slot="start"></ion-icon> -->
                            Paquetes</ion-button>
                    </ion-col>


                </ion-row>
                <ion-row class="ion-justify-content-center" color="primary">

                    <ion-col class="" size-md="6" size-lg="5" size-xs="12">
                        <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="`/patient/lab/${currentLab?.id}/quote`">
                            <!-- <ion-icon :md="documentLockSharp" :ios="documentLockOutline" slot="start"></ion-icon> -->
                            Cotizar Boleta</ion-button>
                    </ion-col>

                    <ion-col class="" size-md="6" size-lg="5" size-xs="12">
                        <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="''" id="open-modal">
                            <!-- <ion-icon :md="documentLockSharp" :ios="documentLockOutline" slot="start"></ion-icon> -->
                            Contactar Laboratorio</ion-button>

                    </ion-col>
                </ion-row>
                <ion-row class="ion-justify-content-center" color="primary">


                    <ion-col class="" size-md="6" size-lg="5" size-xs="12">
                        <ion-button color="primary" expand="block" size="large" fill="solid" shape="round" :router-link="`/patient/lab/${currentLab?.id}/visit`">
                            <!-- <ion-icon :md="documentLockSharp" :ios="documentLockOutline" slot="start"></ion-icon> -->
                            Solicitar Domicilio</ion-button>
                    </ion-col>

                </ion-row>

            </ion-grid>
            <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
                <ion-content class="ion-padding">
                    <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="''" @click="callContactLab">

                        Llamar Laboratorio</ion-button>
                    <ion-button color="primary" expand="block" size="large" fill="outline" shape="round" :router-link="''" @click="contactLab">

                        Mensaje Whatsapp</ion-button>
                </ion-content>
            </ion-modal>

        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonModal, IonCard, IonCardContent, IonSpinner, IonText } from '@ionic/vue';

import { computed, onMounted, ref } from 'vue';
import useLaboratories from '../composables/useLaboratories';
import { useRoute } from 'vue-router';
import useProvinces from '@/composables/useProvinces';
import useMapboxDirections from '@/composables/useMapboxDirections';
import useMyGeolocation from '@/composables/useMyGeolocation';

const route = useRoute();
const {
    getLaboratory,
    currentLab,
    isLoading,
} = useLaboratories();
const { coords } = useMyGeolocation();
const { getDistrictName, getCantonName } = useProvinces();
const { getDrivingDistance } = useMapboxDirections();

async function getDistance(clinic: any) {
    if (!coords.value.lat) return;

    const coordsArr = [coords.value.lng, coords.value.lat, clinic.lon, clinic.lat];
    const distance = await getDrivingDistance(coordsArr);

    clinic.distanceMapbox = distance;

}
const cantonName = ref("");
const districtName = ref("");

const fullAddress = computed(() => {
    return `${currentLab.value.provinceName}, ${cantonName.value}, ${districtName.value}`;
});
const whatsappPhoneNumber = computed(() => {
    if (!currentLab.value.whatsapp_number) return false;


    return currentLab.value.whatsapp_number.startsWith("506")
        ? currentLab.value.whatsapp_number
        : "506" + currentLab.value.whatsapp_number;
});
const whatsappMessage = computed(() => {
    return encodeURIComponent(
        `${currentLab.value.settings.lab_whatsapp_message}`
    );
});
function callContactLab() {
    window.open(
        "tel:" +
        whatsappPhoneNumber.value
    );
}
function contactLab() {
    window.open(
        "https://api.whatsapp.com/send/?phone=" +
        whatsappPhoneNumber.value +
        "&text=" +
        whatsappMessage.value +
        "&app_absent=0"
    );
}
onMounted(async () => {
    await getLaboratory(+route.params.id);
    getDistance(currentLab.value);
    cantonName.value = getCantonName(currentLab.value.province, currentLab.value.canton);
    districtName.value = getDistrictName(currentLab.value.province, currentLab.value.canton, currentLab.value.district);
});
</script>
<style scoped>
.ion-clinics ion-item:nth-child(odd) {
    --background: var(--ion-color-odd);
}

ion-card {
    margin-top: 80px !important;
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
    height: 100px;
    width: 100px;
    border-radius: 50%;
    margin-top: -100px;
    border: solid 4px #ffffff;
    display: inline;
    object-fit: contain;
    object-position: center;
}

ion-card-content h2 {
    font-size: 1.3rem;
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