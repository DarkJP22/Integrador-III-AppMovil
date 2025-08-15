<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Registro Profesional</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form action="#" @submit.prevent="onRegister()">
        <ion-grid>
          <ion-row class="ion-justify-content-center" color="primary">
            <ion-col class="ion-align-self-center" size-md="6" size-lg="5" size-xs="12">
              <div class="ion-text-center">
                <!-- <img src="../assets/logo2.svg" alt="Senex Logo" /> -->
              </div>
              <div class="ion-padding">
                <div class="bg-white dark:bg-transparent">
                  <div class="container px-0 pb-4 mx-auto">


                    <h1 class="mt-4 text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl dark:text-white"> Escoge tu plan</h1>


                    <div class="mt-6 space-y-4 xl:mt-12">

                      <div v-for="plan in plans" :key="plan.id" :class="{ '!border-teal-500': selected === plan.id }" class="flex items-center justify-between max-w-2xl px-2 py-6 mx-auto border-solid border text-gray-300 cursor-pointer rounded-xl dark:border-gray-800" @click="selected = plan.id">
                        <div class="flex items-center">
                          <svg :class="{ '!text-teal-600': selected === plan.id }" class="w-5 h-5 text-gray-400 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill-rule="evenodd" />
                          </svg>

                          <div class="flex flex-col items-start mx-2 space-y-2">
                            <h2 :class="{ 'text-teal-600': selected === plan.id }" class="my-0 text-sm font-medium text-gray-700 sm:text-2xl dark:text-gray-200">{{ plan.title }}</h2>
                            <div v-if="selected === plan.id && plan.commission_by_appointment" class="px-1 text-xs text-gray-700">
                              (Visible para recibir citas)
                            </div>

                          </div>
                        </div>
                        <div class="flex flex-col space-y-2 text-center">

                          <h2 v-if="selected === plan.id && plan.commission_by_appointment" :class="{ '!text-teal-600': selected === plan.id }" class="px-1 text-xs text-teal-600 bg-teal-100 rounded-full sm:px-4 sm:py-1">Uso de plataforma <span class="text-sm font-bold ">Gratis 1<sup>er</sup> Año</span> Despues
                            <BaseFormatMoney :amount="plan.cost" /> <span class="text-sm font-medium">/Mes</span>
                          </h2>
                          <!-- <div :class="{ '!text-teal-600': selected === plan.id }" class="px-1 text-xs text-teal-600 bg-teal-100 rounded-full sm:px-4 sm:py-1">Despues <BaseFormatMoney :amount="plan.cost" /> <span class="text-sm font-medium">/Mes</span></div> -->
                          <!-- <div v-if="selected === plan.id" class="px-1 text-xs text-teal-600 bg-teal-100 rounded-full sm:px-4 sm:py-1 ">
                            Uso de plataforma
                          </div> -->
                          <h2 v-if="selected === plan.id && plan.commission_by_appointment" class="px-1 text-xs font-bold text-gray-700  dark:text-white  rounded-full sm:px-4 sm:py-1">+ Comisión por cita:</h2>
                          <div v-if="selected === plan.id && plan.commission_by_appointment" class="px-1 text-xs text-teal-600 bg-teal-100 rounded-full sm:px-4 sm:py-1 ">
                            Medico General:
                            <BaseFormatMoney :amount="plan.general_cost_commission_by_appointment" />
                          </div>
                          <div v-if="selected === plan.id && plan.commission_by_appointment" class="px-1 text-xs text-teal-600 bg-teal-100 rounded-full sm:px-4 sm:py-1 ">
                            Medico Especialista:
                            <BaseFormatMoney :amount="plan.specialist_cost_commission_by_appointment" />
                          </div>
                          <div v-if="selected === plan.id && plan.commission_by_appointment" class="px-1 text-xs text-teal-600 bg-teal-100 rounded-full sm:px-4 sm:py-1 flex items-center gap-1 " @click="showDiscountInfo">

                            Descuento x Cita: {{ Math.round(plan.commission_discount) }}% <span class="font-bold">(opcional) </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                          </div>

                        </div>


                      </div>





                    </div>
                  </div>
                </div>
                <ion-item v-if="errors.plan_id">

                  <ion-note color="danger" v-if="errors.plan_id">{{
                    errors.plan_id[0]
                  }}</ion-note>
                </ion-item>

                <!-- <ion-item>
                  <ion-input label="Costo aproximado de la consulta" labelPlacement="floating" type="number" v-model="form.general_cost_appointment" required :class="{ 'ion-invalid ion-touched': errors?.general_cost_appointment }" :errorText="errors?.general_cost_appointment"></ion-input>

                </ion-item>
                <ion-item v-if="form.general_cost_appointment">
                  <ion-Label>
                    <h3>Consulta Doctor Blue ({{ porcDiscountGeneralCostAppointments }}% descuento):</h3>
                    <BaseFormatMoney :amount="doctorBlueCostAppointment" :currency="{ code: 'CRC', precision: 0 }" />
                    <p><ion-Text color="primary">{{ doctorBlueCostAppointmentTerms  }}</ion-Text></p>
                  </ion-Label>
                </ion-item> -->
                <ion-item>
                  <ion-label>

                    <ion-select label="Tipo de profesional" labelPlacement="floating" v-model="form.type_of_health_professional" :class="{ 'ion-invalid ion-touched': errors?.type_of_health_professional }" :errorText="errors?.type_of_health_professional">
                      <ion-select-option :value="type.id" v-for="type in typesOfHealthProfessional" :key="type.id">{{ type.name }}</ion-select-option>
                    </ion-select>
                    <ion-note color="danger" v-if="errors.type_of_health_professional">{{
                      errors.type_of_health_professional[0]
                    }}</ion-note>
                  </ion-label>
                </ion-item>
                <ion-item v-if="filteredSpecialities.length">
                  <ion-label>
                    <ion-select label="Especialidad (Opcional)" labelPlacement="floating" v-model="form.speciality" :multiple="true" :class="{ 'ion-invalid ion-touched': errors?.speciality }" :errorText="errors?.speciality">

                      <ion-select-option :value="speciality.id" v-for="speciality in filteredSpecialities" :key="speciality.id">{{ speciality.name }}</ion-select-option>

                    </ion-select>
                    <ion-note color="danger" v-if="errors.speciality">{{
                      errors.speciality[0]
                    }}</ion-note>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-input label="Número de colegiado" labelPlacement="floating" type="number" v-model="form.medic_code" :class="{ 'ion-invalid ion-touched': errors?.medic_code }" :errorText="errors?.medic_code"></ion-input>

                </ion-item>

                <ion-item>
                  <ion-label>

                    <ion-select label="Tipo de identificación" labelPlacement="floating" v-model="form.tipo_identificacion" :class="{ 'ion-invalid ion-touched': errors?.tipo_identificacion }" :errorText="errors?.tipo_identificacion">
                      <ion-select-option value="01">Cédula Física</ion-select-option>
                      <!-- <ion-select-option value="02">Cédula Jurídica</ion-select-option> -->
                      <ion-select-option value="03">DIMEX</ion-select-option>
                      <ion-select-option value="04">NITE</ion-select-option> 
                    </ion-select>
                    <ion-note color="danger" v-if="errors.tipo_identificacion">{{
                      errors.tipo_identificacion[0]
                    }}</ion-note>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-input label="Identificación" labelPlacement="floating" type="number" v-model="form.ide" required @change="searchPerson" :class="{ 'ion-invalid ion-touched': errors?.ide }" :errorText="errors?.ide"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-input label="Nombre completo" labelPlacement="floating" type="text" v-model="form.name" required :class="{ 'ion-invalid ion-touched': errors?.name }" :errorText="errors?.name"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-input label="Email" labelPlacement="floating" type="email" v-model="form.email" required :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email"></ion-input>

                </ion-item>
                <ion-item>
                  <ion-input label="Teléfono" labelPlacement="floating" type="number" v-model="form.phone_number" required :class="{ 'ion-invalid ion-touched': errors?.phone_number }" :errorText="errors?.phone_number"></ion-input>

                </ion-item>
                <ion-item>
                  <ShowHidePasswordInput v-model="form.password" label="Contraseña" label-placement="floating" :required="true" :error="errors?.password" />

                </ion-item>
                <ion-item>
                  <ShowHidePasswordInput v-model="form.password_confirmation" label="Confirmación de Contraseña" label-placement="floating" :required="true" :error="errors?.password_confirmation" />

                </ion-item>
                <ion-item>
                  <ion-button @click="takePhoto()">
                    <ion-icon :icon="camera" slot="start"></ion-icon> Tomar Foto Titulo Profesional
                  </ion-button>
                 
                </ion-item>
                <ion-item v-if="photos.length || errors && errors[`photos`]">
                  <span v-if="errors && errors[`photos`]">
                    <p class="photos error-text sc-ion-textarea-md">{{ errors[`photos`][0] }}</p>
                  </span>
                  <ion-grid>
                    <ion-row>
                      <ion-col size="12" :key="index" v-for="(photo, index) in photos">
                        <ion-img :src="photo.webviewPath" @click="removeTempPhoto(photo, index)"></ion-img>
                        <span v-if="errors && errors[`photos.${index}`]">
                          <p class="photos error-text sc-ion-textarea-md">{{ errors[`photos.${index}`][0] }}</p>
                        </span>
                       
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-item>
                <ion-item lines="none">
                  <small>
                    Asegurece de subir una fotografia de buena calidad que sea legible <br>
                    <NoteMaxUploadFileSize />
                  </small>
                </ion-item>

                <!-- <ion-item>
                  <ion-toggle value="1" v-model="form.accumulated_affiliation">
                    Canje saldo acumulado
                  </ion-toggle>
                </ion-item>
                <ion-note>Al seleccionar esta opcion usted acepta canjear saldos acumulados a sus pacientes</ion-note> -->
                <ion-item lines="none">
                  <ion-label color="primary">
                    <a :href="auth.global?.url_terms" target="_blank">Ver términos y condiciones</a>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-checkbox slot="start" v-model="checkTerms" labelPlacement="end">
                    <h5>Acepto términos y condiciones</h5>
                  </ion-checkbox>


                </ion-item>
              </div>
              <div class="ion-padding">
                <ion-button type="submit" expand="full" shape="round" color="primary" :disabled="!checkTerms">
                  Registrarse
                </ion-button>
                <!-- <ion-button
                  @click="() => router.push('/auth/login')"
                  fill="clear"
                >
                  Ya tengo cuenta
                </ion-button> -->
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  menuController,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton,
  IonCheckbox,
  //IonText,
  IonImg,
  IonIcon,
  onIonViewDidEnter,
  alertController
} from "@ionic/vue";
import { camera } from "ionicons/icons";
import { computed, onMounted, ref, watch } from "vue";
import useAuth from "@/modules/auth/composables/useAuth";
import useSpecialities from "@/modules/medic/composables/useSpecialities";
import useUi from "@/composables/useUi";
import { useRoute, useRouter } from "vue-router";
import useUtilities from "@/composables/useUtilities";
import usePhotoGallery from "@/composables/usePhotoGallery";
import NoteMaxUploadFileSize from '@/components/NoteMaxUploadFileSize.vue';
import ShowHidePasswordInput from "@/components/ShowHidePasswordInput.vue";
import BaseFormatMoney from "@/components/BaseFormatMoney.vue";
import { useGlobalSettings } from "@/composables/useGlobalSettings";

