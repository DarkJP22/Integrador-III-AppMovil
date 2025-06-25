<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Subir Resultado </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="form">
        <form action="#" @submit.prevent="onSave()" noValidate>
          <ion-grid>
            <ion-row class="ion-justify-content-center" color="primary">
              <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                <div class="">


                  <ion-item :button="true" id="open-date-input">
                    <ion-input label="Fecha" labelPlacement="floating" :value="parseDate(form.date)" />
                    <ion-popover trigger="open-date-input" :show-backdrop="true" alignment="center" class="popover-period">
                      <ion-content>
                        <ion-datetime v-model="form.date" presentation="date" />
                      </ion-content>
                    </ion-popover>
                    <ion-note color="danger" v-if="errors.date">{{
                      errors.date[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-input label="Descripción" labelPlacement="floating" type="text" v-model="form.description"></ion-input>
                    <ion-note color="danger" v-if="errors.description">{{
                      errors.description[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Archivo</ion-label>
                    <input type="file" ref="fileInput" @change="onChangeFileUpload" class="hidden" accept="image/*,.pdf,.xml,.doc,.docx,.xls,.xlsx" />
                    <ion-button type="button" color="light" expand="full" @click="fileInput?.click()">
                      Subir Archivo
                    </ion-button>
                    <ul class="files-ul">
                      <li v-for="(file, index) in files" :key="index">
                        {{ file.name }}
                      </li>

                    </ul>
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
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonButton,
  IonDatetime,
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  IonPopover,
  IonNote,
} from "@ionic/vue";

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUtilities from "@/composables/useUtilities";
import useUi from "@/composables/useUi";
import useLabresults from "../composables/useLabresults";

const {
  createLabresult,
  isLoading,
  errors
} = useLabresults();
const { parseDate } = useUtilities();
const { alertMessage } = useUi();
const route = useRoute();
const router = useRouter();
const { patientId, id } = route.params;
const form = ref<any>({});
const fileInput = ref<HTMLInputElement>();
const files = ref<any>([]);
//const debounceTimeout = ref();

const loadLabresult = async () => {


  if (id === "new") {
    form.value = {
      patient_id: patientId,
      date: null,
      description: "",
    };
  } else {
    // form.value = await getLabresult(parseInt(id.toString()));
    // form.value.date = parseDate(form.value.date);
  }
};

const onSave = async () => {

  const { ok, message } = await createLabresult(form.value, files.value);
  if (!ok) alertMessage("Error", message);
  else router.back();

};

const onChangeFileUpload = () => {
  
  if (fileInput.value?.files) {
    files.value = Array.from(fileInput.value.files);
  }
};

onMounted(async () => {
  loadLabresult();
});

</script>
