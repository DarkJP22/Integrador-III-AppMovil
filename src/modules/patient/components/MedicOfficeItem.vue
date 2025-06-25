<template>
    <ion-item>
        <ion-label class="ion-text-wrap">
            {{ clinic.name }}
            <p>
                <DistrictName :province-id="clinic.province" :canton-id="clinic.canton" :district-id="clinic.district" />
            </p>
            <p class="flex gap-2">
                <MedicAvailableToday :settings="settings" :schedules="schedules.filter(sch => sch.office_id === clinic.id)" :appointments="appointments?.filter(app => app.office_id === clinic.id)" />
               
            </p>
    
            <ion-text color="primary">
                <p v-if="clinic.distanceMapbox">{{ "Aprox. " + clinic.distanceMapbox + " km" }}</p>
            </ion-text>
            <div class="flex justify-between gap-4 mt-4">
                <template v-if="!clinic.utiliza_agenda_gps">
                    <div>

                        <ion-button shape="round" color="tertiary" class="btn-solicitar" @click="goToBookAppointmentRequest(clinic.id)">
                            Solicitar Cita
                        </ion-button>

                        <p>Cuando solicitas una cita debes esperar a ser contactado por el médico</p>
                    </div>
                </template>

                <template v-else>
                    <div>
                        <ion-button shape="round" @click="goToBookAppointment(clinic.id)">

                            Reservar Cita
                        </ion-button>

                        <p>Utiliza reservar para seleccionar el día y la hora en la que deseas tu cita</p>
                    </div>
                </template>
                <template v-if="hasTeleconsulta">
                    <div>

                        <ion-button v-if="hasTeleconsulta" shape="round" color="warning" @click="goToBookTeleconsultation(clinic.id)">

                            Teleconsulta
                        </ion-button>
                        <p>Cuando solicitas teleconsulta debes esperar a ser contactado por el médico</p>
                    </div>
                </template>

            </div>


        </ion-label>
    </ion-item>
</template>

<script setup lang="ts">
import {
    IonItem,
    IonLabel,
    IonButton,
    IonText,
} from "@ionic/vue";
import { PropType } from "vue";
import DistrictName from "./DistrictName.vue";
import MedicAvailableToday from "./MedicAvailableToday.vue";
import useAvailabilitySchedule from "@/composables/useAvailabilitySchedule";


const props = defineProps({
    clinic: {
        type: Object as PropType<any>,
        required: true,
    },
    medicId: {
        type: [Number, String],
        required: true,
    },
    settings: {
        type: Object,
        required: true,
    },
    schedules: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    appointments: {
        type: Array as PropType<any[]>,
        default: () => []
    },
});

const emit = defineEmits(['book-appointment', 'book-appointment-request', 'book-teleconsultation']);

const { hasTeleconsulta } = useAvailabilitySchedule({
    settings: props.settings,
    schedules: props.schedules.filter(sch => sch.office_id === props.clinic.id),
    appointments: props.appointments?.filter(app => app.office_id === props.clinic.id)
});

const goToBookAppointment = (officeId: number | string) => {
    emit('book-appointment', { medicId: props.medicId, officeId });
};

const goToBookAppointmentRequest = (officeId: number | string) => {
    emit('book-appointment-request', { medicId: props.medicId, officeId });
};

const goToBookTeleconsultation = (officeId: number | string) => {
    emit('book-teleconsultation', { medicId: props.medicId, officeId });
};
</script>
