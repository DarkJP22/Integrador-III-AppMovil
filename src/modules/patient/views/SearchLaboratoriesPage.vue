<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Busqueda de laboratorios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
      <div class="ion-text-center ion-margin-bottom">
        <div class="ion-padding-horizontal">
          <ion-range aria-label="Kilometros" :ticks="true" :pin="true" :snaps="true" :min="10" :step="5" :max="100" v-model="filters.radius" class="rangeKm" :disabled="!!filters.q || !!filters.province"></ion-range>
        </div>
        <ion-text class="ion-center" :color="(!filters.q && !filters.province) ? 'primary' : 'light'">Cercanía: {{ filters.radius }} Km</ion-text> <br>
        <ion-text class="ion-center" :color="(!filters.q && !filters.province) ? 'dark' : 'light'"> <small>Tu ubicación: {{ filters.lat }}, {{ filters.lon }}</small></ion-text>
      </div>

      <ion-accordion-group>
        <ion-accordion :toggleIcon="chevronForwardOutline">
          <ion-item slot="header" color="light">
            <ion-icon :md="filterSharp" :ios="filterOutline" slot="start"></ion-icon>
            <ion-label>BÚSQUEDA AVANZADA</ion-label>
            <ion-button color="secondary" v-if="anyFilterSelected" @click.prevent.self="clearFilters"><ion-icon slot="start" :md="closeSharp" :ios="closeOutline"></ion-icon>
              Limpiar
            </ion-button>
          </ion-item>

          <ion-list slot="content" class="filters-list">
            
           
            <ion-item lines="full" color="light">

              <ion-select label="Provincia" v-model="filters.province" @ionChange="onChangeProvince($event)">
                <ion-select-option value=""></ion-select-option>
                <ion-select-option :value="province.id" v-for="province in provincias" :key="province.id">
                  {{ province.title }}</ion-select-option>
                <ion-select-option value="99"> test</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item lines="full" color="light">
              <ion-select label="Cantón" v-model="filters.canton" @ionChange="onChangeCanton($event)">
                <ion-select-option value=""></ion-select-option>
                <ion-select-option :value="canton.id" v-for="canton in cantones" :key="canton.id">
                  {{ canton.title }}</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item lines="full" color="light">
              <ion-select label="Distrito" v-model="filters.district">
                <ion-select-option value=""></ion-select-option>
                <ion-select-option :value="district.id" v-for="district in distritos" :key="district.id">
                  {{ district.title }}</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

      <ion-list class="">
        <ion-item lines="none" v-if="!laboratories.length && !isLoading" class="ion-text-center">
          <ion-label>
            No hay laboratorios disponibles
            <p>Amplia el rango de busqueda o utiliza los filtros</p>
          </ion-label>

        </ion-item>
        <LaboratoriesItem :lab="item" v-for="item in laboratories" :key="item.id + '-' + item.name" />
      </ion-list>

      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import LaboratoriesItem from "@/modules/patient/components/LaboratoriesItem.vue";
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonIcon,
  IonItem,
  IonList,
  IonSearchbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonAccordionGroup,
  IonAccordion,
  IonSelect,
  IonSelectOption,
  SelectCustomEvent,
  IonRange,
  IonText,
  onIonViewDidEnter
} from "@ionic/vue";
import {
  filterSharp,
  filterOutline,
  closeSharp,
  closeOutline,
  chevronForwardOutline
} from "ionicons/icons";
import { computed, ref, watch } from "vue";

import useLaboratories from "../composables/useLaboratories";
import useProvinces from "@/composables/useProvinces";
import useMyGeolocation from "@/composables/useMyGeolocation";

const {
  getLaboratories,
  laboratories,
  isLoading,
  currentPage,
  lastPage,
  nextPage,
} = useLaboratories();
const { provincias, cantones, distritos, loadCantones, loadDistricts } =
  useProvinces();

const { coords, getUserLocation, clearUserLocation, isLoading: isSearchingGPS } = useMyGeolocation();
const filters = ref<{
  q: string;
  lat: number | null;
  lon: number | null;
  radius: number;
  province: string;
  canton: string;
  district: string;
}>({
  q: "",
  lat: null,
  lon: null,
  radius: 100,
  province: "",
  canton: "",
  district: "",

});
const isDisabled = ref(false);

const anyFilterSelected = computed(() => {
  return !!(
    //filters.value.q ||
    //filters.value.lat ||
    //filters.value.lon ||
    //filters.value.date ||
    filters.value.province ||
    filters.value.canton ||
    filters.value.district
  );
});

const onChangeProvince = (evt: SelectCustomEvent) => {
  filters.value.canton = "";
  loadCantones(evt.detail.value);
};
const onChangeCanton = (evt: SelectCustomEvent) => {
  filters.value.district = "";
  loadDistricts(evt.detail.value);
};

const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {
  try {
    if (currentPage.value == lastPage.value) {
      ev.target.disabled = true;
      isDisabled.value = true;
      return;
    }

    await nextPage(filters.value);

    ev.target.complete();
  } catch (error: any) {
    console.error(error);
  }
};
const clearFilters = () => {
  //filters.value.q = "";
  filters.value.lat = null;
  filters.value.lon = null;
  filters.value.radius = 100;
  filters.value.province = "";
  filters.value.canton = "";
  filters.value.district = "";
};

watch(filters.value, async () => {

  if (filters.value.q) {
    //filters.value.date = parseDate(filters.value.date);

    if (!filters.value.lat) {
      await getLaboratories(filters.value);
      isDisabled.value = false;
    } else {

      //clearFilters();
      filters.value.lat = null;
      filters.value.lon = null;
      clearUserLocation();
    }


    return;
  }

  if (filters.value.province) {

    if (!filters.value.lat) {
      await getLaboratories(filters.value);
      isDisabled.value = false;
    }

    filters.value.lat = null;
    filters.value.lon = null;
    clearUserLocation();
    return;
  }

  
  if (filters.value.radius && (!filters.value.lat || !filters.value.lon)) {
    //filters.value.date = parseDate(filters.value.date);
    if (!isSearchingGPS.value) {
      await getUserLocation(60 * 10); // 10 min
    }
    return;
  }

  await getLaboratories(filters.value);
  isDisabled.value = false;


});

watch(coords.value, () => {
  
  filters.value.lat = coords.value.lat;
  filters.value.lon = coords.value.lng;
});


onIonViewDidEnter(async () => {
  await getUserLocation(60 * 10); // 10 min
  filters.value.lat = coords.value.lat;
  filters.value.lon = coords.value.lng;
  //await getMedics(filters.value);
});

</script>
<style scoped>
.filters-list {
  background-color: var(--ion-color-light);
  padding-bottom: 0;
}

.rangeKm {
  padding-top: 5px;
  padding-bottom: 0px;
}

.get-location-btn-wrapper {
  padding: 0.5rem 0;
}

.coords {
  display: block !important;
  padding-bottom: 0.5rem;
}

.medics-accumulated-affiliation-message {
  display: flex;
  align-items: center;
  margin-top: 5px;
}
</style>
