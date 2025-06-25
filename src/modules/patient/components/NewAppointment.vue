<template>
  <form action="#" @submit.prevent="onSave()">
    <ion-card>
      <ion-item>
        <ion-input label="Clínica" labelPlacement="floating" type="text" :value="officeName" readonly></ion-input>
      </ion-item>
      <!-- <ion-item class="ion-text-wrap">
         <ion-input label="Fecha" labelPlacement="floating" type="text" :value="appointmentDate" readonly></ion-input>
        <ion-note color="danger" v-if="errors.date">{{
          errors.date[0]
        }}</ion-note> 
        <ion-label class="ion-text-wrap">Seleccione la Fecha</ion-label>
        <ion-datetime-button datetime="datetime"></ion-datetime-button>

        <ion-modal :keep-contents-mounted="true">
          <ion-datetime v-model="form.date" :is-date-enabled="isScheduleDay" id="datetime" presentation="date" :minute-values="'0,' + form.slotDuration"></ion-datetime>
        </ion-modal>
      </ion-item> -->

      <ion-item>
        <ion-label>

          <ion-select class="ion-text-wrap" :disabled="isLoading || isLoadingSchedules" label="Fecha" labelPlacement="floating" v-model="form.date" placeholder="seleccione fecha" interface="popover" required>
            <ion-select-option :value="date.value" v-for="date in availableDates" :key="date.value" :disabled="date.disabled" class="ion-text-wrap">{{ date.text }}</ion-select-option>
            <ion-select-option v-if="!availableDates.length" :disabled="true" value="">
              {{ (isLoading || isLoadingSchedules) ? 'Cargando Horario...' : 'No hay horario disponible' }}
            </ion-select-option>
          </ion-select>
          <ion-note color="danger" v-if="errors.date">{{
            errors.date[0]
          }}</ion-note>
        </ion-label>
      </ion-item>

      <ion-item>
        <ion-label>
          <ion-select :disabled="isLoading || isLoadingSchedules" label="Hora" labelPlacement="floating" v-model="form.start" placeholder="seleccione hora" required @IonChange="onChangeStart" interface="popover">
            <ion-select-option :value="hour.value" v-for="hour in availableHours" :key="hour.value" :disabled="hour.disabled">{{ hour.text }}</ion-select-option>
            <ion-select-option v-if="!availableHours.length" :disabled="true" value="">
              {{ (isLoading || isLoadingSchedules) ? 'Cargando Horario...' : 'No hay horario disponible' }}
            </ion-select-option>
          </ion-select>
          <ion-note color="danger" v-if="errors.start">{{
            errors.start[0]
          }}</ion-note>
        </ion-label>
      </ion-item>

      <ion-item>
        <ion-label>
          <ion-select :disabled="isLoading || isLoadingSchedules" label="Paciente" labelPlacement="floating" v-model="form.patient_id" placeholder="seleccione el paciente" required>
            <ion-select-option :value="patient.id" v-for="patient in patients" :key="patient.id">{{ patient.first_name }}</ion-select-option>
          </ion-select>
          <ion-note color="danger" v-if="errors.patient_id">{{
            errors.patient_id[0]
          }}</ion-note>
        </ion-label>
      </ion-item>
      <!-- <ion-item
        v-if="isLoadingAccumulated"
        lines="none"
        class="ion-text-center"
      >
        <ion-label>Cargando Acumulado...</ion-label>
      </ion-item> -->
      <!-- <template v-if="form.cost > 0 && !isLoadingAccumulated">
        <ion-item>
          <ion-label position="stacked">Costo de Consulta</ion-label>
          <ion-input type="text" :value="generalCost" readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Descuento disponible</ion-label>
          <ion-input
            type="text"
            :value="availableDiscount"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Saldo Canjeable</ion-label>
          <ion-input
            type="text"
            :value="accumulatedAmount"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Total</ion-label>
          <ion-input type="text" :value="totalCost" readonly></ion-input>
        </ion-item>
      </template> -->
    </ion-card>
    <div class="ion-padding">
      <ion-button type="submit" expand="block" shape="round" :disabled="isLoading || isLoadingAccumulated">
        <ion-spinner slot="start" class="spinner-button" v-if="isLoading"></ion-spinner>
        Reservar Cita
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
  // IonDatetimeButton,
  // IonDatetime,
  // IonModal,
  IonLabel
} from "@ionic/vue";
import useAppointments from "../composables/useAppointments";
import useUtilities from "@/composables/useUtilities";
import {
  computed,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import useUi from "@/composables/useUi";
import { addMinutes, addMonths, isSameDay, isPast } from "date-fns";
import useSchedules from "../composables/useSchedules";
import { Patient } from "@/interfaces/patients";
import useMedics from "../composables/useMedics";
import useAccumulateds from "../composables/useAccumulateds";
//import useConfiguration from "../composables/useConfiguration";
//import useAuth from "@/modules/auth/composables/useAuth";
const emit = defineEmits(['appointmentCreated']);
const props = defineProps({
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
  patients: {
    type: Array as PropType<Patient[]>,
    required: true,
  },
});

const { isLoading, errors, createAppointment, medicAppointments, getAppointmentsByMedicAndClinic } =
  useAppointments();
const { schedules, getSchedules, isLoading: isLoadingSchedules } = useSchedules();
const { getMedic } = useMedics();
const { alertMessage } = useUi();
const { /*getAccumulated,*/ isLoading: isLoadingAccumulated } = useAccumulateds();
//const { auth } = useAuth();
//const { configuration } = useConfiguration();
const {
  parseDate,
  parseIsoDatetimeWithoutTz,
  parseTime24,
  parseTime12,
  createIntervalsFromHours,
  parseDateHuman
  // moneyFormat,
} = useUtilities();
const schedule = ref<any>({});
const medic = ref<any>({});
const intervalHours = ref<string[]>([]);
//const accumulated = ref<any>({});
const slotDuration = computed(() => {
  const slot = 30;
  if (!schedule.value?.user) return slot;
  if (!schedule.value.user.settings) return slot;
  if (!schedule.value.user.settings.slotDuration) return slot;

  const hoursAsMinutes = parseInt(schedule.value.user.settings.slotDuration.split(":")[0]) * 60;
  const minutes = parseInt(schedule.value.user.settings.slotDuration.split(":")[1]);

  return (hoursAsMinutes + minutes);

});

const form = ref<{
  date: string;
  title: string;
  start: string;
  end: string;
  user_id: number | undefined;
  patient_id: number | undefined;
  office_id: number | undefined;
  slotDuration: number;
  // cost: number;
  // available_accumulated_discount: number;
  // total_cost: number;
}>({
  date: parseDate(new Date().toISOString()),
  title: "cita",
  start: "",
  end: "",
  user_id: props.medicId,
  patient_id: undefined,
  office_id: props.officeId,
  slotDuration: slotDuration.value,
  // cost: 0,
  // available_accumulated_discount: 0,
  // total_cost: 0,
});


watch(slotDuration, (newValue) => {
  form.value.slotDuration = newValue;
});

const onSave = async () => {
  const { ok, message, appointment } = await createAppointment(form.value);
  if (!ok) alertMessage("Error", message);
  else {
    //toastMessage("Cita Creada correctamente");
    alertMessage("Cita Generada", "Cita Creada correctamente");
    emit("appointmentCreated", appointment);
  }
};

const isReserved = (startSchedule: string, endSchedule: string) => {
  for (let j = 0; j < medicAppointments.value.length; j++) {
    if (
      medicAppointments.value[j].end > startSchedule &&
      medicAppointments.value[j].start < endSchedule
    ) {
      return true;
    }
  }

  return false;
};
// const cTotal = computed(() => {
//   return form.value.cost - form.value.available_accumulated_discount;
// });

// watch(cTotal, () => {
//   form.value.total_cost = cTotal.value;
// });

const availableHours = ref<any[]>([]);
const availableDates = ref<any[]>([]);

const getHoursSlots = (intervalHours: any[]) => {

  const tempInvervalHours = intervalHours.filter(
    (_, index: number) => index != intervalHours.length - 1
  );

  return tempInvervalHours.map((item: string) => {
    const start = parseIsoDatetimeWithoutTz(parseDate(form.value.date) + " " + item);
    const endDate = addMinutes(new Date(start), form.value.slotDuration);
    const end = parseIsoDatetimeWithoutTz(endDate.toISOString());
    const startText = parseTime12(parseDate(form.value.date) + " " + item);

    return {
      text: startText,
      value: start,
      disabled: isReserved(start, end) || isPast(new Date(start)),
    };
  }).filter(h => !h.disabled);
}

const generateAvailableDates = async () => {

  await getSchedules({ medicId: +props.medicId, officeId: +props.officeId, date1: form.value.date, date2: addMonths(new Date(form.value.date), 4), order: 'date', dir: 'asc' })

  const scheduleDates = [...new Set(schedules.value.map((item: any) => {
    return parseDate(item.date)
  }))];

  availableDates.value = scheduleDates.map((date: any) => {

    const start = parseIsoDatetimeWithoutTz((date));
    const startText = parseDateHuman(date);

    return {
      text: startText,
      value: start,
      disabled: isPast(new Date(start)) && !isSameDay(new Date(start), new Date()),
    };
  }).filter(h => !h.disabled);

}





const generateAvailableHours = async () => {
  availableHours.value = [];
  await getAppointmentsByMedicAndClinic({ medicId: +props.medicId, officeId: +props.officeId, date1: form.value.date, date2: form.value.date });
  // await getSchedules({ medicId:+props.medicId, officeId: +props.officeId, date1:form.value.date, date2: addMonths(new Date(form.value.date), 1)})






  schedule.value = schedules.value.find(
    (sch: any) => parseDate(sch.date) == parseDate(form.value.date)
  );
  

  const schedulesOfDay = schedules.value.filter(
    (sch: any) => parseDate(sch.date) == parseDate(form.value.date)
  );

  schedulesOfDay.forEach(schedule => {

    intervalHours.value = createIntervalsFromHours(
      parseDate(form.value.date),
      parseTime24(schedule.start),
      parseTime24(schedule.end),
      slotDuration.value
    );
    

    availableHours.value.push(...getHoursSlots(intervalHours.value));


  });


}

watch(() => form.value.date, () => {
  generateAvailableHours()
}, { immediate: true });

onMounted(async () => {
  

  medic.value = await getMedic(props.medicId);
  //accumulated.value = await getAccumulated(auth.value.accumulatedId);

  if (props.patients.length == 1) {
    form.value.patient_id = props.patients[0].id;
  }
  generateAvailableDates();

  // form.value.cost = parseFloat(
  //   medic.value?.settings?.general_cost_appointment ?? 0
  // );
  // form.value.available_accumulated_discount =
  //   form.value.cost *
  //     (configuration.value.porc_discount_accumulated / 100) ?? 0;
});



const onChangeStart = () => {
  const end = addMinutes(
    new Date(form.value.start),
    form.value.slotDuration
  );
  form.value.end = parseIsoDatetimeWithoutTz(end.toISOString());
};

const officeName = computed(() => {
  if (!medic.value.offices) return '';
  return medic.value?.offices.find((office: any) => office.id === props.officeId)?.name
});

</script>
