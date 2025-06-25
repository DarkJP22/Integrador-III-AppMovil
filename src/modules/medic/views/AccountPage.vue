<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Cuenta </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="confirmDelete">
            Eliminar
          </ion-button>
        </ion-buttons>
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
                    <ion-input label="Identificación" labelPlacement="floating" type="number" v-model="form.ide" :class="{ 'ion-invalid ion-touched': errors?.ide }" :errorText="errors?.ide" required></ion-input>
                   
                  </ion-item>
                  <ion-item>
                    <ion-input label="Nombre" labelPlacement="floating" type="text" v-model="form.name" :class="{ 'ion-invalid ion-touched': errors?.name }" :errorText="errors?.name" required></ion-input>
                  
                  </ion-item>

                  <ion-item>
                    <ion-input label="Teléfono" labelPlacement="floating" type="number" v-model="form.phone_number" :class="{ 'ion-invalid ion-touched': errors?.phone_number }" :errorText="errors?.phone_number"></ion-input>
                   
                  </ion-item>
                  <ion-item>
                    <ion-input label="Correo" labelPlacement="floating" type="email" v-model="form.email" :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email" required></ion-input>
                   
                  </ion-item>
                  <ion-item>
                    <ShowHidePasswordInput v-model="form.password" label="Cambiar contraseña" label-placement="floating" :error="errors?.password" />
                   
                  </ion-item>
                  <ion-item>
                    <ion-input label="Código Médico" labelPlacement="floating" type="text" v-model="form.medic_code" :class="{ 'ion-invalid ion-touched': errors?.medic_code }" :errorText="errors?.medic_code" required></ion-input>
                   
                  </ion-item>

                  <ion-item lines="full" color="light">
                    <ion-label position="stacked"> Especialidad </ion-label>
                    <p>{{ medicSpecialities }}</p>
                  </ion-item>
                  <ion-grid>
                    <ion-row color="primary">
                      <ion-col size-md="6" size-xs="6">
                        <ion-item :button="true" id="open-minTime-input">
                          <ion-label position="stacked">De</ion-label>
                          <ion-text>{{ parseTime12(minTime) }}</ion-text>
                          <ion-popover trigger="open-minTime-input" :show-backdrop="true" side="top" alignment="center" size="auto" class="popover-time">
                            <ion-datetime v-model="minTime" presentation="time" />
                          </ion-popover>
                          <ion-note color="danger" v-if="errors.minTime">{{
                            errors.minTime[0]
                          }}</ion-note>
                        </ion-item>
                      </ion-col>
                      <ion-col size-md="6" size-xs="6">
                        <ion-item :button="true" id="open-maxTime-input">
                          <ion-label position="stacked">Hasta</ion-label>
                          <ion-text>{{ parseTime12(maxTime) }}</ion-text>
                          <ion-popover trigger="open-maxTime-input" :show-backdrop="true" side="top" alignment="center" size="auto" class="popover-time">
                            <ion-datetime v-model="maxTime" presentation="time" />
                          </ion-popover>
                          <ion-note color="danger" v-if="errors.maxTime">{{
                            errors.maxTime[0]
                          }}</ion-note>
                        </ion-item>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                  <ion-item lines="none">
                    <ion-label color="primary">Dias Libres</ion-label>
                  </ion-item>

                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="lun" v-model="daysOff.lun">Lunes</ion-checkbox>
                  </ion-item>
                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="mar" v-model="daysOff.mar">Martes</ion-checkbox>
                  </ion-item>
                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="mie" v-model="daysOff.mie">Miércoles</ion-checkbox>
                  </ion-item>
                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="jue" v-model="daysOff.jue">Jueves</ion-checkbox>
                  </ion-item>
                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="vie" v-model="daysOff.vie">Viernes</ion-checkbox>
                  </ion-item>

                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="sab" v-model="daysOff.sab">Sábado</ion-checkbox>
                  </ion-item>
                  <ion-item>
                    <ion-checkbox color="dark" :checked="true" name="dom" v-model="daysOff.dom">Domingo</ion-checkbox>
                  </ion-item>
                  <!-- <ion-item>
                    <ion-input label="Costo aproximado de la consulta" labelPlacement="floating" type="text" v-model="form.general_cost_appointment" required></ion-input>
                    <ion-note color="danger" v-if="errors.general_cost_appointment">{{
                      errors.general_cost_appointment[0]
                    }}</ion-note>
                  </ion-item> -->
                  <!-- <ion-item>
                    <ion-toggle :disabled="true" value="1" v-model="form.accumulated_affiliation" label-placement="end">
                      Canje saldo acumulado
                    </ion-toggle>
                  </ion-item>
                  <ion-note>Al seleccionar esta opcion usted acepta canjear saldos acumulados a sus pacientes</ion-note> -->
                </div>
                <div class="ion-padding">
                  <ion-button type="submit" expand="block" :disabled="isLoading" shape="round">
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
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  IonNote,
  IonPopover,
  IonDatetime,
  IonText,
  IonCheckbox,
  //IonToggle,
  alertController
} from "@ionic/vue";

