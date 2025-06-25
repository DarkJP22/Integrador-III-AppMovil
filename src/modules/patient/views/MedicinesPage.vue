<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Medicamentos </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="setOpen(true)"><ion-icon :md="addCircleSharp" :ios="addCircleOutline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">

      <ion-segment v-model="segmentCase">

        <ion-segment-button value="utilizados">
          <ion-label class="ion-text-wrap">Recomendados Farmacia</ion-label>
        </ion-segment-button>
        <ion-segment-button value="prescritos">
          <ion-label class="ion-text-wrap">Recetados Médicos</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div v-show="segmentCase == 'prescritos'" class="">
        <MedicineList :medicines="prescritas"></MedicineList>

      </div>
      <div v-show="segmentCase == 'utilizados'" class="">
        <MedicineList :medicines="utilizadas" @on-confirm-delete="onConfirmDelete" @disable-enable-doses-reminder="disableEnableDosesReminder"></MedicineList>

      </div>


      <ion-modal :is-open="isOpenRef" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Medicamento</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form action="#" @submit.prevent="onSave()" novalidate>
            <ion-grid>
              <ion-row class="ion-justify-content-center" color="primary">
                <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                  <div class="">
                    <ion-item>
                      <ion-input label="Medicamento" labelPlacement="floating" type="text" v-model="form.name"></ion-input>
                      <ion-note color="danger" v-if="errors.name">{{
                        errors.name[0]
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
import MedicineList from "@/modules/patient/components/MedicineList.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonLabel,
  IonItem,
  IonIcon,
  IonButton,
  IonModal,
  IonGrid,
  IonCol,
  IonRow,
  IonNote,
  IonInput,
  IonSegment,
  IonSegmentButton

} from "@ionic/vue";
import { addCircleSharp, addCircleOutline } from "ionicons/icons";
import { useRoute } from "vue-router";
import useMedicines from "../composables/useMedicines";
import { computed, ref } from "vue";
import useUi from "@/composables/useUi";
const { alertMessage } = useUi();
const route = useRoute();
const { id } = route.params;
const { medicines, disableEnableDosesReminder, isLoading, createMedicine, onConfirmDelete, errors } = useMedicines(
  parseInt(id.toString())
);

const segmentCase = ref("utilizados");
const isOpenRef = ref(false);

const prescritas = computed(() => medicines.value.filter((m:any) => m.creator_type === 'App\\User').map((m: any) => { return { ...m, canDelete: false } }));
const utilizadas = computed(() => medicines.value.filter((m:any) => ['App\\Patient', 'App\\Pharmacy'].includes(m.creator_type)).map((m: any) => { return { ...m, canDelete: true } }));
const form = ref({
  name: "",
});

const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  form.value.name = "";
};

const onSave = async () => {
  const { ok, message } = await createMedicine(form.value);
  if (!ok) alertMessage("Error", message);
  else setOpen(false);
};



</script>
