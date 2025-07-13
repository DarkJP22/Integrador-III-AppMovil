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
        <h1 class="ion-text-center">Seleccione su farmacia</h1>
        
        <div class="cards-container">
          <!-- Crear tarjetas dinámicamente con v-for -->
          <ion-card v-for="pharmacy in nearbyPharmacies" :key="pharmacy.id" class="pharmacy-card">
            <img src="https://picsum.photos/300/200" :alt="pharmacy.name" />
            <ion-card-header>
              <ion-card-title>{{ pharmacy.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item lines="none">
                <ion-label>{{ pharmacy.province }}</ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-label>{{ pharmacy.address }}</ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-label>{{ pharmacy.phone }}</ion-label>
              </ion-item>
            </ion-card-content>
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
  IonLabel
} from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';

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
  },
  setup() {
    const userLocation = ref({ lat: 0, lon: 0 });
    const maxDistance = 15;
    const nearbyPharmacies = ref<any[]>([]);

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
        
        // Opciones simples para evitar timeout
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
        // Usar ubicación por defecto
        userLocation.value = { lat: 9.9281, lon: -84.0907 };
        console.log('Usando ubicación por defecto');
      }
    };

    // Función para obtener farmacias
    const fetchPharmacies = async () => {
      try {
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
      }
    };

    onMounted(async () => {
      await getUserLocation();
      await fetchPharmacies();
    });

    return {
      nearbyPharmacies,
      maxDistance
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

.pharmacy-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background-color: #ffffff;
}

.pharmacy-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.pharmacy-card ion-card-header {
  background-color: #ffffff;
}

.pharmacy-card ion-card-content {
  background-color: #ffffff;
}

.pharmacy-card ion-item {
  --background: #ffffff;
}

.pharmacy-card ion-card-title {
  color: #000000; 
}

.pharmacy-card ion-label {
  color: #000000; 
}

.no-pharmacies {
  text-align: center;
  margin-top: 40px;
  color: #666;
}
</style>