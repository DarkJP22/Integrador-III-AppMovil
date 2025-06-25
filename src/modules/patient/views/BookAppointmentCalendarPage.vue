<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Reservar Cita </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" router-link="/patient/home">Cerrar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="overlay-calendar" v-if="loadingCalendar">
        <ion-item slot="start" lines="none">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <label> Cargando...</label></ion-item>
      </div>
      <ion-item color="secondary" lines="none" class="ion-text-center">
        <ion-label class="ion-text-wrap">

          <p class="agenda-message">
            Seleccione la fecha en la que desea reservar su cita
          </p>
        </ion-label>
      </ion-item>
      <div class="calendar-symbology">

        <div class="symb">
          <span class="symb-no-available"></span>
          <p>Dias No disponibles</p>
        </div>
        <div class="symb">
          <span class="symb-available"></span>
          <p>Dias Disponibles</p>
        </div>
      </div>
      <div class="calendar-wrap">
        <ion-popover :is-open="popoverOpen" @didDismiss="popoverOpen = false">
          <ion-content class="ion-padding">

            <p>Seleccione la fecha en la que desea reservar su cita</p>
            <div class="calendar-symbology">

              <div class="symb">
                <span class="symb-no-available"></span>
                <p>Dias No disponibles</p>
              </div>
              <div class="symb">
                <span class="symb-available"></span>
                <p>Dias Disponibles</p>
              </div>
            </div>

            <div class="ion-text-center ion-margin-top">
              <ion-button @click="popoverOpen = false" size="small">Ok</ion-button>
            </div>
          </ion-content>
          <ion-item>
            <ion-checkbox label-placement="end" slot="start" @ion-change="onSkipCheck"><small>No volver a mostrar</small></ion-checkbox>
          </ion-item>
        </ion-popover>
        <div class="ion-text-center clinicName">
          <h4>{{ clinicName || '...' }}</h4>
        </div>
        <FullCalendar ref="calendar" :options="calendarOptions" />
      </div>
      <ion-modal :is-open="isOpenRef" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Cita</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)" :disabled="isLoading">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="">
          <NextAppointment v-if="appointment.id" :appointment="appointment" @appointmentDeleted="setOpen(false)" />
          <NewAppointment v-else :medic-id="filters.medicId" :office-id="filters.officeId" :date="selectedDate" :patients="patients" @appointmentCreated="summaryAppointment" />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
//import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { CalendarApi, DayCellContentArg, EventInput } from "@fullcalendar/core";
// import startOfMonth from "date-fns/startOfMonth";
// import endOfMonth from "date-fns/endOfMonth";
import useUtilities from "@/composables/useUtilities";
import NextAppointment from "@/modules/patient/components/NextAppointment.vue";
import NewAppointment from "@/modules/patient/components/NewAppointment.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
  IonModal,
  IonSpinner,
  IonItem,
  IonLabel,
  IonPopover,
  IonCheckbox,
  CheckboxCustomEvent
} from "@ionic/vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import useSchedules from "../composables/useSchedules";
import useAppointments from "../composables/useAppointments";
import usePatients from "../composables/usePatients";
import useMedics from "../composables/useMedics";
import useMyStorage from "@/composables/useMyStorage";
import useUi from "@/composables/useUi";

const route = useRoute();
const { getSchedules, schedules } = useSchedules();
const { getMedic } = useMedics();
const {
  getAppointmentsByMedicAndClinic,
  medicAppointments,
  getAppointment,
  isLoading,
} = useAppointments();
const { patients } = usePatients();
const { parseDate } = useUtilities();
const { setItem, getItem } = useMyStorage();
const { alertMessage } = useUi();
const { medicId, officeId } = route.params;
const calendar = ref<any>();
const calendarApi = ref<CalendarApi>();
const appointment = ref<any>({});
const isOpenRef = ref(false);
const showCalendarHelpPopup = ref(true);
const loadingCalendar = ref(true);
const selectedDate = ref("");
const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  appointment.value = {};
};
const popoverOpen = ref(false);
const medic = ref<any>({});

