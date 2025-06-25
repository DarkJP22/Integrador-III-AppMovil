<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Citas</ion-title>
        <ion-buttons slot="end">

        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <ion-modal ref="modal" trigger="open-modal-activate" :initial-breakpoint="0.75" :breakpoints="[0, 0.75, 1]">
        <ion-content class="ion-padding">
          <IonList>
            <ion-list-header>
              <ion-label>Active este botón para indicar a los pacientes que pueden reservar citas el día hoy. <b>"Disponible Hoy"</b>. Inactive si ya no desea recibir más citas. <br>
                <b>Nota:La activación únicamente estará visible el día en curso</b></ion-label>

            </ion-list-header>
            <IonItem v-for="office in officesWithoutAgendaGps" :key="office.id">
              <IonLabel>{{ office.name }}</IonLabel>
              <IonButton color="primary" @click="onActivate(office.id)" :disabled="isLoading" v-if="!office.schedules_count">Activar</IonButton>
              <IonButton color="success" @click="onActivate(office.id, false)" :disabled="isLoading" v-else>Activado</IonButton>
            </IonItem>
          </IonList>

        </ion-content>
      </ion-modal> <ion-modal ref="modalTeleconsultation" trigger="open-modal-activate-teleconsultation" :initial-breakpoint="0.75" :breakpoints="[0, 0.75, 1]">
        <ion-content class="ion-padding">
          <IonList> <ion-list-header>
              <ion-label>Seleccione las horas en las que desea ofrecer teleconsultas el día de hoy. <b>"Solo teleconsulta"</b>.<br>
                <b>Nota: La activación únicamente estará visible el día en curso</b></ion-label>
            </ion-list-header>

            <!-- Legend for color codes -->
            <div class="legend-container ion-padding-horizontal">
              <div class="legend-item">
                <div class="legend-color" style="background-color: var(--ion-color-medium)"></div>
                <div class="legend-text">No seleccionada</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: var(--ion-color-primary)"></div>
                <div class="legend-text">Seleccionada</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: var(--ion-color-success)"></div>
                <div class="legend-text">Ya activada</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: var(--ion-color-danger)"></div>
                <div class="legend-text">Marcada para eliminar</div>
              </div>
            </div>
            <div v-for="office in offices" :key="office.id" class="office-hours-container">
              <IonItem>
                <IonLabel><b>{{ office.name }}</b></IonLabel>
              </IonItem>
              <IonItem>
                <IonInput label="Monto a cobrar por teleconsulta" labelPlacement="floating" type="number" min="0" step="0.01" v-model="teleconsultationFees[office.id]" placeholder="0.00" class="ion-margin-bottom">
                  <div slot="start">₡</div>
                </IonInput>
              </IonItem>
              <div class="hours-selection">
                <IonItem lines="none">
                  <IonLabel position="stacked">Horas disponibles:</IonLabel>
                </IonItem>
                <div class="hours-grid">
                  <IonButton v-for="hour in getWorkingHours()" :key="hour" size="small" :color="getHourButtonColor(office.id, hour)" @click="toggleHourSelection(office.id, hour)" class="hour-button">
                    {{ hour }}
                  </IonButton>
                </div>
              </div>
              <IonItem lines="none" class="ion-margin-top">
                <IonButton expand="block" color="primary" @click="activateTeleconsultationsForOffice(office.id)" :disabled="isLoading || (!hasSelectedHours(office.id))">
                  {{ getActiveTeleconsultationSchedules[office.id] ? 'Actualizar teleconsultas' : 'Activar teleconsultas' }}
                  <span v-if="teleconsultationFees[office.id] && teleconsultationFees[office.id] > 0">
                    - ₡{{ teleconsultationFees[office.id] }}
                  </span>
                </IonButton>
              </IonItem>
            </div>
          </IonList>
        </ion-content>
      </ion-modal>
      <!-- Default Segment -->
      <ion-grid class="mb-2">
        <ion-row class="ion-justify-content-center ion-align-items-center" color="primary">
          <ion-col class="text-center" size-md="6" size-lg="6">
            <ion-button color="tertiary" fill="solid" size="small" id="open-modal-activate" v-show="isEnableActivateAppointmentRequests">Activar Solicitudes</ion-button>
          </ion-col>
          <ion-col class="text-center" size-md="6" size-lg="6">
            <ion-button color="warning" fill="solid" size="small" id="open-modal-activate-teleconsultation"> <ion-icon :md="callSharp" :ios="callOutline"></ion-icon> Activar Teleconsulta</ion-button>
          </ion-col>
        </ion-row>

      </ion-grid>

      <ion-segment v-model="segmentCase">
        <ion-segment-button value="requests" v-show="officesDisableAgenda">
          <ion-label class="text-xs">Solicitudes <ion-badge slot="end" color="danger" class="" v-if="notificationsAppointmentRequests.length">{{ notificationsAppointmentRequests.length }}</ion-badge></ion-label>
        </ion-segment-button>
        <ion-segment-button value="appointments" v-show="enableAgenda">
          <ion-label class="text-xs">Reservadas <ion-badge slot="end" color="danger" class="" v-if="notificationsAppointments.length">{{ notificationsAppointments.length }}</ion-badge></ion-label>
        </ion-segment-button>
        <ion-segment-button value="teleconsultations" v-show="enableAgenda">
          <ion-label class="text-xs">Teleconsultas <ion-badge slot="end" color="danger" class="" v-if="notificationsTeleconsultations.length">{{ notificationsTeleconsultations.length }}</ion-badge></ion-label>
        </ion-segment-button>
      </ion-segment>
      <div v-show="segmentCase == 'requests'" class="">
        <AppointmentRequestsList />
      </div>
      <div v-show="segmentCase == 'appointments'" class="">
        <AppointmentsList />
      </div>
       <div v-show="segmentCase == 'teleconsultations'" class="">
        <TeleconsultationsList />
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonButton,
  IonModal,
  IonList,
  IonListHeader,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonInput,
  //onIonViewDidEnter
} from "@ionic/vue";