onIonViewDidEnter(() => {
  menuController.swipeGesture(false);
});
const { takePhoto, photos } = usePhotoGallery();
const { auth, registerUser, errors } = useAuth();
//const { porcDiscountGeneralCostAppointments } = useGlobalSettings();
const { getSpecialities } = useSpecialities();
const { getCedulaInformation } = useUtilities();
const { alertMessage, loadingMessage, dismissLoading } = useUi();
const { typesOfHealthProfessional } = useGlobalSettings();
const router = useRouter();
const route = useRoute();
const { code } = route.params
const form = ref<any>({
  type_of_health_professional: "",
  tipo_identificacion: "",
  ide: "",
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone_number: "",
  phone_country_code: "+506",
  medic_code: "",
  authorization_code: code,
  accumulated_affiliation: 0,
  speciality: [],
  plan_id: null,
  general_cost_appointment: '',
  photos: [],
});
const checkTerms = ref(false);
const specialities = ref<any[]>([]);
const selected = ref(null);

// const doctorBlueCostAppointment = computed(() => {
//   if(!form.value.general_cost_appointment) return 0;

//   const cost = parseFloat(form.value.general_cost_appointment);
//   return  cost - (cost * (porcDiscountGeneralCostAppointments.value/100));
// });

// const doctorBlueCostAppointmentTerms = computed(() => {
//   return auth.value.global?.doctor_blue_cost_appointment_terms;
// });

