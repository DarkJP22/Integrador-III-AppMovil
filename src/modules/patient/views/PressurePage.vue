<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Presion arterial</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="setOpen(true)"><ion-icon :md="addCircleSharp" :ios="addCircleOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <div class="chart-wrapper ion-padding" v-show="pressures.length">
        <canvas ref="chartElement"></canvas>
      </div>
      <div class="ion-text-center">
        <ion-button color="primary" fill="outline" size="small" shape="round" @click="setOpen(true)">
          Agregar Presión
        </ion-button>
      </div>

      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!pressures.length && !isLoading" class="ion-text-center">
          <ion-label>No hay mediciones registradas</ion-label>
        </ion-item>

        <ion-item v-for="item in pressures" :key="item.id" lines="full">
          <ion-label>
            <h2>P.S: {{ item.ps }} / P.D: {{ item.pd }} / F.C: {{ item.heart_rate }}</h2>
            <h2 v-if="item.measurement_place">Lugar de la muestra: {{ item.measurement_place }}</h2>
            <p v-if="item.observations">{{ item.observations }}</p>
            <h3>{{ item.date_control }} {{ item.time_control }}</h3>
          </ion-label>
          <ion-button color="danger" slot="end" fill="clear" @click="onConfirmDelete(item)" :disabled="isLoading">
            <ion-icon :ios="trashOutline" :md="trashSharp"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="isOpenRef" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Presion arterial</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form action="#" @submit.prevent="onSave()" novalidate>
            <ion-grid>
              <ion-row class="ion-justify-content-center" color="primary">
                <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                  <div class="">
                    <ion-item :button="true" id="open-date-input">
                      <ion-input label="Fecha de registro" labelPlacement="floating" :value="parseDate(form.date_control)" />
                      <ion-popover trigger="open-date-input" :show-backdrop="true" alignment="center" size="cover" class="popover-date">
                        <ion-content>
                          <ion-datetime v-model="form.date_control" presentation="date" />
                        </ion-content>
                      </ion-popover>
                      <ion-note color="danger" v-if="errors.date_control">{{
                        errors.date_control[0]
                      }}</ion-note>
                    </ion-item>
                    <ion-item :button="true" id="open-time-input">
                      <ion-input label="Hora" labelPlacement="floating" :value="parseTime12(form.time_control)" />
                      <ion-popover trigger="open-time-input" :show-backdrop="true" alignment="center" size="cover" class="popover-time">
                        <ion-content>
                          <ion-datetime v-model="form.time_control" presentation="time" />
                        </ion-content>
                      </ion-popover>
                      <ion-note color="danger" v-if="errors.time_control">{{
                        errors.time_control[0]
                      }}</ion-note>
                    </ion-item>

                    <ion-item>
                      <ion-input label="Sistólica (P.S)" labelPlacement="floating" type="text" v-model="form.ps"></ion-input>
                      <ion-note color="danger" v-if="errors.ps">{{
                        errors.ps[0]
                      }}</ion-note>
                    </ion-item>
                    <ion-item>
                      <ion-input label="Diastólica (P.D)" labelPlacement="floating" type="text" v-model="form.pd"></ion-input>
                      <ion-note color="danger" v-if="errors.pd">{{
                        errors.pd[0]
                      }}</ion-note>
                    </ion-item>
                    <ion-item>
                      <ion-input label="Frecuencia Cardíaca (F.C)" labelPlacement="floating" type="text" v-model="form.heart_rate"></ion-input>
                      <ion-note color="danger" v-if="errors.heart_rate">{{
                        errors.heart_rate[0]
                      }}</ion-note>
                    </ion-item>
                    <ion-item>
                   
                      <ion-select label="Lugar de la muestra" labelPlacement="floating" v-model="form.measurement_place" :class="{ 'ion-invalid ion-touched': errors?.measurement_place }" :errorText="errors?.measurement_place">
                        <ion-select-option value="Brazo Izquierdo">Brazo Izquierdo</ion-select-option>
                        <ion-select-option value="Brazo Derecho">Brazo Derecho</ion-select-option>
                   
                      </ion-select>
                      <ion-note color="danger" v-if="errors.measurement_place">{{
                        errors.measurement_place[0]
                      }}</ion-note>
                    </ion-item>
                    <ion-item>
                      <ion-input label="Observaciones" labelPlacement="floating" type="text" v-model="form.observations"></ion-input>
                      <ion-note color="danger" v-if="errors.observations">{{
                        errors.observations[0]
                      }}</ion-note>
                    </ion-item>
                  </div>
                  <div class="ion-padding">
                    <ion-button type="submit" expand="block" shape="round" :disabled="isLoading">
                      Guardar
                    </ion-button>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </form>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useUi from "@/composables/useUi";
import useUtilities from "@/composables/useUtilities";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
  IonIcon,
  IonModal,
  IonPopover,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonNote,
  IonDatetime,
  IonSelect,
  IonSelectOption
} from "@ionic/vue";
import {
  addCircleSharp,
  addCircleOutline,
  trashSharp,
  trashOutline,
} from "ionicons/icons";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import usePressures from "../composables/usePressures";

const route = useRoute();
const { id } = route.params;
const { pressures, createPressure, onConfirmDelete, isLoading, errors } =
  usePressures(parseInt(id.toString()));

const { parseDate, parseTime12, parseIsoDatetime } = useUtilities();
const { alertMessage } = useUi();

const isOpenRef = ref(false);
const lineChart = ref<any>();
const chartElement = ref<HTMLCanvasElement>();

const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  form.value.date_control = parseDate(new Date().toISOString());
  form.value.time_control = parseIsoDatetime(new Date().toISOString());
  form.value.ps = "";
  form.value.pd = "";
  form.value.heart_rate = "";
  form.value.measurement_place = "";
  form.value.observations = "";
};

const form = ref({
  date_control: "",
  time_control: "",
  ps: "",
  pd: "",
  heart_rate: "",
  measurement_place: "",
  observations: "",
});

const loadGrafico = () => {
  if (!chartElement.value) return;


  const labels: string[] = [];
  const dataPS: number[] = [];
  const dataPD: number[] = [];

  pressures.value.forEach((element: any, index: number) => {

    if (index < 5) {
      labels.unshift(parseDate(element.date_control));
      dataPS.unshift(element.ps);
      dataPD.unshift(element.pd);
    }
  });

  if (lineChart.value) {
    lineChart.value.destroy();
  }

  lineChart.value = new Chart(chartElement.value, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "P.S",
          fill: false,
          tension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(0, 0, 0, 1)",
          pointBackgroundColor: "rgba(75,192,192,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataPS,
          spanGaps: false,
        },
        {
          label: "P.D",
          fill: false,
          tension: 0.1,
          backgroundColor: "rgba(255, 99, 132, 0.4)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(0,0,0,1)",
          pointBackgroundColor: "rgba(255, 99, 132, 1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataPD,
          spanGaps: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 25,
          },
        },
      },
    },
  });
};

const onSave = async () => {
  const { ok, message } = await createPressure(form.value);
  if (!ok) alertMessage("Error", message);
  else setOpen(false);
};

watch(pressures, () => {
  loadGrafico();
});


</script>
<style scoped>
.logo {
  max-width: 8rem;
}

.chart-wrapper {
  margin-top: 1rem;
}
</style>
