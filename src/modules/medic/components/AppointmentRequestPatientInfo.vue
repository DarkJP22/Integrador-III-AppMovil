<template>
    <div class="patient-info">
        <ion-item>
            <ion-input label="Fecha de solicitud" labelPlacement="floating" type="text" :value="parseDatetime(appointmentRequest.date)" readonly></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Paciente" labelPlacement="floating" type="text" :value="appointmentRequest.patient?.first_name" readonly></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Identificación" labelPlacement="floating" type="text" :value="appointmentRequest.patient?.ide" readonly></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Teléfono" labelPlacement="floating" type="text" :value="appointmentRequest.patient?.phone_number" readonly></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Dirección" labelPlacement="floating" type="text" :value="appointmentRequest.patient?.address" readonly></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Fecha de nacimiento" labelPlacement="floating" type="text" :value="parseDate(appointmentRequest.patient?.birth_date)" readonly></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label="Consultorio" labelPlacement="floating" type="text" :value="appointmentRequest.office?.name" readonly></ion-input>
        </ion-item>
        <ion-item v-if="appointmentRequest.scheduled_date">
            <ion-input label="Agendada" labelPlacement="floating" type="text" class="bold" :value="parseDatetime(appointmentRequest.start)" readonly></ion-input>
        </ion-item>
        <ion-item v-if="appointmentRequest.file_path">
            <ion-button color="secondary" expand="block" shape="round" size="small" :href="appointmentRequest.file_url" download="true">
                Descargar Comprobante
            </ion-button>
        </ion-item>

    </div>
</template>
<script setup lang="ts">
import {
    IonItem,
    IonInput
} from "@ionic/vue";
import useUtilities from '@/composables/useUtilities';

defineProps({
    appointmentRequest: {
        type: Object,
        required: true
    }
});

const { parseDatetime, parseDate } = useUtilities();


</script>