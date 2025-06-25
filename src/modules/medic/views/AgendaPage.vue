<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Agenda </ion-title>
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
            Selecciona el día para programar tu agenda. Puedes seleccionar varios días a la vez, seleccionando un día y arrastrando hacia los demás días.
          </p>
        </ion-label>
      </ion-item>
      <div class="calendar-symbology mt-2">
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

            <p>Seleccione la fecha en la que desea programar su agenda. Puedes seleccionar varios días a la vez, seleccionando un día y arrastrando hacia los demas días.</p>
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
            <ion-checkbox slot="start" @ion-change="onSkipCheck" labelPlacement="end"><small>No volver a mostrar</small></ion-checkbox>

          </ion-item>
        </ion-popover>
        <FullCalendar ref="calendar" :options="calendarOptions" />
      </div>
      <ion-modal :is-open="isOpenRef" @didDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Horario Programado</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)" :disabled="isLoading">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="">
          <ScheduleDetails v-if="schedule.id" :schedule="schedule" @scheduleDeleted="setOpen(false)" />
          <NewSchedule v-else-if="selectedDate.length" :dates="selectedDate" @scheduleCreated="setOpen(false)" />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
//import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { CalendarApi } from "@fullcalendar/core";
// import startOfMonth from "date-fns/startOfMonth";
// import endOfMonth from "date-fns/endOfMonth";
import useUtilities from "@/composables/useUtilities";
import ScheduleDetails from "@/modules/medic/components/ScheduleDetails.vue";
import NewSchedule from "@/modules/medic/components/NewSchedule.vue";

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
import useSchedules from "@/modules/medic/composables/useSchedules";
import useAuth from "@/modules/auth/composables/useAuth";
import useMyStorage from "@/composables/useMyStorage";
import useUi from "@/composables/useUi";
import { useRouter } from "vue-router";

const { getSchedules, getSchedule, schedules, isLoading } = useSchedules();
const { auth } = useAuth();
const router = useRouter();
const { parseDate, createIntervalsDates } = useUtilities();
const { alertMessage } = useUi();
const { getItem, setItem } = useMyStorage();

const calendar = ref<any>();
const calendarApi = ref<CalendarApi>();
const schedule = ref<any>({});
const isOpenRef = ref(false);
const loadingCalendar = ref(true);
const selectedDate = ref<any[]>([]);
const setOpen = (state: boolean) => {
  isOpenRef.value = state;
  schedule.value = {};
};
const popoverOpen = ref(false);
const showCalendarHelpPopup = ref(true);
const filters = ref({
  medicId: auth.value.user.id,
  date1: "",
  date2: "",
});


const medicSchedules = computed(() => {
  // const schedules = medicAppointments.value.filter((appo: any) => {
  //   return patientIds.includes(appo.patient_id);
  // });

  return schedules.value.map((sche: any) => {
    return {
      id: sche.id,
      title: sche.title,
      start: sche.start,
      end: sche.end,
      allDay: sche.allDay,
      office_id: sche.office_id,
      backgroundColor: sche.backgroundColor,
      borderColor: sche.borderColor,
    };
  });
});
// const summarySchedule = async (sche: any) => {
//   schedule.value = sche;
// };
const handleDateClick = (dayInfo: any) => {
  if (dayInfo.dayEl.classList.contains("disabled-day")) {
    return;
  }
  selectedDate.value = [dayInfo.dateStr];
  isOpenRef.value = true;
};

const handleEventClick = async (eventInfo: any) => {
  schedule.value = await getSchedule(eventInfo.event.id);
  isOpenRef.value = true;
};

const handleDatesSelect = (selectionInfo: any) => {
  // if (selectionInfo.dayEl.classList.contains("disabled-day")) {
  //   return;
  // }

  const dates = createIntervalsDates(
    selectionInfo.startStr,
    selectionInfo.endStr
  );
  selectedDate.value = dates.slice(0, dates.length - 1);
  isOpenRef.value = true;
};

const handleMonthChange = (data: any) => {

  filters.value.date1 = parseDate(data.startStr);
  filters.value.date2 = parseDate(data.endStr);
};

const calendarOptions = ref<any>({
  height: "auto",
  plugins: [dayGridPlugin, interactionPlugin],
  locale: esLocale,
  initialView: "dayGridMonth",
  headerToolbar: {
    start: "title", // will normally be on the left. if RTL, will be on the right
    center: "",
    end: "prev,next", // will normally be on the right. if RTL, will be on the left
  },
  titleFormat: { year: "numeric", month: "short" },
  events: medicSchedules,
  displayEventTime: false,
  eventDisplay: "block",
  selectable: true,
  select: handleDatesSelect,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  datesSet: handleMonthChange,
  dayCellClassNames: (arg: any) => {
    if (arg.isPast) {
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
    if (showCalendarHelpPopup.value)
      popoverOpen.value = true;
  });
};

watch(filters.value, async () => {
  await getSchedules(filters.value);
});
const goToCreateOffice = () => {
  router.push({ name: 'office', params: { id: 'new' } });
};
const goToOffices = () => {
  router.push({ name: 'offices' });
};
onMounted(async () => {
  //const date = new Date();
  // filters.value.date1 = parseDate(startOfMonth(date).toISOString());
  // filters.value.date2 = parseDate(endOfMonth(date).toISOString());

  // await getSchedules(filters.value);
  if (!auth.value.user?.offices_count) {
    alertMessage(
      "Completar Perfil",
      "Aun no tienes consultorios",
      "Registrar Mi Consultorio",
      goToCreateOffice,
      true
    );
  } else if (!auth.value.user?.offices_gps_count) {
    alertMessage(
      "Verifica tus consultorios",
      "Aun no tienes consultorios que utilizan la agenda de Doctor Blue, sin ellos no podras programar tu agenda",
      "Mis consultorios",
      goToOffices,
      true
    );

    return;
  }

  const resp = await getItem('skipCalendarScheduleHelpPopup')
  if (resp) {
    showCalendarHelpPopup.value = false;
  }
  initCalendar();
});

function onSkipCheck(evt: CheckboxCustomEvent) {
  if (evt.detail.checked) {
    showCalendarHelpPopup.value = false;
    setItem('skipCalendarScheduleHelpPopup', false);
  }
}

</script>
<style scoped>
.calendar-wrap {
  margin-top: 1rem;
  position: relative;
}
</style>
