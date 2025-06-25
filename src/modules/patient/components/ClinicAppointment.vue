<template>
  <ion-card>
    <ion-card-header color="light">

      <ion-card-subtitle>{{ appointmentDate }} - {{ hours }}</ion-card-subtitle>
      <ion-card-title>{{ patient }}</ion-card-title>

    </ion-card-header>

    <ion-card-content>
      <ion-button size="small" @click="onSummary" :disabled="isLoading" class="ion-float-right download-btn"> Descargar <ion-icon :ios="documentOutline" slot="end" :md="documentSharp"></ion-icon></ion-button>

      <ion-accordion-group>
        <ion-accordion value="signs" v-if="appointment.vital_signs">
          <ion-item slot="header">
            <ion-icon :icon="thermometer" slot="start"></ion-icon>
            <ion-label color="primary">Signos Vitales</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Altura: {{ appointment.vital_signs.height }} Mts</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Peso: {{ appointment.vital_signs.weight }} kg</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Masa Corporal:
                {{ appointment.vital_signs.mass }} lmc</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Temperatura: {{ appointment.vital_signs.temp }} C</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Frecuencia Respiratoria:
                {{ appointment.vital_signs.respiratory_rate }} r/m</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Presión Arterial: P.S
                {{ appointment.vital_signs.blood_ps }} P.D
                {{ appointment.vital_signs.blood_pd }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Frecuencia Cardiaca:
                {{ appointment.vital_signs.heart_rate }} l/m</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Saturación de Oxígeno:
                {{ appointment.vital_signs.oxygen }} %</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Masa Corporal:
                {{ appointment.vital_signs.glicemia }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="disease_notes">
          <ion-item slot="header">
            <ion-icon :icon="document" slot="start"></ion-icon>
            <ion-label color="primary">Notas de padecimiento</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label class="ion-text-wrap">Síntomas subjetivos:
                {{ appointment.disease_notes.symptoms }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">Exploración Física:
                {{ appointment.disease_notes.phisical_review }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="physical_exams">
          <ion-item slot="header">
            <ion-icon :icon="accessibility" slot="start"></ion-icon>
            <ion-label color="primary">Examen Físico</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item v-show="appointment.physical_exams.cardio">
              <ion-label class="ion-text-wrap">Cardiaco y Vascular:
                {{ appointment.physical_exams.cardio }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.linfatico">
              <ion-label class="ion-text-wrap">Sistema Linfático:
                {{ appointment.physical_exams.linfatico }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.osteoarticular">
              <ion-label class="ion-text-wrap">Osteoarticular:
                {{ appointment.physical_exams.osteoarticular }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.psiquiatrico">
              <ion-label class="ion-text-wrap">Psiquiátrico y Psicológico:
                {{ appointment.physical_exams.psiquiatrico }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.digestivo">
              <ion-label class="ion-text-wrap">Aparato Digestivo:
                {{ appointment.physical_exams.digestivo }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.dermatologico">
              <ion-label class="ion-text-wrap">Dermatológico:
                {{ appointment.physical_exams.dermatologico }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.otorrinolaringologico">
              <ion-label class="ion-text-wrap">Otorrinolaringológico:
                {{
                  appointment.physical_exams.otorrinolaringologico
                }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.reproductor">
              <ion-label class="ion-text-wrap">Aparato Reproductor:
                {{ appointment.physical_exams.reproductor }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.urinario">
              <ion-label class="ion-text-wrap">Aparato Urinario:
                {{ appointment.physical_exams.urinario }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.neurologico">
              <ion-label class="ion-text-wrap">Neurológico:
                {{ appointment.physical_exams.neurologico }}</ion-label>
            </ion-item>
            <ion-item v-show="appointment.physical_exams.pulmonar">
              <ion-label class="ion-text-wrap">Pulmonar o Respiratorio:
                {{ appointment.physical_exams.pulmonar }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="labexams">
          <ion-item slot="header">
            <ion-icon :icon="home" slot="start"></ion-icon>
            <ion-label color="primary">Exámenes de Lab.</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!appointment.labexams.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="labexam in appointment.labexams" :key="labexam.id">
              <ion-label class="ion-text-wrap">{{ parseDate(labexam.date) }} - {{ labexam.name }}</ion-label>

            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="labresults">
          <ion-item slot="header">
            <ion-icon :icon="thermometer" slot="start"></ion-icon>
            <ion-label color="primary">Resultados de Lab.</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!appointment.patient?.labresults?.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="labresult in appointment?.patient.labresults" :key="labresult.id">
              <ion-label class="ion-text-wrap">
                <span @click="openFile(labresult.file_path)">{{ parseDate(labresult.date) }}</span>
              </ion-label>
              <ion-button slot="end" fill="clear" @click="openFile(labresult.file_path)">
                <ion-icon :ios="documentOutline" slot="end" :md="documentSharp"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="diagnostics">
          <ion-item slot="header">
            <ion-icon :icon="create" slot="start"></ion-icon>
            <ion-label color="primary">Diagnóstico</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!appointment.diagnostics.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="diagnostic in appointment.diagnostics" :key="diagnostic.id">
              <ion-label class="ion-text-wrap">{{ diagnostic.name }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="treatments">
          <ion-item slot="header">
            <ion-icon :icon="medkit" slot="start"></ion-icon>
            <ion-label color="primary">Tratamiento</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!appointment.treatments.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="treatment in appointment.treatments" :key="treatment.id">
              <ion-label class="ion-text-wrap">{{ treatment.name }}: {{ treatment.comments }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonAccordion,
  IonAccordionGroup,
  IonList,
  IonIcon,
  IonButton
} from "@ionic/vue";
import {
  thermometer,
  document,
  accessibility,
  create,
  medkit,
  home,
  documentOutline,
  documentSharp
} from "ionicons/icons";
import { computed } from "vue";
import useUtilities from "@/composables/useUtilities";
import useAppointments from "../composables/useAppointments";

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const { parseDate, parseTime12, openFile } = useUtilities();
const { getAppointmentPDF, isLoading } = useAppointments();

const appointmentDate = computed(() => {
  return parseDate(props.appointment.date);
});
const hours = computed(() => {
  return parseTime12(props.appointment.start);
});

const patient = computed(() => {
  return props.appointment.patient?.first_name;
});

async function onSummary() {

  const dataUri = await getAppointmentPDF(props.appointment.id);
  openFile(dataUri);

}

</script>
<style scoped>
.download-btn {
  position: relative;
  z-index: 10;
}
</style>