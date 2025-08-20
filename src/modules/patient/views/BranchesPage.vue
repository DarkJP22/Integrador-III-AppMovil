<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Farmacias</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Sucursales</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div class="ion-padding">
        <!-- ✅ SELECTOR DE DISTANCIA EXACTO A SEARCHMEDICSPAGE -->
        <div class="ion-text-center ion-margin-bottom">
          <div class="ion-padding-horizontal">
            <ion-range 
              aria-label="Distancia máxima" 
              :ticks="true" 
              :pin="true" 
              :snaps="true" 
              :min="5" 
              :step="5" 
              :max="50" 
              v-model="maxDistance"
              class="rangeKm"
            ></ion-range>
          </div>
          <ion-text class="ion-center" color="primary">
            Distancia máxima: {{ maxDistance }} Km
          </ion-text>
          <br>
          <ion-text class="ion-center" color="dark" v-if="userLocation.lat && userLocation.lon">
            <small>Tu ubicación: {{ userLocation.lat.toFixed(4) }}, {{ userLocation.lon.toFixed(4) }}</small>
          </ion-text>
          <ion-text class="ion-center" color="medium" v-else>
            <small>Usando ubicación por defecto (San José, Costa Rica)</small>
          </ion-text>
        </div>

        <!-- LOADING STATE -->
        <div v-if="isLoading" class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p class="loading-text">{{ loadingMessage }}</p>
        </div>

        <!-- FARMACIAS ENCONTRADAS -->
        <div v-else-if="nearbyPharmacies.length > 0" class="cards-container">
          <h1 class="page-title">Farmacias cercanas</h1>
          <p class="subtitle">{{ nearbyPharmacies.length }} farmacias encontradas en un radio de {{ maxDistance }}km</p>
          
          <ion-card 
            v-for="pharmacy in nearbyPharmacies" 
            :key="pharmacy.id" 
            class="pharmacy-card"
            @click="goToPharmacyDrugs(pharmacy.id)" 
            button
          >
            <div class="card-content">
              <div class="pharmacy-image">
                <img src="https://picsum.photos/120/80" :alt="pharmacy.name" />
              </div>
              
              <div class="pharmacy-info">
                <h3 class="pharmacy-name">{{ pharmacy.name }}</h3>
                <p class="pharmacy-detail">
                  <ion-icon name="location-outline"></ion-icon>
                  {{ pharmacy.province }}
                </p>
                <p class="pharmacy-detail">
                  <ion-icon name="home-outline"></ion-icon>
                  {{ pharmacy.address }}
                </p>
                <p class="pharmacy-detail">
                  <ion-icon name="call-outline"></ion-icon>
                  {{ pharmacy.phone }}
                </p>
                <div class="distance-badge">
                  <ion-icon name="navigate-outline"></ion-icon>
                  {{ pharmacy.distance }} km
                </div>
              </div>
            </div>
          </ion-card>
        </div>

        <!-- SIN FARMACIAS CERCANAS -->
        <div v-else class="no-pharmacies">
          <ion-icon name="location-outline" size="large" color="medium"></ion-icon>
          <h2>No hay farmacias cercanas</h2>
          <p>No encontramos farmacias en un radio de {{ maxDistance }}km de tu ubicación</p>
          <ion-button 
            expand="block" 
            fill="outline" 
            @click="retrySearch"
            :disabled="isLoading"
          >
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            Buscar nuevamente
          </ion-button>
        </div>

        <!-- ERROR DE UBICACIÓN -->
        <div v-if="locationError" class="error-message">
          <ion-icon name="warning-outline" color="warning"></ion-icon>
          <p>No pudimos obtener tu ubicación. Usando ubicación por defecto (Costa Rica)</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// filepath: c:\Users\UTN\Documents\Repositorio-Integrador-Mobil\Integrador-III-AppMovil\src\modules\patient\views\BranchesPage.vue
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonCard, IonSpinner, IonButton, IonIcon, IonRange, IonText
} from '@ionic/vue';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter } from 'vue-router';

// INTERFACES
interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  province: string;
  distance: string;
}

// CONSTANTES
const DEFAULT_LOCATION = { lat: 9.9281, lon: -84.0907 }; // San José, Costa Rica
const DEFAULT_MAX_DISTANCE = 15; // km

