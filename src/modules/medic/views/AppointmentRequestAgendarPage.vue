<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Agendar Solicitud</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="overlay-calendar" v-if="loadingCalendar || isLoading">
        <ion-item slot="start" lines="none">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <label> Cargando...</label></ion-item>
      </div>
      <AppointmentRequestPatientInfo v-if="appoRequest?.id" :appointment-request="appoRequest" />
      <div class="calendar-wrap">
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
          <NewAppointmentRequest :appointment-request="appointment" :event-appointment-requests="medicAppointmentRequests" :medic-id="filters.medicId" :office-id="filters.officeId" :date="selectedDate" :patient="patient" :office="office" @appointmentRequestUpdated="summaryAppointment" :is-edit="isEdit" />
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
import useUtilities from "@/composables/useUtilities";
import NewAppointmentRequest from "@/modules/medic/components/NewAppointmentRequest.vue";
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
} from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAppointmentRequestsByMedicAndClinic from "../composables/useAppointmentRequestsByMedicAndClinic";
import { Patient } from "@/interfaces/patients";
import { useIonRouter } from '@ionic/vue';
import AppointmentRequestPatientInfo from "../components/AppointmentRequestPatientInfo.vue";
import useAppointmentRequest from "../composables/useAppointmentRequest";

const route = useRoute();
const router = useRouter();
const ionRouter = useIonRouter();
const { id, medicId, officeId } = route.params;
const selectedAppointmentRequestId = ref(+id);
const {
  filters,
  medicAppointmentRequests,
  isLoading,
} = useAppointmentRequestsByMedicAndClinic(+medicId, +officeId);
const { appointmentRequest } = useAppointmentRequest(selectedAppointmentRequestId);

const { parseDate } = useUtilities();
const calendar = ref<any>();
const calendarApi = ref<CalendarApi>();
//const appointment = ref<any>({});
const isOpenRef = ref(false);
const loadingCalendar = ref(true);
const selectedDate = ref("");
const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  // appointment.value = {};
  selectedDate.value = "";
};
const appoRequest = computed(() => appointmentRequest.value);
const appointment = computed(() => appointmentRequest.value);
const patient = computed<Patient>(() => appointmentRequest.value?.patient);
const office = computed(() => appointmentRequest.value?.office);

const isEdit = computed(() =>
  !!appoRequest.value?.scheduled_date
);

const userAppointments = computed<EventInput[]>(() => {
  return medicAppointmentRequests.value.map((appo: EventInput) => {
    return {
      id: appo.id,
      title: "Cita", //appo.title,
      start: appo.start,
      end: appo.end,
      allDay: 0,
      patient_id: appo.patient_id,
      office_id: appo.office_id,
      backgroundColor: '#374850',
      borderColor: '#374850',
    };
  });
});
const summaryAppointment = async (appo: any) => {
  //appointment.value = appo;
  setOpen(false);


  ionRouter.canGoBack(2) ? router.go(-2) : ionRouter.replace({ name: 'medic-home' });

};
const handleDateClick = async (dayInfo: any) => {
  if (dayInfo.dayEl.classList.contains("disabled-day")) {
    return;
  }
  selectedAppointmentRequestId.value = +id;
  // appointment.value = appointmentRequest.value; //await getAppointmentRequest(+id);
  selectedDate.value = dayInfo.dateStr;
  isOpenRef.value = true;
};

const handleEventClick = async (eventInfo: any) => {


  selectedAppointmentRequestId.value = eventInfo.event.id
  // appointment.value = appointmentRequest.value;
  isOpenRef.value = true;
};

const handleMonthChange = (data: any) => {

  filters.value.date1 = null;
  filters.value.date2 = null;
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
      arg.isPast
    ) {
      return ["fc-day-disabled", "disabled-day"];
    }
    return [];
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
  });
};


onMounted(async () => {
  initCalendar();
});


</script>
<style scoped>
.calendar-wrap {
  margin-top: 1rem;
  position: relative;

}

/* .overlay-calendar {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  z-index: 4;
  display: grid;
  place-content: center;
}
@media (prefers-color-scheme: dark) {
  .overlay-calendar {
    background-color: var(--ion-color-light);
  }
}

.fc-header-toolbar {
  padding: 0 0.5rem;
}

.fc .fc-button {
  padding: 1px 6px !important;
}

.fc .fc-day-today.fc-day-disabled {
  background-color: var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3));
} */

/* a {
  background-color: transparent;
  color: var(--ion-color-primary, #3880ff);
} */
</style>
