<template>
  <form action="#" @submit.prevent="onSave()">
    <ion-card>
      <ion-item>
        <ion-input label="Clínica" labelPlacement="floating" type="text" :value="officeName" readonly></ion-input>
      </ion-item>
      <ion-item :button="true" id="open-scheduled-date-input">
        <ion-input label="Fecha" labelPlacement="floating" :value="parseDate(form.scheduled_date)" @ionChange="onChangeDate" />
        <ion-popover trigger="open-scheduled-date-input" :show-backdrop="true" alignment="center" class="popover-period">
          <ion-content>
            <ion-datetime v-model="form.scheduled_date" presentation="date" />
          </ion-content>
        </ion-popover>
        <ion-note color="danger" v-if="errors.scheduled_date">{{
          errors.scheduled_date[0]
        }}</ion-note>
      </ion-item>

      <ion-item>
        <ion-select label="Hora" labelPlacement="floating" v-model="form.start" placeholder="seleccione hora" required @IonChange="onChangeStart">
          <ion-select-option :value="hour.value" v-for="hour in availableHours" :key="hour.value" :disabled="hour.disabled">{{ hour.text }}</ion-select-option>
        </ion-select>
        <ion-note color="danger" v-if="errors.start">{{
          errors.start[0]
        }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-input label="Paciente" labelPlacement="floating" type="text" :value="patientName" readonly></ion-input>
      </ion-item>


    </ion-card>
    <div class="ion-padding">
      <ion-button type="submit" expand="block" shape="round" :disabled="isLoading">
        <ion-spinner slot="start" class="spinner-button" v-if="isLoading"></ion-spinner>
        Agendar
      </ion-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonItem,
  IonCard,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonSpinner,
  IonPopover,
  IonContent,
  IonDatetime
} from "@ionic/vue";

import useUtilities from "@/composables/useUtilities";
import {
  computed,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import useUi from "@/composables/useUi";
import { addMinutes, isPast } from "date-fns";
import { Patient } from "@/interfaces/patients";
import useAppointmentRequestUpdate from "../composables/useAppointmentRequestUpdate";
import useAuth from "@/modules/auth/composables/useAuth";
import useMedics from "@/modules/patient/composables/useMedics";


const emit = defineEmits(["appointmentRequestUpdated"]);

const props = defineProps({
  appointmentRequest: {
    type: Object as PropType<any>,
    required: true,
  },
  eventAppointmentRequests: {
    type: Array as PropType<any[]>,
    required: true,
  },
  medicId: {
    type: Number,
    required: true,
  },
  officeId: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  patient: {
    type: Object as PropType<Patient>,
    required: true,
  },
  office: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});


const { isLoading, updateAppointmentRequest, errors } = useAppointmentRequestUpdate();
const { getMedic } = useMedics();
const { toastMessage, alertMessage } = useUi();
const { auth } = useAuth();

const {
  parseDate,
  parseIsoDatetimeWithoutTz,
  parseIsoDatetime,
  parseTime24,
  parseTime12,
  createIntervalsFromHours,

} = useUtilities();

const medic = ref<any>({});
const intervalHours = ref<string[]>([]);

const slotDuration = computed(() => {
  const slot = 30;
  if (!auth.value) return slot;
  if (!auth.value.settings) return slot;
  if (!auth.value.settings.slotDuration) return slot;
  const hoursAsMinutes = parseInt(auth.value.settings.slotDuration.split(":")[0]) * 60;
  const minutes = parseInt(auth.value.settings.slotDuration.split(":")[1]);

  return (hoursAsMinutes + minutes);

});


const form = ref<{
  id: number | null,
  scheduled_date: string;
  start: string;
  end: string;
  status: number;
}>({
  id: null,
  scheduled_date: '',
  start: "",
  end: "",
  status: 1
});

const medicAppointmentRequests = computed(() => props.eventAppointmentRequests)
watch(() => props.appointmentRequest, (newValue) => {

  form.value.id = newValue.id,
    form.value.scheduled_date = props.date || newValue.scheduled_date,
    form.value.start = parseIsoDatetimeWithoutTz(newValue.start)
  form.value.end = parseIsoDatetimeWithoutTz(newValue.end)

}, { immediate: true });

const minTime = computed(() => {
  const time = "06:00:00";
  if (!auth.value) return time;
  if (!auth.value.settings) return time;

  return parseIsoDatetime(
    parseDate(form.value.scheduled_date) + " " + auth.value.settings.minTime
  );
});

const maxTime = computed(() => {
  const time = "18:00:00";
  if (!auth.value) return time;
  if (!auth.value.settings) return time;

  return parseIsoDatetime(
    parseDate(form.value.scheduled_date) + " " + auth.value.settings.maxTime
  );
});

const onSave = async () => {

  updateAppointmentRequest(form.value, {
    onSuccess: (data) => {
      toastMessage("Cita Agendada correctamente");
      emit("appointmentRequestUpdated", data);
    },
    onError: (error) => {
      alertMessage("Error", error);
    }
  });

};

const isReserved = (startSchedule: string, endSchedule: string) => {
  for (let j = 0; j < medicAppointmentRequests.value.length; j++) {
    if (
      medicAppointmentRequests.value[j].end > startSchedule &&
      medicAppointmentRequests.value[j].start < endSchedule
    ) {
      return true;
    }
  }

  return false;
};
const onChangeDate = () => {

  form.value.end = "";
  form.value.start = "";

};
const onChangeStart = () => {
  if (!form.value.start) return;

  const end = addMinutes(
    new Date(form.value.start),
    slotDuration.value
  );

  form.value.end = parseIsoDatetimeWithoutTz(end.toISOString());


};

onMounted(async () => {

  medic.value = auth.value.user; //await getMedic(auth.value.user.id);

  intervalHours.value = createIntervalsFromHours(
    form.value.scheduled_date,
    parseTime24(minTime.value),
    parseTime24(maxTime.value),
    slotDuration.value
  );

  // form.value.start = parseIsoDatetimeWithoutTz(appointmentRequest.value?.start)
  // form.value.end = parseIsoDatetimeWithoutTz(appointmentRequest.value?.end)

});
//const appointmentDate = computed(() => form.value.scheduled_date);
const officeName = computed(() => props.office?.name);
const patientName = computed(() => props.patient?.first_name);
const availableHours = computed(() => {

  const tempInvervalHours = intervalHours.value.filter(
    (_, index: number) => index != intervalHours.value.length - 1
  );

  return tempInvervalHours.map((item: string) => {
    const start = parseIsoDatetimeWithoutTz(form.value.scheduled_date + " " + item);
    const endDate = addMinutes(new Date(start), slotDuration.value);
    const end = parseIsoDatetimeWithoutTz(endDate.toISOString());
    const startText = parseTime12(form.value.scheduled_date + " " + item);

    return {
      text: startText,
      value: start,
      disabled: isReserved(start, end) || isPast(new Date(start)),
    };
  });
});

</script>
