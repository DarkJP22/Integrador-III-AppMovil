<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Consultorio / Clínica </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ClinicOffice v-if="!isLoading && form && form.type == 2" :office="form" />
      <div v-else-if="form && form.type == 1">
        <form action="#" @submit.prevent="onSave()" novalidate>
          <ion-grid>
            <ion-row class="ion-justify-content-center" color="primary">
              <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                <div class="">
                  <ion-item>
                    <ion-input label="Nombre del consultorio" labelPlacement="floating" type="text" v-model="form.name" required :class="{ 'ion-invalid ion-touched': errors?.name }" :errorText="errors?.name"></ion-input>
                  </ion-item>

                  <ion-item >
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
                  <ion-item >
                    <ion-label>
                      <ion-select label="Cantón" labelPlacement="floating" v-model="form.canton" @ionChange="onChangeCanton($event)" :class="{ 'ion-invalid ion-touched': errors?.canton }" :errorText="errors?.canton">
                        <ion-select-option value=""></ion-select-option>
                        <ion-select-option :value="canton.id" v-for="canton in cantones" :key="canton.id">
                          {{ canton.title }}</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.canton">{{
                        errors.canton[0]
                      }}</ion-note>
                    </ion-label>
                  </ion-item>
                  <ion-item >
                    <ion-label>
                      <ion-select label="Distrito" labelPlacement="floating" v-model="form.district" :class="{ 'ion-invalid ion-touched': errors?.district }" :errorText="errors?.district">
                        <ion-select-option value=""></ion-select-option>
                        <ion-select-option :value="district.id" v-for="district in distritos" :key="district.id">
                          {{ district.title }}</ion-select-option>
                      </ion-select>
                      <ion-note color="danger" v-if="errors.district">{{
                        errors.district[0]
                      }}</ion-note>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-input label="Dirección" labelPlacement="floating" type="text" v-model="form.address" :class="{ 'ion-invalid ion-touched': errors?.address }" :errorText="errors?.address"></ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-input label="Teléfono" labelPlacement="floating" type="number" v-model="form.phone" :class="{ 'ion-invalid ion-touched': errors?.phone }" :errorText="errors?.phone"></ion-input>
                    
                  </ion-item>
                  <ion-item>
                    <ion-input label="Whatsapp (Solicitud de citas)" labelPlacement="floating" type="number" v-model="form.whatsapp_number" :class="{ 'ion-invalid ion-touched': errors?.whatsapp_number }" :errorText="errors?.whatsapp_number"></ion-input>
                
                  </ion-item>
                  <ion-item lines="full" color="light">
                    <ion-label> Coordenadas </ion-label>

                    <div class="get-location-btn-wrapper">
                      <ion-button slot="end" color="secondary" @click="getUserLocation"><ion-icon slot="start" :md="locateSharp" :ios="locateOutline"></ion-icon>
                        Cerca de aquí
                      </ion-button>
                    </div>
                  </ion-item>
                  <ion-grid>
                    <ion-row class="ion-justify-content-center" color="primary">
                      <ion-col class="ion-align-self-center" size-sm="6" size-xs="6">
                        <ion-item>
                          <ion-input label="Lat" labelPlacement="floating" type="text" v-model="form.lat" :class="{ 'ion-invalid ion-touched': errors?.lat }" :errorText="errors?.lat"></ion-input>
                         
                        </ion-item>
                      </ion-col>
                      <ion-col class="ion-align-self-center" size-sm="6" size-xs="6">
                        <ion-item>
                          <ion-input label="Long" labelPlacement="floating" type="text" v-model="form.lon" :class="{ 'ion-invalid ion-touched': errors?.lon }" :errorText="errors?.lon"></ion-input>
                          
                        </ion-item>
                      </ion-col>
                    </ion-row></ion-grid>
                  <ion-item>
                    <ion-toggle value="1" v-model="form.utiliza_agenda_gps">
                      Utiliza Agenda Doctor Blue
                    </ion-toggle>

                  </ion-item>
                  <ion-note>Al seleccionar esta opcion usted utiliza la agenda de Doctor Blue para recibir citas</ion-note>
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
  IonSelect,
  IonSelectOption,
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  IonNote,
  SelectCustomEvent,
  IonIcon,
  IonToggle
} from "@ionic/vue";
import { locateSharp, locateOutline } from "ionicons/icons";
import ClinicOffice from "@/modules/medic/components/ClinicOffice.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//import useUtilities from "@/composables/useUtilities";
import useUi from "@/composables/useUi";
import useOffices from "../composables/useOffices";
import useProvinces from "@/composables/useProvinces";
import useMyGeolocation from "@/composables/useMyGeolocation";
import useAuth from "@/modules/auth/composables/useAuth";

const { provincias, cantones, distritos, loadCantones, loadDistricts } =
  useProvinces();
const { getOffice, createOffice, updateOffice, isLoading, errors } =
  useOffices();
const { coords, getUserLocation } = useMyGeolocation();
const { toastMessage, alertMessage } = useUi();
const { checkAuthentication } = useAuth();
const route = useRoute();
const router = useRouter();
const { id } = route.params;
const form = ref<any>({});

const loadOffice = async () => {
  if (id === "new") {
    form.value = {
      name: "",
      phone: "",
      whatsapp_number: "",
      address: "",
      province: "",
      canton: "",
      district: "",
      city: "",
      lat: "",
      lon: "",
      type: 1,
      utiliza_agenda_gps: 0
    };
  } else {
    form.value = await getOffice(parseInt(id.toString()));
    loadCantones(form.value.province);
    loadDistricts(form.value.canton);
  


  }
};

const onChangeProvince = (evt: SelectCustomEvent) => {

  form.value.canton = "";
  form.value.district = "";

  loadCantones(evt.detail.value);
};
const onChangeCanton = (evt: SelectCustomEvent) => {

  form.value.district = "";
  loadDistricts(evt.detail.value);
};

const onSave = async () => {
  if (form.value.id) {
    const { ok, message } = await updateOffice(form.value);
    if (!ok) alertMessage("Error", message);
    else {
      await checkAuthentication(true);
      toastMessage("Guardado correctamente");
      router.back();
    }
  } else {
    const { ok, message } = await createOffice(form.value);
    if (!ok) alertMessage("Error", message);
    else {
      await checkAuthentication(true);
      router.back();
    }
  }
};

watch(coords.value, () => {
  form.value.lat = coords.value.lat;
  form.value.lon = coords.value.lng;
});

onMounted(async () => {
  loadOffice();
});


</script>
