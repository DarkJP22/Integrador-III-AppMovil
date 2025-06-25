<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Glicemia</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="setOpen(true)"><ion-icon :md="addCircleSharp" :ios="addCircleOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="chart-wrapper ion-padding" v-show="glicemias.length">
        <canvas ref="chartElement"></canvas>
      </div>
      <div class="ion-text-center">
        <ion-button color="primary" fill="outline" size="small" shape="round" @click="setOpen(true)">
          Agregar Glicemia
        </ion-button>
      </div>
      <ion-list class="ion-padding">
        <ion-item lines="none" v-if="!glicemias.length && !isLoading" class="ion-text-center">
          <ion-label>No hay mediciones registradas</ion-label>
        </ion-item>

        <ion-item v-for="item in glicemias" :key="item.id" lines="full">
          <ion-label>
            <h2>Glicemia: {{ item.glicemia }} </h2>
            <p>Condición: {{ item.condition }}</p>
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
            <ion-title>Glicemia</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form action="#" @submit.prevent="onSave()" noValidate>
            <ion-grid>
              <ion-row class="ion-justify-content-center" color="primary">
                <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                  <div class="">
                    <ion-item :button="true" id="open-date-input">
                      <ion-input label="Fecha de registro" labelPlacement="floating" :value="parseDate(form.date_control)" />
                      <ion-popover trigger="open-date-input" :show-backdrop="true" alignment="center" class="popover-date">
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
                      <ion-popover trigger="open-time-input" :show-backdrop="true" alignment="center" class="popover-time">
                        <ion-content>
                          <ion-datetime v-model="form.time_control" presentation="time" />
                        </ion-content>
                      </ion-popover>
                      <ion-note color="danger" v-if="errors.time_control">{{
                        errors.time_control[0]
                      }}</ion-note>
                    </ion-item>

                    <ion-item>
                      <ion-input label="Glicemia" labelPlacement="floating" type="text" v-model="form.glicemia"></ion-input>
                      <ion-note color="danger" v-if="errors.glicemia">{{
                        errors.glicemia[0]
                      }}</ion-note>
                    </ion-item>

                    <ion-item>
                      <ion-select label="Condición de la muestra" labelPlacement="floating" v-model="form.condition">
                        <ion-select-option value="En Ayunas">En Ayunas</ion-select-option>
                        <ion-select-option value="Al Azar">Al Azar</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.condition">{{
                        errors.condition[0]
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
import useGlicemias from "../composables/useGlicemias";

const route = useRoute();
const { id } = route.params;
const { glicemias, createGlicemia, onConfirmDelete, isLoading, errors } =
  useGlicemias(parseInt(id.toString()));
const { parseDate, parseTime12, parseIsoDatetime } = useUtilities();
const { alertMessage } = useUi();

const isOpenRef = ref(false);
const lineChart = ref<any>();
const chartElement = ref<HTMLCanvasElement>();

const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  form.value.date_control = parseDate(new Date().toISOString());
  form.value.time_control = parseIsoDatetime(new Date().toISOString());
  form.value.glicemia = "";
  form.value.condition = "";
};

const form = ref({
  date_control: "",
  time_control: "",
  glicemia: "",
  condition: "",
});

const loadGrafico = () => {
  if (!chartElement.value) return;

 

  const labels: string[] = [];
  const data: number[] = [];

  glicemias.value.forEach((element: any, index: number) => {
 
    if (index < 5) {
      labels.unshift(parseDate(element.date_control));
      data.unshift(element.glicemia);
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
          label: "Glicemia",
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
          data: data,
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
  const { ok, message } = await createGlicemia(form.value);
  if (!ok) alertMessage("Error", message);
  else setOpen(false);
};

watch(glicemias, () => {
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