const filters = ref({
  medicId: parseInt(medicId.toString()),
  officeId: parseInt(officeId.toString()),
  date1: "",
  date2: "",
  order: "start",
  dir: "asc"
});

const availableDays = computed(() =>
  schedules.value.map((sch) => parseDate(sch.date))
);
//const userAppointments:EventInput[] = [];
const userAppointments = computed<EventInput[]>(() => {

  const patientIds = patients.value.map((pat: any) => pat.id);

  const appointments = medicAppointments.value.filter((appo: EventInput) => {
    return patientIds.includes(appo.patient_id);
  });

  return appointments.map((appo: EventInput) => {
    return {
      id: appo.id,
      title: "Cita", //appo.title,
      start: appo.start,
      end: appo.end,
      allDay: appo.allDay,
      patient_id: appo.patient_id,
      office_id: appo.office_id,
      backgroundColor: appo.backgroundColor,
      borderColor: appo.borderColor,
    };
  });
});
const summaryAppointment = async (appo: any) => {
  appointment.value = appo;
};
const handleDateClick = (dayInfo: any) => {
  if (dayInfo.dayEl.classList.contains("disabled-day")) {
    alertMessage('Dia no disponible', 'Selecciona un dia disponible para poder reservar');
    return;
  }
  selectedDate.value = dayInfo.dateStr;
  isOpenRef.value = true;
};

const handleEventClick = async (eventInfo: any) => {
  appointment.value = await getAppointment(eventInfo.event.id);
  isOpenRef.value = true;
};

const handleMonthChange = (data: any) => {
  
  filters.value.date1 = parseDate(data.startStr);
  filters.value.date2 = parseDate(data.endStr);
};
const calendarOptions = ref<any>({
  height: "auto",
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locale: esLocale,
  //initialView: "dayGridMonth",
  headerToolbar: {
    start: "title", // will normally be on the left. if RTL, will be on the right
    center: "",
    end: "today,prev,next", // will normally be on the right. if RTL, will be on the left
  },
  events: userAppointments,
  titleFormat: { year: "numeric", month: "short" },
  displayEventTime: true,
  dayMaxEventRows: 2,
  //eventDisplay: "block",
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  datesSet: handleMonthChange,
  dayCellClassNames: (arg: DayCellContentArg) => {
    if (
      !availableDays.value.includes(parseDate(arg.date.toISOString())) ||
      arg.isPast
    ) {
      return ["fc-day-disabled", "disabled-day"];
    }
  },
});

const initCalendar = () => {
  if (!calendar.value) {
    loadingCalendar.value = false;
    return;
  }

  calendarApi.value = calendar.value.getApi();

  setTimeout(() => {
    calendar.value.getApi().render();
    calendarApi.value?.today();
    loadingCalendar.value = false;
    if (showCalendarHelpPopup.value)
      popoverOpen.value = true;

  }, 100);
};

watch(filters.value, async () => {
  await getSchedules(filters.value);
  await getAppointmentsByMedicAndClinic(filters.value);
});

const clinicName = computed(() => {
  if (!medic.value.offices) return '';
  return medic.value?.offices.find((office: any) => office.id === +officeId)?.name
});
onMounted(async () => {
  // const date = new Date();
  // filters.value.date1 = parseDate(startOfMonth(date).toISOString());
  // filters.value.date2 = parseDate(endOfMonth(date).toISOString());

  // await getSchedules(filters.value);
  // await getAppointmentsByMedicAndClinic(filters.value);

  const resp = await getItem('skipCalendarReservationHelpPopup')
  if (resp) {
    showCalendarHelpPopup.value = false;
  }
  initCalendar();
  medic.value = await getMedic(parseInt(medicId.toString()));
});

function onSkipCheck(evt: CheckboxCustomEvent) {
  if (evt.detail.checked) {
    showCalendarHelpPopup.value = false;
    setItem('skipCalendarReservationHelpPopup', false);
  }
}

</script>
<style>
.calendar-wrap {
  margin-top: 1rem;
  position: relative;
}

.clinicName {
  min-height: 20px;
  margin-bottom: 15px;
}
</style>
