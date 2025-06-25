<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Registro</ion-title>
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
                <ion-item>
                  <ion-label>

                    <ion-select label="Tipo identificación" labelPlacement="floating" v-model="form.tipo_identificacion" :class="{ 'ion-invalid ion-touched': errors?.tipo_identificacion }" :errorText="errors?.tipo_identificacion" required>
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
                  <ion-input label="Email (Opcional)" labelPlacement="floating" type="email" v-model="form.email" :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email"></ion-input>
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
                <ion-item lines="none">
                  <ion-label color="primary">
                    <a :href="auth.global?.url_patient_terms" target="_blank">Términos y condiciones</a>
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
  IonNote,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  menuController,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton,
  IonCheckbox,
  onIonViewDidEnter
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import useAuth from "@/modules/auth/composables/useAuth";
import useUi from "@/composables/useUi";
import { useRoute, useRouter } from "vue-router";
import useUtilities from "@/composables/useUtilities";
import ShowHidePasswordInput from "@/components/ShowHidePasswordInput.vue";


onIonViewDidEnter(() => {
  menuController.swipeGesture(false);
});

const { auth, registerUser, registerUpdateUser, errors } = useAuth();

const { getCedulaInformation } = useUtilities();
const { alertMessage, loadingMessage, dismissLoading } = useUi();
const router = useRouter();
const route = useRoute();
const form = ref({
  id: "",
  tipo_identificacion: "",
  ide: "",
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone_number: "",
  phone_country_code: "+506",
});
onMounted(() => {
  if (route.query.ide) {
    form.value.ide = route.query.ide as string;
    searchPerson();
  }
})
const checkTerms = ref(false);
const searchPerson = async () => {

  searchHacienda();
  // const { ok, user } = await getUserByIde(form.value.ide);

  // if (!ok || !user) {
  //   searchHacienda();
  //   return;
  // }

  // form.value.id = user.id;
  // form.value.name = user.name;
  // form.value.tipo_identificacion = "01";
  // form.value.email = user.email;
  // form.value.phone_number = user.phone_number;
  // form.value.phone_country_code = user.phone_country_code;

}
async function searchHacienda() {

  const { nombre, tipoIdentificacion } = await getCedulaInformation(form.value.ide)

  form.value.name = nombre;
  form.value.tipo_identificacion = tipoIdentificacion;
}
const onRegister = async () => {
  loadingMessage();

  let ok = false;
  if (form.value.id) {
    const resp = await registerUpdateUser(form.value);
    ok = resp.ok;
  } else {
    const resp = await registerUser(form.value);
    ok = resp.ok;
  }

  dismissLoading();

  if (ok) {
    form.value = {
      id: "",
      tipo_identificacion: "",
      ide: "",
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
      phone_country_code: "+506",
    }

    router.push("/patient/home");
    
  } else {
    alertMessage("Error", "Error al crear usuario. Verifica!");
  }
};



</script>

<style scoped>
img {
  max-width: 12rem;
}
</style>