import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import AppointmentsList from "../components/AppointmentsList.vue";
import AppointmentRequestsList from "../components/AppointmentRequestsList.vue";
import useAppointments from "../composables/useAppointments";
import useAppointmentRequests from "../composables/useAppointmentRequests";
import useAuth from "@/modules/auth/composables/useAuth";
import useOffices from "../composables/useOffices";
import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";
import useUtilities from "@/composables/useUtilities";
import { callSharp, callOutline } from "ionicons/icons";
import useTeleconsultations from "../composables/useTeleconsultations";
import TeleconsultationsList from "../components/TeleconsultationsList.vue";
const { parseTime24 } = useUtilities();
const { enableAgenda, officesDisableAgenda } = useAuth();
const { offices, activateAppointmentRequestsToday, activateTeleconsultationsToday, isLoading, getOffices } = useOffices();
const { currentChannel } = useMyBroadcastEvents();
const segmentCase = officesDisableAgenda.value ? ref("requests") : ref("appointments");
const selectedHours = ref<{ [key: number]: string[] }>({});
const teleconsultationFees = ref<{ [key: number]: number }>({});
const {
  clearNotifications,
  notificationsAppointments,
  addNotification
} = useAppointments();
const {
  clearNotifications: clearNotificationsRequests,
  notificationsAppointmentRequests,
  addNotification: addNotificationAppointmentRequest
} = useAppointmentRequests();

const {
  clearNotifications: clearNotificationsTeleconsultations,
  notificationsTeleconsultations,
  addNotification: addNotificationTeleconsultation
} = useTeleconsultations();

const modal = ref();
const modalTeleconsultation = ref();

watch(segmentCase, () => {
  if (segmentCase.value === 'requests') clearNotificationsRequests();
  if (segmentCase.value === 'appointments') clearNotifications();
  if (segmentCase.value === 'teleconsultations') clearNotificationsTeleconsultations();
}, { immediate: true });

const officesWithoutAgendaGps = computed(() => {
  return offices.value.filter(office => !office.utiliza_agenda_gps);
});

const isEnableActivateAppointmentRequests = computed(() => {
  return officesWithoutAgendaGps.value.length > 0;
});

// Filter schedules that have "Teleconsulta" in their title
const getActiveTeleconsultationSchedules = computed(() => {
  const result: { [key: number]: string[] } = {};

  offices.value.forEach(office => {
    if (office.schedules && Array.isArray(office.schedules)) {
      // Filter today's teleconsultation schedules
      const teleconsultations = office.schedules.filter(
        (schedule: any) => schedule.title && schedule.title.toLowerCase().includes('teleconsulta')
      );


      if (teleconsultations.length > 0) {
        // Extract the hours from each teleconsultation schedule
        result[office.id] = teleconsultations.map((schedule: any) => {
          // Assuming the hour is in the format HH:00
          const time = schedule.start || '';

          return parseTime24(time).substring(0, 5); // Extract HH:00 from the time string
        });
      }
    }
  });

  return result;
});

async function onActivate(officeId: number, activate = true) {
  const { ok } = await activateAppointmentRequestsToday(officeId, activate);
  if (ok) {
    modal.value.$el.dismiss(null, 'confirm');
    getOffices();
  }

}

// Generate working hours from 8 AM to 5 PM (adjust as needed for doctor's schedule)
const getWorkingHours = () => {
  const hours = [];
  for (let i = 8; i <= 17; i++) {
    hours.push(`${i}:00`);
  }
  return hours;
};

