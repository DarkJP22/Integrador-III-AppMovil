<template>
  <form action="#" @submit.prevent="onSave()">
    <ion-card>
      <ion-item>
        <ion-select label="Clínica" labelPlacement="floating" v-model="clinicSelected" placeholder="seleccione la clínica" required>
          <ion-select-option :value="office.id" v-for="office in officesGPS" :key="office.id">{{ office.name }}</ion-select-option>
        </ion-select>
        <ion-note color="danger" v-if="errors['schedules.0.office_id']">{{
          errors["schedules.0.office_id"][0]
        }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-input label="Fecha" labelPlacement="floating" type="text" :value="scheduleDate" readonly></ion-input>
        <ion-note color="danger" v-if="errors['schedules.0.date']">{{
          errors["schedules.0.date"][0]
        }}</ion-note>
      </ion-item>
      <ion-item>
        <ion-select label="Paciente cada:" labelPlacement="floating" v-model="form.slotDuration" placeholder="seleccione" :disabled="isMedicLoading" required>
          <ion-select-option :value="slot.valueAsMinutes" v-for="slot in availableSlotDurations" :key="slot.value">{{ slot.text }}</ion-select-option>
        </ion-select>
        <ion-note color="danger" v-if="errors['schedules.0.slotDuration']">{{
          errors["schedules.0.slotDuration"][0]
        }}</ion-note>
      </ion-item>
      <ion-grid>
        <ion-row class="ion-justify-content-center" color="primary">
          <ion-col size-sm="6" size-xs="6">
            <ion-item>
              <ion-select label="Desde" labelPlacement="floating" v-model="form.start" placeholder="seleccione hora" required>
                <ion-select-option :value="hour.value" v-for="hour in availableHours" :key="hour.value" :disabled="hour.disabled">{{ hour.text }}</ion-select-option>
              </ion-select>
              <ion-note color="danger" v-if="errors['schedules.0.start']">{{
                errors["schedules.0.start"][0]
              }}</ion-note>
            </ion-item>
          </ion-col>
          <ion-col size-sm="6" size-xs="6">
            <ion-item>
              <ion-select label="Hasta" labelPlacement="floating" v-model="form.end" placeholder="seleccione hora" required>
                <ion-select-option :value="hour.value" v-for="hour in availableHours" :key="hour.value" :disabled="hour.disabled">{{ hour.text }}</ion-select-option>
              </ion-select>
              <ion-note color="danger" v-if="errors['schedules.0.end']">{{
                errors["schedules.0.end"][0]
              }}</ion-note>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center" color="primary">
          <ion-label position="stacked">Horas libres (Almuerzo, etc)</ion-label>
        </ion-row>
        <ion-row class="ion-justify-content-center" color="primary">
          <ion-col size-sm="6" size-xs="6">
            <ion-item>
              <ion-select label="Desde" labelPlacement="floating" v-model="form.free_start" placeholder="seleccione hora" required>
                <ion-select-option :value="hour.value" v-for="hour in availableHoursFree" :key="hour.value" :disabled="hour.disabled">{{ hour.text }}</ion-select-option>
              </ion-select>
              <ion-note color="danger" v-if="errors['schedules.0.free_start']">{{
                errors["schedules.0.free_start"][0]
              }}</ion-note>
            </ion-item>
          </ion-col>
          <ion-col size-sm="6" size-xs="6">
            <ion-item>
              <ion-select label="Hasta" labelPlacement="floating" v-model="form.free_end" placeholder="seleccione hora" required>
                <ion-select-option :value="hour.value" v-for="hour in availableHoursFree" :key="hour.value" :disabled="hour.disabled">{{ hour.text }}</ion-select-option>
              </ion-select>
              <ion-note color="danger" v-if="errors['schedules.0.free_end']">{{
                errors["schedules.0.free_end"][0]
              }}</ion-note>
            </ion-item>
          </ion-col>

        </ion-row>
      </ion-grid>
    </ion-card>
    <div class="ion-padding">
      <ion-button type="submit" expand="block" shape="round" :disabled="isLoading">
        <ion-spinner slot="start" class="spinner-button" v-if="isLoading"></ion-spinner>
        Crear Horario
      </ion-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonLabel,
  IonItem,
  IonCard,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
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
import { addMinutes, isBefore, isEqual } from "date-fns";
import useSchedules from "../composables/useSchedules";
import useMedics from "@/modules/patient/composables/useMedics";
import useAuth from "@/modules/auth/composables/useAuth";
import useOffices from "../composables/useOffices";
import { useRouter } from "vue-router";


const emit = defineEmits(["scheduleCreated"]);

const props = defineProps({
  dates: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

const { schedules, createSchedules, isLoading, errors } = useSchedules();
const { isLoading: isMedicLoading } = useMedics();
const { offices, getOffices } = useOffices();
const { toastMessage, alertMessage } = useUi();
const { auth } = useAuth();
const router = useRouter();
const {
  parseDate,
  parseIsoDatetime,
  parseIsoDatetimeWithoutTz,
  parseTime24,
  parseTime12,
  createIntervalsFromHours,
} = useUtilities();
// const schedule = ref<any>({});
const medic = ref<any>({});
const intervalHours = ref<string[]>([]);

const availableSlotDurations = computed(() => {
  return auth.value.global?.config?.slot_durations ?? [];
});

const slotDuration = computed(() => {
  const slot = 30;
  if (!auth.value) return slot;
  if (!auth.value.settings) return slot;
  if (!auth.value.settings.slotDuration) return slot;

  const hoursAsMinutes = parseInt(auth.value.settings.slotDuration.split(":")[0]) * 60;
  const minutes = parseInt(auth.value.settings.slotDuration.split(":")[1]);

  return (hoursAsMinutes + minutes);
});

const minTime = computed(() => {
  const time = "06:00:00";
  if (!auth.value) return time;
  if (!auth.value.settings) return time;

  return parseIsoDatetime(
    parseDate(props.dates[0]) + " " + auth.value.settings.minTime
  );
});

const maxTime = computed(() => {
  const time = "18:00:00";
  if (!auth.value) return time;
  if (!auth.value.settings) return time;

  return parseIsoDatetime(
    parseDate(props.dates[0]) + " " + auth.value.settings.maxTime
  );
});
const clinicSelected = ref<any>(null);
const form = ref<{
  dates: Array<any>;
  title: string;
  start: string;
  end: string;
  free_start: string;
  free_end: string;
  user_id: number | null;
  office_id: number | null;
  slotDuration: number;
}>({
  dates: props.dates,
  title: "Horario",
  start: "",
  end: "",
  free_start: "",
  free_end: "",
  user_id: auth.value.user.id,
  office_id: null,
  slotDuration: 0,
});
const schedulesToSave = ref<any[]>([]);

watch(slotDuration, (newValue) => {
  form.value.slotDuration = newValue;

}, { immediate: true });



const onSave = async () => {
  schedulesToSave.value = [];
  form.value.dates.forEach((scheduleDate) => {
    if (form.value.free_start && form.value.free_end) {

      const schedule1 = {
        office_id: form.value.office_id,
        start: form.value.start
          ? scheduleDate + "T" + parseTime24(form.value.start)
          : "",
        end: form.value.free_start
          ? scheduleDate + "T" + parseTime24(form.value.free_start)
          : "",
        date: scheduleDate,
        title: form.value.title,
        user_id: form.value.user_id,
      };

      const schedule2 = {
        office_id: form.value.office_id,
        start: form.value.free_end
          ? scheduleDate + "T" + parseTime24(form.value.free_end)
          : "",
        end: form.value.end
          ? scheduleDate + "T" + parseTime24(form.value.end)
          : "",
        date: scheduleDate,
        title: form.value.title,
        user_id: form.value.user_id,
      };

      const schedules = [schedule1, schedule2];

      schedules.forEach(schedule => {
        if (!isReserved(schedule.start, schedule.end)) {
          schedulesToSave.value.push(schedule);
        }

      });


    } else {

      const schedule = {
        office_id: form.value.office_id,
        start: form.value.start
          ? scheduleDate + "T" + parseTime24(form.value.start)
          : "",
        end: form.value.end
          ? scheduleDate + "T" + parseTime24(form.value.end)
          : "",
        date: scheduleDate,
        title: form.value.title,
        user_id: form.value.user_id,
      };

      if (!isReserved(schedule.start, schedule.end)) {
        schedulesToSave.value.push(schedule);
      }

    }



  });

  if (!form.value.dates.length) {
    toastMessage(
      "Selecciona al menos un dia en el calendario!!!",
      "danger"
    );
    return;
  }
  if (!schedulesToSave.value.length && form.value.dates.length) {
    toastMessage(
      "Horarios no validos. Parece que hay choque de horarios revisa!!!",
      "danger"
    );
    return;
  }

  const { ok, message, schedules } = await createSchedules(
    schedulesToSave.value,
    availableSlotDurations.value.find((slot: any) => slot.valueAsMinutes === form.value.slotDuration)?.value
  );
  if (!ok) alertMessage("Error", message);
  else {
    toastMessage("Cita Creada correctamente");

    emit("scheduleCreated", schedules);
  }
};

const isReserved = (startSchedule: string, endSchedule: string) => {
  for (let j = 0; j < schedules.value.length; j++) {
    if (
      schedules.value[j].end > startSchedule &&
      schedules.value[j].start < endSchedule
    ) {
      return true;
    }
  }

  return false;
};
const officesGPS = computed(() => {
  return offices.value.filter(o => o.utiliza_agenda_gps);
});
watch(clinicSelected, () => {
  form.value.title =
    officesGPS.value.find((x: any) => x.id == clinicSelected.value)?.name ??
    "Horario";
  form.value.office_id = clinicSelected.value;
});
const generateAvailableHours = () => {
  intervalHours.value = createIntervalsFromHours(
    props.dates[0],
    parseTime24(minTime.value),
    parseTime24(maxTime.value),
    form.value.slotDuration
  );
}
watch(
  () => form.value.slotDuration,
  () => {
    generateAvailableHours();
  });
const goToOffices = () => {
  router.push({ name: 'offices' });
};

onMounted(async () => {
  if (!auth.value.user?.offices_gps_count) {
    alertMessage(
      "Verifica tus consultorios",
      "Aun no tienes consultorios que utilizan la agenda de Doctor Blue, sin ellos no podras programar tu agenda",
      "Mis consultorios",
      goToOffices,
      true
    );

  }

  medic.value = auth.value.user; //await getMedic(auth.value.user.id);
  await getOffices();

  if (officesGPS.value.length == 1) {
    clinicSelected.value = officesGPS.value[0].id;
  }
  generateAvailableHours();

});
const scheduleDate = computed(() => props.dates.join(','));
const availableHours = computed(() => {
  const tempInvervalHours = intervalHours.value.filter(
    (_, index: number) => index != intervalHours.value.length - 1
  );

  return tempInvervalHours.map((item: string) => {
    const start = parseIsoDatetimeWithoutTz(props.dates[0] + " " + item);
    const endDate = addMinutes(new Date(start), form.value.slotDuration);
    const end = parseIsoDatetimeWithoutTz(endDate.toISOString());
    const startText = parseTime12(props.dates[0] + " " + item);
    const selectionStartDisabledEnd = isBefore(new Date(start), new Date(form.value.start)) || isEqual(new Date(start), new Date(form.value.start));

    return {
      text: startText,
      value: start,
      disabled: props.dates.length === 1 ? (isReserved(start, end) || selectionStartDisabledEnd) : selectionStartDisabledEnd,
    };
  });
});
const availableHoursFree = computed(() => {
  const tempInvervalHours = intervalHours.value.filter(
    (_, index: number) => index != intervalHours.value.length - 1
  );

  return tempInvervalHours.map((item: string) => {
    const start = parseIsoDatetimeWithoutTz(props.dates[0] + " " + item);
    const endDate = addMinutes(new Date(start), form.value.slotDuration);
    const end = parseIsoDatetimeWithoutTz(endDate.toISOString());
    const startText = parseTime12(props.dates[0] + " " + item);
    const selectionStartDisabledEnd = isBefore(new Date(start), new Date(form.value.start));
    const selectionFreeStartDisabledEnd = isBefore(new Date(start), new Date(form.value.free_start)) || isEqual(new Date(start), new Date(form.value.free_start));

    return {
      text: startText,
      value: start,
      disabled: props.dates.length === 1 ? (isReserved(start, end) || selectionStartDisabledEnd || selectionFreeStartDisabledEnd) : (selectionStartDisabledEnd || selectionFreeStartDisabledEnd),
    };
  });
});

</script>
