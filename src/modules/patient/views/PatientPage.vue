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
        <form action="#" @submit.prevent="onSave()" novalidate>
          <ion-grid>
            <ion-row class="ion-justify-content-center" color="primary">
              <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                <div class="">
                  <ion-item>
                    <ion-label>
                      <ion-select label="Tipo identificación" labelPlacement="floating" v-model="form.tipo_identificacion" :class="{ 'ion-invalid ion-touched': errors?.tipo_identificacion }" :errorText="errors?.tipo_identificacion">
                        <ion-select-option value="01">Cédula Física</ion-select-option>
                        <ion-select-option value="02">Cédula Jurídica</ion-select-option>
                        <ion-select-option value="03">DIMEX</ion-select-option>

                      </ion-select>
                      <ion-note color="danger" v-if="errors.tipo_identificacion">{{ errors.tipo_identificacion[0] }}</ion-note>
                    </ion-label>

                  </ion-item>
                  <ion-item>
                    <ion-input label="Identificación" labelPlacement="floating" type="number" v-model="form.ide" @change="searchPerson" :class="{ 'ion-invalid ion-touched': errors?.ide }" :errorText="errors?.ide"></ion-input>

                  </ion-item>
                  <ion-item>
                    <ion-input label="Nombre completo" labelPlacement="floating" type="text" v-model="form.first_name" :class="{ 'ion-invalid ion-touched': errors?.first_name }" :errorText="errors?.first_name"></ion-input>

                  </ion-item>
                  <ion-item :button="true" id="open-birthdate-input">
                    <ion-input label="Fecha de nacimiento" labelPlacement="floating" :value="parseDate(form.birth_date)" :class="{ 'ion-invalid ion-touched': errors?.birth_date }" :errorText="errors?.birth_date" />
                    <ion-popover trigger="open-birthdate-input" :show-backdrop="true" alignment="center" class="popover-period">
                      <ion-content>
                        <ion-datetime v-model="form.birth_date" presentation="date" />
                      </ion-content>
                    </ion-popover>

                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <ion-select label="Género" labelPlacement="floating" v-model="form.gender" :class="{ 'ion-invalid ion-touched': errors?.gender }" :errorText="errors?.gender">
                        <ion-select-option value="f">Femenino</ion-select-option>
                        <ion-select-option value="m">Másculino</ion-select-option>
                        <ion-select-option value="o">Otro</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.gender">{{
                        errors.gender[0]
                      }}</ion-note>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-input label="Teléfono" labelPlacement="floating" type="number" v-model="form.phone_number" :class="{ 'ion-invalid ion-touched': errors?.phone_number }" :errorText="errors?.phone_number"></ion-input>

                  </ion-item>
                  <ion-item>
                    <ion-input label="Correo (Opcional)" labelPlacement="floating" type="email" v-model="form.email" :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email"></ion-input>

                  </ion-item>
                  <!-- <ion-item>
                    <ion-input
                      label="Dirección" labelPlacement="floating"
                      type="text"
                      v-model="form.address"
                      required
                    ></ion-input>
                    <ion-note color="danger" v-if="errors.address">{{
                      errors.address[0]
                    }}</ion-note>
                  </ion-item> -->
                  <ion-item>
                    <ion-label>
                      <ion-select label="Provincia" labelPlacement="floating" v-model="form.province" @ionChange="onChangeProvince($event)" :class="{ 'ion-invalid ion-touched': errors?.province }" :errorText="errors?.province">
                        <ion-select-option value=""></ion-select-option>
                        <ion-select-option :value="province.id" v-for="province in provincias" :key="province.id">
                          {{ province.title }}</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.province">{{
                        errors.province[0]
                      }}</ion-note>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <ion-select label="Cantón" labelPlacement="floating" v-model="form.canton" @ionChange="onChangeCanton($event)" :class="{ 'ion-invalid ion-touched': errors?.canton }" :errorText="errors?.canton">
                        <ion-select-option value=""></ion-select-option>
                        <ion-select-option :value="canton.title" v-for="canton in cantones" :key="canton.id">
                          {{ canton.title }}</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.canton">{{
                        errors.canton[0]
                      }}</ion-note>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <ion-select label="Distrito" labelPlacement="floating" v-model="form.district" required :class="{ 'ion-invalid ion-touched': errors?.district }" :errorText="errors?.district">
                        <ion-select-option value=""></ion-select-option>
                        <ion-select-option :value="district.title" v-for="district in distritos" :key="district.id">
                          {{ district.title }}</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.district">{{
                        errors.district[0]
                      }}</ion-note>
                    </ion-label>
                  </ion-item>
                  <!-- <ion-item>
                    <ion-input
                      label="Ciudad" labelPlacement="floating"
                      type="text"
                      v-model="form.city"
                      required
                    ></ion-input>
                    <ion-note color="danger" v-if="errors.city">{{
                      errors.city[0]
                    }}</ion-note>
                  </ion-item> -->
                  <ion-item>
                    <ion-select label="Padecimientos (Opcional)" labelPlacement="floating" v-model="form.conditions" multiple :class="{ 'ion-invalid ion-touched': errors?.conditions }" :errorText="errors?.conditions">
                      <ion-select-option :value="value" v-for="value in conditions" :key="value">{{ value }}</ion-select-option>
                    </ion-select>
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
  IonLabel,
  IonTitle,
  IonToolbar,
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
  SelectCustomEvent,
  alertController,
} from "@ionic/vue";