import { computed, onMounted, ref } from "vue";
import useAccount from "@/modules/medic/composables/useAccount";
import ShowHidePasswordInput from "@/components/ShowHidePasswordInput.vue";
import useUi from "@/composables/useUi";
import useUtilities from "@/composables/useUtilities";
import { formatISO } from "date-fns/fp/formatISO";
import { useRouter } from "vue-router";


const { updateUser, getUser, isLoading, errors, deleteAccount } = useAccount();
const { parseDate, parseTime12, parseTime24, parseIsoDatetime } =
  useUtilities();
const { toastMessage, alertMessage } = useUi();
const router = useRouter();
const form = ref<any>({});
const minTime = ref<any>("");
const maxTime = ref<any>("");

const daysOff = ref<any>({
  lun: false,
  mar: false,
  mie: false,
  jue: false,
  vie: false,
  sab: false,
  dom: false,
});

const medicSpecialities = computed(() => {
  if (!form.value.specialities) return "Ninguna";
  if (!form.value.specialities.length) return "Ninguna";

  return form.value.specialities.map((sp: any) => sp.name).join(", ");
});

const transformToForm_FreeDays = (days: any) => {
  days.forEach((element: any) => {
    if (element == 1) daysOff.value.lun = true;
    if (element == 2) daysOff.value.mar = true;
    if (element == 3) daysOff.value.mie = true;
    if (element == 4) daysOff.value.jue = true;
    if (element == 5) daysOff.value.vie = true;
    if (element == 6) daysOff.value.sab = true;
    if (element == 0) daysOff.value.dom = true;
  });
};
const transformToArray_FreeDays = () => {
  const arrayFreeDays = [];

  if (daysOff.value.lun) arrayFreeDays.push(1);
  if (daysOff.value.mar) arrayFreeDays.push(2);
  if (daysOff.value.mie) arrayFreeDays.push(3);
  if (daysOff.value.jue) arrayFreeDays.push(4);
  if (daysOff.value.vie) arrayFreeDays.push(5);
  if (daysOff.value.sab) arrayFreeDays.push(6);
  if (daysOff.value.dom) arrayFreeDays.push(0);

  form.value.freeDays = arrayFreeDays;
};

const onSave = async () => {
  if (form.value.id) {
    form.value.minTime = parseTime24(minTime.value);
    form.value.maxTime = parseTime24(maxTime.value);
    transformToArray_FreeDays();

    const { ok, message } = await updateUser(form.value);
    if (!ok) alertMessage("Error", message);
    else {
      toastMessage("Guardado correctamente");
      router.back();
    }
  }
};

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: "Cancelación de Cuenta",
    message: 'Estas seguro que deseas eliminar tu cuenta. Esta acción eliminara todos tus datos de la plataforma. Ten en cuenta que esta acción es irreversible',
    backdropDismiss: false,
    buttons: [
      {
        cssClass: "primary",
        text: "Confirmar",
        role: "confirm",
        handler: async () => {
         
          const { ok, message } = await deleteAccount();
          if (!ok) alertMessage("Error", message);
          else router.replace({ name: 'login' });
        }
      },
      {
        text: "Cerrar",
        role: "cancel",
      },
    ],

  });

  await alert.present();


};

onMounted(async () => {
  const { user, settings } = await getUser();
  form.value = user;
  form.value.settings = settings;

  minTime.value = parseIsoDatetime(
    parseDate(formatISO(new Date())) + " " + form.value.settings.minTime
  );
  maxTime.value = parseIsoDatetime(
    parseDate(formatISO(new Date())) + " " + form.value.settings.maxTime
  );

  transformToForm_FreeDays(JSON.parse(form.value.settings.freeDays));
});


</script>