export default defineComponent({
  name: 'BranchesPage',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonCard, IonSpinner, IonButton, IonIcon, IonRange, IonText
  },
  
  setup() {
    // ESTADO REACTIVO
    const nearbyPharmacies = ref<Pharmacy[]>([]);
    const userLocation = ref(DEFAULT_LOCATION);
    const isLoading = ref(true);
    const loadingMessage = ref('Obteniendo ubicación...');
    const locationError = ref(false);
    const maxDistance = ref(DEFAULT_MAX_DISTANCE);

    const router = useRouter();

    // FUNCIONES
    const getUserLocation = async (): Promise<void> => {
      try {
        loadingMessage.value = 'Obteniendo tu ubicación...';
        locationError.value = false;

        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000 // 5 minutos
        };

        const position = await Geolocation.getCurrentPosition(options);

        userLocation.value = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

      } catch (error) {
        locationError.value = true;
        userLocation.value = DEFAULT_LOCATION;
      }
    };

    const fetchNearbyPharmacies = async (): Promise<void> => {
      try {
        loadingMessage.value = 'Buscando farmacias cercanas...';

        const url = `http://127.0.0.1:8000/api/pharmacies?lat=${userLocation.value.lat}&lon=${userLocation.value.lon}&max_distance=${maxDistance.value}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        nearbyPharmacies.value = data.pharmacies?.map((pharmacy: any) => ({
          id: pharmacy.id,
          name: pharmacy.name,
          address: pharmacy.address,
          phone: pharmacy.phone,
          province: pharmacy.province,
          distance: parseFloat(pharmacy.distance).toFixed(1)
        })) || [];

      } catch (error) {
        nearbyPharmacies.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const goToPharmacyDrugs = (pharmacyId: number): void => {
      router.push(`/patient/drugs/${pharmacyId}`);
    };

    const retrySearch = async (): Promise<void> => {
      isLoading.value = true;
      nearbyPharmacies.value = [];
      await getUserLocation();
      await fetchNearbyPharmacies();
    };

    const init = async (): Promise<void> => {
      await getUserLocation();
      await fetchNearbyPharmacies();
    };

    // ✅ WATCHER PARA CAMBIOS EN LA DISTANCIA MÁXIMA
    watch(maxDistance, async (newDistance, oldDistance) => {
      if (newDistance !== oldDistance && userLocation.value.lat && userLocation.value.lon) {
        isLoading.value = true;
        await fetchNearbyPharmacies();
      }
    });

    // LIFECYCLE
    onMounted(() => {
      init();
    });

    return {
      nearbyPharmacies,
      maxDistance,
      userLocation,
      isLoading,
      loadingMessage,
      locationError,
      goToPharmacyDrugs,
      retrySearch
    };
  }
});
</script>

<style scoped>
/* ✅ ESTILO DEL RANGE EXACTO A SEARCHMEDICSPAGE */
.rangeKm {
  padding-top: 5px;
  padding-bottom: 0px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 16px 0 8px 0;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
}

.pharmacy-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  cursor: pointer;
  margin: 0;
}

.pharmacy-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

.card-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.pharmacy-image {
  flex-shrink: 0;
}

.pharmacy-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f8f9fa;
}

.pharmacy-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pharmacy-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.pharmacy-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin: 0;
}

.pharmacy-detail ion-icon {
  font-size: 16px;
  color: #007bff;
}

.distance-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  align-self: flex-start;
  margin-top: 4px;
}

.distance-badge ion-icon {
  color: white;
  font-size: 14px;
}

.no-pharmacies {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.no-pharmacies h2 {
  margin: 16px 0 8px 0;
  color: #333;
}

.no-pharmacies p {
  margin-bottom: 20px;
  line-height: 1.4;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.error-message p {
  margin: 0;
  font-size: 14px;
  color: #856404;
}

@media (max-width: 768px) {
  .card-content {
    padding: 12px;
    gap: 12px;
  }
  
  .pharmacy-image img {
    width: 60px;
    height: 60px;
  }
  
  .pharmacy-name {
    font-size: 16px;
  }
  
  .pharmacy-detail {
    font-size: 13px;
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style>