// Toggle hour selection for an office
const toggleHourSelection = (officeId: number, hour: string) => {
  // Initialize the selected hours array for this office if it doesn't exist
  if (!selectedHours.value[officeId]) {
    selectedHours.value[officeId] = [];
  }

  // Check if this hour is in existing schedules
  const isInSchedule = getActiveTeleconsultationSchedules.value[officeId]?.includes(hour) || false;

  // Check if this hour is already in user selections
  const index = selectedHours.value[officeId].indexOf(hour);

  if (isInSchedule) {

    const index = selectedHours.value[officeId].indexOf(hour + ":remove");
    // If the hour is in a schedule, we need to explicitly remove it
    if (index === -1) {
      // Add it to selected hours with a "remove" flag (we'll handle this in the activation process)
      selectedHours.value[officeId].push(hour + ":remove");
    } else {
      // If it's already in selected hours, remove it (cancel the remove operation)
      selectedHours.value[officeId].splice(index, 1);
    }
  } else {
    // Regular toggle for non-scheduled hours
    if (index === -1) {
      // Add it to selected hours
      selectedHours.value[officeId].push(hour);
    } else {
      // Remove it from selected hours
      selectedHours.value[officeId].splice(index, 1);
    }
  }
};

// Check if any hours are selected for an office
const hasSelectedHours = (officeId: number) => {
  // Check if there are user-selected hours
  const hasUserSelected = selectedHours.value[officeId]?.length > 0 || false;

  // Check if there are existing teleconsultation schedules
  const hasScheduled = getActiveTeleconsultationSchedules.value[officeId]?.length > 0 || false;

  // Return true if there are either user-selected hours or existing schedules
  return hasUserSelected || hasScheduled;
};

// Activate teleconsultations for a specific office
const activateTeleconsultationsForOffice = async (officeId: number) => {
  // Get existing teleconsultation hours
  const existingHours = getActiveTeleconsultationSchedules.value[officeId] || [];

  // Get user-selected hours and process them
  const userSelectedHours: string[] = [];
  const hoursToRemove: string[] = [];

  // Process user selections to separate additions and removals
  (selectedHours.value[officeId] || []).forEach(selection => {
    if (selection.endsWith(':remove')) {
      // This is a request to remove a scheduled hour
      const hourToRemove = selection.replace(':remove', '');
      hoursToRemove.push(hourToRemove);
    } else {
      // This is a regular hour selection
      userSelectedHours.push(selection);
    }
  });

  // Create the final hours list by:
  // 1. Starting with existing hours
  // 2. Removing any hours marked for removal
  // 3. Adding any new user-selected hours
  const finalHours = [
    ...existingHours.filter(hour => !hoursToRemove.includes(hour)),
    ...userSelectedHours.filter(hour => !existingHours.includes(hour))
  ];
  if (finalHours.length === 0 && hoursToRemove.length === 0) {
    return;
  }

  const fee = teleconsultationFees.value[officeId] || 0;
  const { ok } = await activateTeleconsultationsToday(officeId, finalHours, fee);
  if (ok) {
    modalTeleconsultation.value.$el.dismiss(null, 'confirm');
    // Clear selected hours for this office
    selectedHours.value[officeId] = [];
    await getOffices();
  }
};

// Get the appropriate color for hour buttons
const getHourButtonColor = (officeId: number, hour: string) => {
  // Is this hour in existing schedules?

  const isInSchedule = getActiveTeleconsultationSchedules.value[officeId]?.includes(hour) || false;

  // Check if this hour is marked for removal
  const isMarkedForRemoval = selectedHours.value[officeId]?.includes(hour + ':remove') || false;

  // Is this hour in user selections?
  const isSelected = selectedHours.value[officeId]?.includes(hour) || false;

  if (isInSchedule && isMarkedForRemoval) {
    // Scheduled but marked for removal
    return 'danger';
  } else if (isInSchedule) {
    // Already scheduled teleconsultation
    return 'success';
  } else if (isSelected) {
    // Newly selected by user
    return 'primary';
  } else {
    // Not selected
    return 'medium';
  }
};

onMounted(async () => {
  currentChannel.value?.listen('AppointmentRequestCreatedEvent', (data: any) => {
    addNotificationAppointmentRequest(data.appointmentRequest);
  }).listen('AppointmentCreatedEvent', (data: any) => {
    addNotification(data.appointment);
  })
  .listen('TeleconsultationCreatedEvent', (data: any) => {
    addNotificationTeleconsultation(data.teleconsultation);
  });
  await getOffices();
  offices.value.forEach(office => {
    // Initialize teleconsultation fees for each office
    teleconsultationFees.value[office.id] = office.settings?.teleconsultation_fee || 0;
  });
});
onUnmounted(() => {
  currentChannel.value?.stopListening('AppointmentRequestCreatedEvent');
  currentChannel.value?.stopListening('AppointmentCreatedEvent');
});

</script>

<style scoped>
.hours-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
  padding: 0 16px;
}

.hour-button {
  flex: 0 0 auto;
  margin: 4px;
}

.office-hours-container {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--ion-color-light);
  padding-bottom: 16px;
}

.legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 10px 0;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 5px;
}

.legend-text {
  font-size: 12px;
}
</style>