import { onMounted, ref } from "vue";
import usePatients from "@/modules/patient/composables/usePatients";
import { useRoute, useRouter } from "vue-router";
import useUtilities from "@/composables/useUtilities";
import useUi from "@/composables/useUi";
import useProvinces from "@/composables/useProvinces";
import useAuth from "@/modules/auth/composables/useAuth";

const { provincias, cantones, distritos, loadCantones, loadDistricts } =
  useProvinces();
const {
  getPatient,
  getPatientByIde,
  conditions,
  getConditions,
  createPatient,
  updatePatient,
  requestPatientAuthorization,
  checkPatientAuthorization,
  isLoading,
  errors,
} = usePatients();
const { parseDate, getCedulaInformation } = useUtilities();
const { toastMessage, alertMessage } = useUi();
const { checkAuthentication } = useAuth();
const route = useRoute();
const router = useRouter();
const { id } = route.params;
const form = ref<any>({});
const isLoadingPatient = ref(false);
//const debounceTimeout = ref();
const searchPerson = async () => {

  const { ok, patient, belongsToMe } = await getPatientByIde(form.value.ide);

  if (!ok || !patient) {
    searchHacienda();
    return;
  }

  if (id !== 'new') {
    return;
  }

  if (belongsToMe) {
    alertMessage('Paciente Encontrado', 'El paciente que intentas crear ya existe en la plataforma y es parte de tus pacientes');
    return;
  }

  // alertMessage('Paciente Encontrado', 'El paciente que intentas crear ya existe en la plataforma. ¿Deseas agregarlo a tu cuenta? ingresa el código de confirmación');
  const alert = await alertController.create({
    header: "Paciente Encontrado",
    message: 'El paciente que intentas crear ya existe en la plataforma. ¿Deseas agregarlo a tu cuenta? Solicita el código de confirmación',
    backdropDismiss: false,
    buttons: [
      {
        cssClass: "secondary",
        text: "Solicitar",
        role: "confirm",
        async handler() {
          const { ok } = await requestPatientAuthorization(patient);
          if (ok) {
            presentAuthorizationCodeAlert(patient);
          }
        },
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
    ],

  });

  await alert.present();

}
async function presentAuthorizationCodeAlert(patient: any) {
  const hideNumber = patient.phone_number?.slice(-4);
  const alert = await alertController.create({
    header: "Código de autorización",
    message: 'Se ha enviado un código de autorización al número de teléfono del paciente terminado en ' + hideNumber,
    backdropDismiss: false,
    buttons: [
      {
        cssClass: "secondary",
        text: "Confirmar",
        role: "confirm",
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
    ],
    inputs: [
      {
        placeholder: "Código",
      },
    ],
  });

  await alert.present();

  const { role, data } = await alert.onDidDismiss();

  if (role !== "confirm") return;

  const { ok, message } = await checkPatientAuthorization(patient.id, data.values[0]);

  if (!ok) {
    const { role } = await alertMessage(
      "Error",
      message,
      "Reintentar",
      null,
      true
    );

    if (role !== "confirm") {
      return;
    }

    await presentAuthorizationCodeAlert(patient);
  } else {

    toastMessage("Guardado correctamente");
    router.back();
  }
}

async function searchHacienda() {
  const { nombre, tipoIdentificacion } = await getCedulaInformation(form.value.ide)

  form.value.first_name = nombre;
  form.value.tipo_identificacion = tipoIdentificacion;
}
const loadPatient = async () => {
  await getConditions();
  if (id === "new") {
    form.value = {
      tipo_identificacion: "01",
      ide: "",
      first_name: "",
      birth_date: null,
      gender: "",
      phone_country_code: "+506",
      phone_number: "",
      email: "",
      address: "",
      province: "",
      canton: "",
      district: "",
      city: "",
      conditions: "",
    };
  } else {
    isLoadingPatient.value = true;
    form.value = await getPatient(parseInt(id.toString()));
    form.value.birth_date = parseDate(form.value.birth_date) || null;
    loadCantones(form.value.province);
    loadDistricts(form.value.canton, 'title');

  }
};

const onChangeProvince = (evt: SelectCustomEvent) => {
  if (!isLoadingPatient.value) {
    form.value.canton = "";
    form.value.district = "";
  }


  loadCantones(evt.detail.value);
};
const onChangeCanton = (evt: SelectCustomEvent) => {
  if (!isLoadingPatient.value) {
    form.value.district = "";
  }

  loadDistricts(evt.detail.value, 'title');
};


const onSave = async () => {
  form.value.birth_date = parseDate(form.value.birth_date);
  if (form.value.id) {
    const { ok, message } = await updatePatient(form.value);
    if (!ok) alertMessage("Error", message);
    else {
      toastMessage("Guardado correctamente");
      checkAuthentication(true);
      router.back();
    }
  } else {
    const { ok, message } = await createPatient(form.value);
    if (!ok) alertMessage("Error", message);
    else router.back();
  }
};

onMounted(async () => {
  await loadPatient();
  isLoadingPatient.value = false;
});


</script>
