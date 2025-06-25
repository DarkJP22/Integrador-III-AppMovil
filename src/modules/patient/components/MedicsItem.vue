<template>
  <ion-item @click="showDetails" lines="full" detail>
    <ion-avatar slot="start" class="avatar">
      <img :src="avatar" />
      <!-- <ion-badge color="primary" v-if="medic.accumulated_affiliation"><ion-icon :md="starSharp" :ios="starOutline"></ion-icon></ion-badge> -->
    </ion-avatar>

    <ion-label>
      <h3>
        {{ medicName }}
      </h3>
      <ion-note color="primary" class="specialities"><span v-for="(speciality, index) in specialities" :key="speciality + index">{{ speciality }}</span></ion-note>

      <p>
        <MedicsItemOfficesPlaces :offices="medic.offices" />
      </p>
      <p class="flex gap-2">
        <MedicAvailableToday :settings="medic.settings" :schedules="medic.schedules" :appointments="medic.appointments" />
        <MedicAvailableTeleconsultationToday :settings="medic.settings" :schedules="medic.schedules" :appointments="medic.appointments" />
      </p>
      <!-- <p v-if="medic.office_name">
        {{ medic.office_name }}
        <span v-if="medic.distance">({{ approxDistance }})</span>
      </p> -->

    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonItem,
  IonAvatar,
  IonNote,
  // IonBadge,
  // IonIcon,
} from "@ionic/vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import MedicsItemOfficesPlaces from "./MedicsItemOfficesPlaces.vue";
import MedicAvailableToday from "./MedicAvailableToday.vue";
import MedicAvailableTeleconsultationToday from "./MedicAvailableTeleconsultationToday.vue";

const props = defineProps({
  medic: {
    type: Object,
    required: true,
  },
});


const router = useRouter();

const medicName = computed(() => {
  const prefix = props.medic?.type_of_health_professional === 'medico' ? 'Dr(a).' : 'Lic.';
  return `${prefix} ${props.medic?.name}`;
});

// const approxDistance = computed(() => {
//   return "Aprox. " + Math.round(props.medic.distance) + " km";
// });

const specialities = computed(() => {
  if (!props.medic.specialities.length) {
    return props.medic.type_of_health_professional === 'medico' ? ["Médico General"] : '';
  }
  return props.medic.specialities.map((s: any) => s.name);
});


const avatar = computed(() => {
  return props.medic.avatar_path
    ? props.medic.avatar_path
    : "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(props.medic.name) +
    "&color=14B0A5&background=DEF4F2";
});

const showDetails = () => {
  router.push({ name: "medic-details", params: { id: props.medic.id } });
};






</script>
<style scoped>
.avatar {
  position: relative;
  width: 40px;
  height: 40px;

}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

ion-note.specialities {
  font-weight: bold;
  font-size: 16px;
}

ion-note.specialities span {
  padding-right: .5rem;
}

ion-note.specialities span:last-child {
  padding-right: 0;
}

.avatar ion-badge {
  position: absolute;
  bottom: -10px;
  left: 0;
}
</style>
