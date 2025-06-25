<template>
  <ion-card>
    <ion-card-header color="light">
      <ion-card-subtitle>{{ appointmentDate }} - {{ hours }}</ion-card-subtitle>
      <ion-card-title>{{ patient }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-accordion-group>
        <ion-accordion value="evaluations">
          <ion-item slot="header">
            <ion-icon :md="thermometerSharp" :ios="thermometerOutline" slot="start"></ion-icon>
            <ion-label color="primary">Evaluacion Física</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!evaluations.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="eva in evaluations" :key="eva.id">
              <ion-label class="ion-text-wrap">{{ eva.name }}
                <p v-if="eva.zone">{{ eva.zone }}</p>
              </ion-label>
            </ion-item>
            <ion-item v-for="enote in evaluationsNotes" :key="enote.id">
              <ion-label class="ion-text-wrap">{{ enote.notes }} </ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="treatment">
          <ion-item slot="header">
            <ion-icon :md="documentSharp" :ios="documentOutline" slot="start"></ion-icon>
            <ion-label color="primary">Tratamiento</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!treatments.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="trea in treatments" :key="trea.id">
              <ion-label class="ion-text-wrap">{{ trea.name }} </ion-label>
            </ion-item>
            <ion-item v-for="tnote in treatmentsNotes" :key="tnote.id">
              <ion-label class="ion-text-wrap">{{ tnote.notes }} </ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="recomendations">
          <ion-item slot="header">
            <ion-icon :md="createSharp" :ios="createOutline" slot="start"></ion-icon>
            <ion-label color="primary">Recomendaciones</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!recomendations.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-item v-for="reco in recomendations" :key="reco.id">
              <ion-label class="ion-text-wrap">{{ reco.name }} </ion-label>
            </ion-item>
            <ion-item v-for="rnote in recomendationsNotes" :key="rnote.id">
              <ion-label class="ion-text-wrap">{{ rnote.notes }} </ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="anth" v-if="anthropometry.id">
          <ion-item slot="header">
            <ion-icon :md="accessibilitySharp" :ios="accessibilityOutline" slot="start"></ion-icon>
            <ion-label color="primary">Antropometria</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item v-if="anthropometry.items.height && anthropometry.items.height.length
              ">
              <ion-label class="ion-text-wrap">Alura:
                <span v-for="(item, index) in anthropometry.items.height" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.weight && anthropometry.items.weight.length
              ">
              <ion-label class="ion-text-wrap">Peso:
                <span v-for="(item, index) in anthropometry.items.weight" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.mass && anthropometry.items.mass.length">
              <ion-label class="ion-text-wrap">IMC:
                <span v-for="(item, index) in anthropometry.items.mass" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.pa && anthropometry.items.pa.length">
              <ion-label class="ion-text-wrap">P.A:
                <span v-for="(item, index) in anthropometry.items.pa" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.abdomen_alto &&
              anthropometry.items.abdomen_alto.length
              ">
              <ion-label class="ion-text-wrap">Abdomen Alto:
                <span v-for="(item, index) in anthropometry.items.abdomen_alto" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.ombligo &&
              anthropometry.items.ombligo.length
              ">
              <ion-label class="ion-text-wrap">Ombligo:
                <span v-for="(item, index) in anthropometry.items.ombligo" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.abdomen_bajo &&
              anthropometry.items.abdomen_bajo.length
              ">
              <ion-label class="ion-text-wrap">Abdomen Bajo:
                <span v-for="(item, index) in anthropometry.items.abdomen_bajo" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.abdomen_bajo_bajo &&
              anthropometry.items.abdomen_bajo_bajo.length
              ">
              <ion-label class="ion-text-wrap">Abdomen Bajo Bajo:
                <span v-for="(item, index) in anthropometry.items.abdomen_bajo_bajo" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.piernas_alta &&
              anthropometry.items.piernas_alta.length
              ">
              <ion-label class="ion-text-wrap">Piernas Altas:
                <span v-for="(item, index) in anthropometry.items.piernas_alta" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.piernas_baja &&
              anthropometry.items.piernas_baja.length
              ">
              <ion-label class="ion-text-wrap">Piernas Bajas:
                <span v-for="(item, index) in anthropometry.items.piernas_baja" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.brazos_alto &&
              anthropometry.items.brazos_alto.length
              ">
              <ion-label class="ion-text-wrap">Brazos Alto:
                <span v-for="(item, index) in anthropometry.items.brazos_alto" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.brazos_medio &&
              anthropometry.items.brazos_medio.length
              ">
              <ion-label class="ion-text-wrap">Brazos Medio:
                <span v-for="(item, index) in anthropometry.items.brazos_medio" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
            <ion-item v-if="anthropometry.items.brazos_bajo &&
              anthropometry.items.brazos_bajo.length
              ">
              <ion-label class="ion-text-wrap">Brazos Bajo:
                <span v-for="(item, index) in anthropometry.items.brazos_bajo" :key="index"><span v-if="item.value" class="margin">S{{ index + 1 }}: {{ item.value }}</span></span>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="documentations">
          <ion-item slot="header">
            <ion-icon :md="analyticsSharp" :ios="analyticsOutline" slot="start"></ion-icon>
            <ion-label color="primary">Avance (fotográfico)</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item lines="none" v-if="!documentations.length" class="ion-text-center">
              <ion-label>No hay elementos que mostrar</ion-label>
            </ion-item>
            <ion-card v-for="doc in documentations" :key="doc.id">
              <img :src="doc.file_path" class="doc-img" />
              <ion-card-header>
                <ion-card-subtitle>{{ doc.date }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
            <!-- <ion-item v-for="doc in documentations" :key="doc.id">
              <ion-label class="ion-text-wrap">{{ doc.date }} </ion-label>
            </ion-item> -->
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
} from "@ionic/vue";
import {
  thermometerSharp,
  thermometerOutline,
  documentSharp,
  documentOutline,
  accessibilitySharp,
  accessibilityOutline,
  createSharp,
  createOutline,
  analyticsSharp,
  analyticsOutline,
} from "ionicons/icons";

import { computed, onMounted, ref } from "vue";
import useUtilities from "@/composables/useUtilities";
import usePatients from "@/modules/patient/composables/usePatients";

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const { parseDate, parseTime12 } = useUtilities();
const { getAnthropometry, getDocumentations } = usePatients();
const anthropometry = ref<any>({});
const documentations = ref<any>([]);

const appointmentDate = computed(() => {
  return parseDate(props.appointment.date);
});
const hours = computed(() => {
  return parseTime12(props.appointment.start);
});
const patient = computed(() => {
  return props.appointment.patient?.first_name;
});

const evaluations = computed(() => {
  return props.appointment.evaluations.filter(
    (ev: any) => ev.name != "note"
  );
});
const evaluationsNotes = computed(() => {
  return props.appointment.evaluations.filter(
    (ev: any) => ev.name == "note"
  );
});

const treatments = computed(() => {
  return props.appointment.estreatments.filter(
    (ev: any) => ev.name != "note"
  );
});
const treatmentsNotes = computed(() => {
  return props.appointment.estreatments.filter(
    (ev: any) => ev.name == "note"
  );
});

const recomendations = computed(() => {
  return props.appointment.recomendations.filter(
    (ev: any) => ev.name != "note"
  );
});
const recomendationsNotes = computed(() => {
  return props.appointment.recomendations.filter(
    (ev: any) => ev.name == "note"
  );
});

onMounted(async () => {
  anthropometry.value = await getAnthropometry(
    props.appointment.patient_id
  );
  documentations.value = await getDocumentations(
    props.appointment.patient_id
  );
});


</script>
<style scoped>
.margin {
  margin-left: 5px;
  margin-right: 5px;
  font-weight: bold;
}

.doc-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}
</style>
