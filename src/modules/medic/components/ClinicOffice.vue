<template>
  <ion-card>
    <ion-item>
      <ion-icon :md="homeSharp" :ios="homeOutline" slot="start"></ion-icon>
      <ion-label>{{ office.name }}</ion-label>
    </ion-item>

    <ion-item>
      <ion-icon :md="mapSharp" :ios="mapOutline" slot="start"></ion-icon>
      <ion-label>{{ location }}</ion-label>
    </ion-item>
    <ion-item>
      <ion-icon :md="locationSharp" :ios="locationOutline" slot="start"></ion-icon>
      <ion-label>{{ office.address }}</ion-label>
    </ion-item>

    <ion-item>
      <ion-icon :md="callSharp" :ios="callOutline" slot="start"></ion-icon>
      <ion-label>{{ office.phone }}</ion-label>
    </ion-item>
    <ion-item v-if="office.lat && office.lon">
      <ion-icon :md="locateSharp" :ios="locateOutline" slot="start"></ion-icon>
      <ion-label>Lat: {{ office.lat }}</ion-label>
    </ion-item>
    <ion-item v-if="office.lat && office.lon">
      <ion-icon :md="locateSharp" :ios="locateOutline" slot="start"></ion-icon>
      <ion-label>Lng: {{ office.lon }}</ion-label>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import useProvinces from "@/composables/useProvinces";
import { IonLabel, IonIcon, IonItem, IonCard } from "@ionic/vue";
import {
  callSharp,
  callOutline,
  homeSharp,
  homeOutline,
  locationSharp,
  locationOutline,
  mapSharp,
  mapOutline,
  locateSharp,
  locateOutline,
} from "ionicons/icons";

import { computed, onMounted } from "vue";


const props = defineProps({
  office: {
    type: Object,
    required: true,
  },
});

const { cantones, distritos, loadCantones, loadDistricts } = useProvinces();

const location = computed(() => {
  return (
    props.office.provinceName +
    ", " +
    (cantones.value.find((c) => c.id == props.office.canton)?.title ?? "") +
    ", " +
    (distritos.value.find((d) => d.id == props.office.district)?.title ??
      "")
  );
});

onMounted(async () => {
  loadCantones(props.office.province);
  loadDistricts(props.office.canton);
});


</script>