watch(selected, (value) => {
  form.value.plan_id = value;
}, { immediate: true })

const searchPerson = async () => {

  const { nombre, tipoIdentificacion } = await getCedulaInformation(form.value.ide)

  form.value.name = nombre;
  form.value.tipo_identificacion = tipoIdentificacion;


}
const presentConfirmationMedicAlert = async () => {
  const alert = await alertController.create({
    header: "Confirmación",
    message: auth.value.global?.confirmation_medic_register_message || "Confirmación de registro",
    backdropDismiss: false,
    buttons: [

      {
        text: "Terminos y condiciones",
        role: "terms",
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
      {
        cssClass: "primary",
        text: "Confirmar",
        role: "confirm",
      },
    ],

  });

  await alert.present();

  return await alert.onDidDismiss();
};


const onRegister = async () => {

  if (auth.value.global?.confirmation_medic_register) {
    const respConfirmation = await presentConfirmationMedicAlert();

    if (respConfirmation.role === "terms") {
      window.open(auth.value.global?.url_terms, "_blank");
      return;
    }
    if (respConfirmation.role !== "confirm") return;

  }

  form.value.photos = [];
  form.value.photos.push(...photos.value);

  loadingMessage();

  const resp = await registerUser(form.value, "medic");

  dismissLoading();

  if (resp.ok) {

    form.value = {
      type_of_health_professional: "",
      tipo_identificacion: "",
      ide: "",
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
      phone_country_code: "+506",
      medic_code: "",
      authorization_code: code,
      accumulated_affiliation: 0,
      speciality: [],
      plan_id: null,
      general_cost_appointment: "",
      photos: []
    }
    photos.value = [];
    selected.value = null;

    
    alertMessage("Éxito", "Registro enviado correctmente. Tu información esta en proceso de validación, una vez revisada se te notificará vía correo electrónico la aprobación!");
      //router.push("/medic/home");
    
  } else {
    alertMessage("Error", "Error al crear usuario. Verifica!");
  }
};

const plans = computed(() => auth.value.global?.plans.filter((p: any) => p.for_medic));
const filteredSpecialities = computed(() => {
  return specialities.value.filter((s) => s.professional === form.value.type_of_health_professional);
});
 
function removeTempPhoto(photo: any, index: any) {
  photos.value.splice(index, 1);
}
onMounted(async () => {
  photos.value = [];
  specialities.value = await getSpecialities();
});

function showDiscountInfo() {
  alertMessage("Descuento por cita", "Para obtener este descuento deberás seleccionar la opción de Utiliza Agenda DOCTOR BLUE al momento de crear un consultorio, esto te permitirá recibir CITAS EN LÍNEA con un 50% menos de comisión. En caso de NO Utilizar la Agenda de DOCTOR BLUE, podrás obtener el mismo descuento colocando al paciente en estatus de AGENDADO. Lo anterior en un plazo inferior a 10min tras recibir la solicitud.");
}
</script>

<style scoped>
img {
  max-width: 12rem;
}
.photos.error-text {
  display: block;
  color: var(--ion-color-danger);
  font-size: 12px;
}
</style>
