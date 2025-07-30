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

        <div v-if="isLoading" class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p class="loading-text">{{ loadingMessage }}</p>
        </div>

        <div v-else class="cards-container">
          <h1 class="ion-text-center">Seleccione su farmacia</h1>
          
          <!-- Generación de tarjetas dinamicas -->
          <ion-card 
            v-for="pharmacy in nearbyPharmacies" 
            :key="pharmacy.id" 
            class="pharmacy-card-rectangular"
            @click="goToPharmacyDrugs(pharmacy.id)" 
            button
          >
            <div class="card-content">
              <div class="pharmacy-image">
                <img src="https://picsum.photos/120/80" :alt="pharmacy.name" />
              </div>
              <div class="pharmacy-info">
                <h3 class="pharmacy-name">{{ pharmacy.name }}</h3>
                <p class="pharmacy-detail">{{ pharmacy.province }}</p>
                <p class="pharmacy-detail">{{ pharmacy.address }}</p>
                <p class="pharmacy-detail">{{ pharmacy.phone }}</p>
              </div>
            </div>
          </ion-card>

          <!-- Mensaje si no hay farmacias cerca -->
          <div v-if="nearbyPharmacies.length === 0" class="no-pharmacies">
            <p>No hay farmacias disponibles en un radio de {{ maxDistance }} km</p>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSpinner
} from '@ionic/vue';
import { defineComponent, onMounted, ref, computed } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter } from 'vue-router';

import useAuth from '../../auth/composables/useAuth';

export default defineComponent({
  name: 'BranchesPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSpinner
  },
  setup() {
    const userLocation = ref({ lat: 0, lon: 0 });
    const maxDistance = 15;
    const nearbyPharmacies = ref<any[]>([]);

    const isLoading = ref(true);
    const loadingMessage = ref('Obteniendo ubicación...');

    const router = useRouter();

    // Fórmula de Haversine para calcular distancia
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const getUserLocation = async () => {
      try {
        console.log('Obteniendo ubicación...');
        loadingMessage.value = 'Obteniendo ubicación...';

        const options = {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 600000
        };

        const position = await Geolocation.getCurrentPosition(options);

        userLocation.value = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

        console.log('Ubicación obtenida:', userLocation.value);

      } catch (error) {
        console.error('Error ubicación:', error);
        userLocation.value = { lat: 9.9281, lon: -84.0907 };
        console.log('Usando ubicación por defecto');
      }
    };

    const fetchPharmacies = async () => {
      try {
        loadingMessage.value = 'Buscando farmacias cercanas...';

        const response = await fetch('http://127.0.0.1:8000/api/pharmacies', {
          headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();
        nearbyPharmacies.value = [];

        data.pharmacies.forEach((pharmacy: any) => {
          const distance = haversineDistance(
            userLocation.value.lat,
            userLocation.value.lon,
            parseFloat(pharmacy.lat),
            parseFloat(pharmacy.lon)
          );

          if (distance <= maxDistance) {
            nearbyPharmacies.value.push({
              id: pharmacy.id,
              name: pharmacy.name,
              address: pharmacy.address,
              phone: pharmacy.phone,
              province: pharmacy.province,
              distance: distance.toFixed(2)
            });
          }
        });

        console.log(`Farmacias encontradas: ${nearbyPharmacies.value.length}`);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const goToPharmacyDrugs = (pharmacyId: number) => {
      console.log('Navegando a farmacia con ID:', pharmacyId);
      router.push(`/patient/drugs/${pharmacyId}`);
    };

    onMounted(async () => {
      await getUserLocation();
      await fetchPharmacies();
    });

    return {
      nearbyPharmacies,
      maxDistance,
      goToPharmacyDrugs,
      isLoading,
      loadingMessage
    };
  }
});
</script>

<style scoped>
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  margin-top: 50px;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
  text-align: center;
}

.pharmacy-card-rectangular {
  width: 100%;
  max-width: 100%;
  margin: 0 auto 16px auto;
  background-color: #ffffff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pharmacy-card-rectangular:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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
}

.pharmacy-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pharmacy-name {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
}

.pharmacy-detail {
  font-size: 14px;
  color: #666666;
  margin: 2px 0;
}

.no-pharmacies {
  text-align: center;
  margin-top: 40px;
  color: #666;
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
}
</style>