<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Busqueda de {{ typeOfHealthProfessional?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
      <div class="ion-text-center ion-margin-bottom">
        <div class="ion-padding-horizontal">
          <ion-range aria-label="Kilometros" :ticks="true" :pin="true" :snaps="true" :min="10" :step="5" :max="50" v-model="filters.radius" class="rangeKm" :disabled="!!filters.q || !!filters.province"></ion-range>
        </div>
        <ion-text class="ion-center" :color="(!filters.q && !filters.province) ? 'primary' : 'light'">Cercanía: {{ filters.radius }} Km</ion-text> <br>
        <ion-text class="ion-center" :color="(!filters.q && !filters.province) ? 'dark' : 'light'"> <small>Tu ubicación: {{ filters.lat }}, {{ filters.lon }}</small></ion-text>
      </div>

      <ion-accordion-group>
        <ion-accordion :toggleIcon="chevronForwardOutline">
          <ion-item slot="header" color="light">
            <ion-icon :md="filterSharp" :ios="filterOutline" slot="start"></ion-icon>
            <!-- <ion-label>Buscar Especialista</ion-label> -->
            <ion-button color="secondary">
              Busqueda avanzada
            </ion-button>
            <ion-button color="secondary" v-if="anyFilterSelected" @click.prevent.self="clearFilters"><ion-icon slot="start" :md="closeSharp" :ios="closeOutline"></ion-icon>
              Limpiar
            </ion-button>
          </ion-item>

          <ion-list slot="content" class="filters-list">
            <!-- <ion-item :button="true" id="open-date-input" lines="full" color="light">
              <ion-label>Fecha de consulta</ion-label>
              <ion-input :value="parseDate(filters.date)" />
              <ion-popover trigger="open-date-input" :show-backdrop="true" side="bottom" alignment="center" class="popover-date">
                <ion-content>
                  <ion-datetime v-model="filters.date" presentation="date" />
                </ion-content>
              </ion-popover>
            </ion-item> -->
            <!-- <ion-item lines="full" color="light">
              <ion-label> Ubicación Actual </ion-label>

              <div class="get-location-btn-wrapper">
                <ion-button slot="end" color="secondary" @click="getUserLocation"><ion-icon slot="start" :md="locateSharp" :ios="locateOutline"></ion-icon>
                  Cerca de aquí
                </ion-button>
              </div>
             <div class="coords">
                  <p v-if="filters.lat && filters.lon"> <small>Lat: {{ filters.lat }} - Lng: {{ filters.lon }}</small></p> 
              </div> 
            </ion-item> -->
            <ion-item lines="full" color="light" v-if="filteredSpecialities.length">
              <ion-select label="Especialidad" v-model="filters.speciality">
                <ion-select-option value=""></ion-select-option>
                <ion-select-option :value="speciality.id.toString()" v-for="speciality in filteredSpecialities" :key="speciality.id">{{ speciality.name }}</ion-select-option>
              </ion-select>
            </ion-item>
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
        <ion-item lines="none" v-if="!medics.length && !isLoading" class="ion-text-center">
          <ion-label>
            No hay profesionales disponibles
            <p>Amplia el rango de busqueda o utiliza los filtros</p>
          </ion-label>

        </ion-item>
        <!-- <ion-item
          color="light"
          lines="none"
          v-else-if="!medics.length && !anyFilterSelected && !isLoading"
          class="ion-text-center"
        >
          <ion-label class="ion-text-wrap">
            <p>
              Realiza una busqueda por nombre o con cualquiera de los filtros
              disponibles
            </p>
            <p class="medics-accumulated-affiliation-message">
              <ion-badge color="primary"
                ><ion-icon :md="starSharp" :ios="starOutline"></ion-icon
              ></ion-badge>
              Médicos con el programa de canjeo de saldos acumulado
            </p>
          </ion-label>
        </ion-item> -->

        <MedicsItem :medic="item" v-for="item in medics" :key="item.id + '-' + item.office_name" />
      </ion-list>

      <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import MedicsItem from "@/modules/patient/components/MedicsItem.vue";
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
import { computed, onMounted, ref, watch } from "vue";

import useMedics from "../composables/useMedics";
import useProvinces from "@/composables/useProvinces";
import useUtilities from "@/composables/useUtilities";
import useMyGeolocation from "@/composables/useMyGeolocation";
import { useRoute } from "vue-router";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
const {
  getMedics,
  getSpecialities,
  specialities,
  medics,
  isLoading,
  currentPage,
  lastPage,
  nextPage,
} = useMedics();
const { provincias, cantones, distritos, loadCantones, loadDistricts } =
  useProvinces();
const route = useRoute();
console.log(route.query.type);
const { typesOfHealthProfessional } = useGlobalSettings();
const { parseDate, today } = useUtilities();
const { coords, getUserLocation, clearUserLocation, isLoading: isSearchingGPS } = useMyGeolocation();
const filters = ref<{
  q: string;
  speciality: number | string | undefined;
  lat: number | null;
  lon: number | null;
  radius: number;
  date: string;
  province: string;
  canton: string;
  district: string;
  accumulated_affiliation: boolean | undefined;
  type_of_health_professional: string;
}>({
  q: "",
  speciality: undefined,
  lat: null,
  lon: null,
  radius: 25,
  date: today(),
  province: "",
  canton: "",
  district: "",
  accumulated_affiliation: undefined,
  type_of_health_professional: route.query.type as string,
});
const isDisabled = ref(false);
const typeOfHealthProfessional = computed(() => {
  return typesOfHealthProfessional.value?.find(
    (type:any) => type.id === route.query.type
  );
});
const anyFilterSelected = computed(() => {
  return !!(
    //filters.value.q ||
    filters.value.speciality ||
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
  filters.value.radius = 25;
  filters.value.speciality = "";
  //filters.value.date = "";
  filters.value.province = "";
  filters.value.canton = "";
  filters.value.district = "";
};

watch(filters.value, async () => {

  if (filters.value.q) {
    //filters.value.date = parseDate(filters.value.date);

    if (!filters.value.lat) {
      await getMedics(filters.value);
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
      await getMedics(filters.value);
      isDisabled.value = false;
    }

    filters.value.lat = null;
    filters.value.lon = null;
    clearUserLocation();
    return;
  }

  if (filters.value.date) {
    filters.value.date = parseDate(filters.value.date);
  }
  if (filters.value.radius && (!filters.value.lat || !filters.value.lon)) {
    //filters.value.date = parseDate(filters.value.date);
    if (!isSearchingGPS.value) {
      await getUserLocation(60 * 10); // 10 min
    }
    return;
  }

  await getMedics(filters.value);
  isDisabled.value = false;


});

watch(coords.value, () => {
  
  filters.value.lat = coords.value.lat;
  filters.value.lon = coords.value.lng;
});

onMounted(async () => {
  getSpecialities();
});

const filteredSpecialities = computed(() => {
  return specialities.value.filter((s) => s.professional === route.query.type);
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
