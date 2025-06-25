<template>
  <ion-item @click="showDetails" lines="full" detail>
    <ion-avatar slot="start" class="avatar">
      <img :src="avatar" />
      <!-- <ion-badge color="primary" v-if="medic.accumulated_affiliation"><ion-icon :md="starSharp" :ios="starOutline"></ion-icon></ion-badge> -->
    </ion-avatar>

    <ion-label>
      <h3>
        {{ lab.name }}
      </h3>
 
   
      <p>
        {{  getDistrictName(lab.province, lab.canton, lab.district) }}
      </p>

      <!-- <p>
       
        <span v-if="lab.distance">({{ approxDistance }})</span>
      </p> -->
   
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import useProvinces from "@/composables/useProvinces";
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

const { getDistrictName } = useProvinces();

const props = defineProps({
  lab: {
    type: Object,
    required: true,
  },
});


const router = useRouter();


const approxDistance = computed(() => {
  return "Aprox. " + Math.round(props.lab.distance) + " km";
});




const avatar = computed(() => {
  return props.lab.logo_path
    ? props.lab.logo_path
    : "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(props.lab.name) +
    "&color=14B0A5&background=DEF4F2";
});

const showDetails = () => {
  router.push({ name: "lab-details", params: { id: props.lab.id } });
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
