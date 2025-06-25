<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Paciente </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="form">
        <form action="#" @submit.prevent="onSave()" noValidate>
          <ion-grid>
            <ion-row class="ion-justify-content-center" color="primary">
              <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                <div class="">
                  <ion-item>
                    <ion-label position="stacked">
                      Tipo identificación
                    </ion-label>
                    <ion-select v-model="form.tipo_identificacion">
                      <ion-select-option value="01">Cédula Física</ion-select-option>
                      <ion-select-option value="02">Cédula Jurídica</ion-select-option>
                      <ion-select-option value="03">DIMEX</ion-select-option>
                      <ion-select-option value="00">No definido</ion-select-option>
                    </ion-select>
                    <ion-note color="danger" v-if="errors.tipo_identificacion">{{ errors.tipo_identificacion[0] }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Identificación</ion-label>
                    <ion-input :type="form.tipo_identificacion == '00' ? 'text' : 'number'" v-model="form.ide" required></ion-input>
                    <ion-note color="danger" v-if="errors.ide">{{
                      errors.ide[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Nombre completo</ion-label>
                    <ion-input type="text" v-model="form.first_name" required></ion-input>
                    <ion-note color="danger" v-if="errors.first_name">{{
                      errors.first_name[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item :button="true" id="open-birthdate-input">
                    <ion-label position="stacked">Fecha de nacimiento</ion-label>
                    <ion-input :value="parseDate(form.birth_date)" />
                    <ion-popover trigger="open-birthdate-input" :show-backdrop="true" alignment="center" class="popover-period">
                      <ion-content>
                        <ion-datetime v-model="form.birth_date" presentation="date" />
                      </ion-content>
                    </ion-popover>
                    <ion-note color="danger" v-if="errors.birth_date">{{
                      errors.birth_date[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Género</ion-label>
                    <ion-select v-model="form.gender">
                      <ion-select-option value="f">Femenino</ion-select-option>
                      <ion-select-option value="m">Másculino</ion-select-option>
                      <ion-select-option value="o">Otro</ion-select-option>
                    </ion-select>
                    <ion-note color="danger" v-if="errors.gender">{{
                      errors.gender[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Teléfono</ion-label>
                    <ion-input type="number" v-model="form.phone_number"></ion-input>
                    <ion-note color="danger" v-if="errors.phone_number">{{
                      errors.phone_number[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Correo</ion-label>
                    <ion-input type="email" v-model="form.email" required></ion-input>
                    <ion-note color="danger" v-if="errors.email">{{
                      errors.email[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Dirección</ion-label>
                    <ion-input type="text" v-model="form.address" required></ion-input>
                    <ion-note color="danger" v-if="errors.address">{{
                      errors.address[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Provincia</ion-label>
                    <ion-select v-model="form.province">
                      <ion-select-option value="5">Guanacaste</ion-select-option>
                      <ion-select-option value="1">San Jose</ion-select-option>
                      <ion-select-option value="4">Heredia</ion-select-option>
                      <ion-select-option value="7">Limon</ion-select-option>
                      <ion-select-option value="3">Cartago</ion-select-option>
                      <ion-select-option value="6">Puntarenas</ion-select-option>
                      <ion-select-option value="2">Alajuela</ion-select-option>
                    </ion-select>
                    <ion-note color="danger" v-if="errors.province">{{
                      errors.province[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Ciudad</ion-label>
                    <ion-input type="text" v-model="form.city" required></ion-input>
                    <ion-note color="danger" v-if="errors.city">{{
                      errors.city[0]
                    }}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Padecimientos</ion-label>
                    <ion-select v-model="form.conditions" multiple>
                      <ion-select-option :value="value" v-for="value in conditions" :key="value">{{ value }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>
                <div class="ion-padding">
                  <ion-button type="submit" expand="block" :disabled="isLoading">
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
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  IonPopover,
  IonNote,
} from "@ionic/vue";

import { onMounted, ref } from "vue";
import usePatients from "@/modules/medic/composables/usePatients";
import { useRoute, useRouter } from "vue-router";
import useUtilities from "@/composables/useUtilities";
import useUi from "@/composables/useUi";

const {
  getPatient,
  conditions,
  getConditions,
  createPatient,
  updatePatient,
  isLoading,
  errors,
} = usePatients();
const { parseDate } = useUtilities();
const { toastMessage, alertMessage } = useUi();
const route = useRoute();
const router = useRouter();
const { id } = route.params;
const form = ref<any>({});
//const debounceTimeout = ref();

const loadPatient = async () => {
  await getConditions();

  if (id === "new") {
    form.value = {
      tipo_identificacion: "01",
      ide: "",
      first_name: "",
      birth_date: "",
      gender: "",
      phone_country_code: "+506",
      phone_number: "",
      email: "",
      address: "",
      province: "",
      city: "",
      conditions: "",
    };
  } else {
    form.value = await getPatient(parseInt(id.toString()));
    form.value.birth_date = parseDate(form.value.birth_date);
  }
};

const onSave = async () => {
  if (form.value.id) {
    const { ok, message } = await updatePatient(form.value);
    if (!ok) alertMessage("Error", message);
    else {
      toastMessage("Guardado correctamente");
      router.back();
    }
  } else {
    const { ok, message } = await createPatient(form.value);
    if (!ok) alertMessage("Error", message);
    else router.back();
  }
};

onMounted(async () => {
  loadPatient();
});


</script>
