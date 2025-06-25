<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Horario de visitas</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-item>
                <ion-select label="Selecciona la ubicación" labelPlacement="floating" v-model="location">
                    <ion-select-option value=""></ion-select-option>
                    <ion-select-option :value="location" v-for="location in visitLocations" :key="location">
                        {{ location }}</ion-select-option>
                </ion-select>
                <!-- <ion-note color="danger" v-if="errors.province">{{
                      errors.province[0]
                    }}</ion-note> -->
            </ion-item>
            <div class="ion-padding-top ion-text-center" v-if="location">
                <div v-for="visit in filteredVisits" :key="visit.id">
                    <h4 class="ion-text-center">Dias de visita en {{ visit.location }}</h4>
                    <ion-item v-for="day in visit.schedule" :key="day">
                        <ion-label class="ion-text-center ion-text-lg">
                            <h1> {{ day }}</h1>

                        </ion-label>
                    </ion-item>
                </div>

                <ion-button @click="goToVisitRequest">¿Deseas confirmar tu cita?</ion-button>
            </div>
            <LoginModal v-model:is-open="openLoginModal"></LoginModal>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import LoginModal from "@/components/LoginModal.vue";
import useAuth from '@/modules/auth/composables/useAuth';
import useLabVisits from '@/modules/patient/composables/useLabVisits';

import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonSelect, IonSelectOption, IonLabel, IonButton } from '@ionic/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const { auth, setUrlIntended } = useAuth();
const { getVisits, visits, currentVisitLocation } = useLabVisits();
const router = useRouter();
const route = useRoute();
const location = ref('');
const openLoginModal = ref(false);
watch(location, (val) => {
    currentVisitLocation.value = val;
});
const filteredVisits = computed(() => {
    return visits.value.filter(v => v.location?.toUpperCase() == location.value);
})
const visitLocations = computed(() => {
    return visits.value.map(v => v.location?.toUpperCase());
})

const isGuest = computed(() => auth.value.status !== 'authenticated');

const goToVisitRequest = () => {
    if (isGuest.value) {
        // alertMessage('Autentificación', 'Necesitas REGISTRARTE COMO PACIENTE para ver esta sección. Si ya tienes una cuenta inicia sesión', 'Ingresar', goToAuth, 'Despues');
        openLoginModal.value = true;
        setUrlIntended(`/patient/lab/${route.params.id}/visit`);
    } else {

        router.push({ name: 'lab-visit-request', params: { id: route.params.id }});
    }
};

onMounted(() => {
    getVisits({ office_id: +route.params.id });
})
</script>