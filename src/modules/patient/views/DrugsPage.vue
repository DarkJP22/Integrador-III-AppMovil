<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Medicamentos</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <div class="ion-padding content-with-footer">
        
        <!-- ← BARRA DE BÚSQUEDA SIMPLE -->
        <ion-searchbar
          v-model="searchTerm"
          placeholder="Buscar medicamentos..."
          class="search-bar"
        ></ion-searchbar>
        
        <h1 class="page-title">Catálogo de Medicamentos</h1>
        
        <!-- ← TARJETAS SIMPLIFICADAS -->
        <ion-card 
          v-for="drug in filteredDrugs" 
          :key="drug.id" 
          class="drug-card"
          :class="{ 'selected': getQuantity(drug.id) > 0 }"
        >
          <ion-card-content>
            
            <!-- ← INFORMACIÓN BÁSICA -->
            <div class="drug-header">
              <h2 class="drug-name">{{ drug.name }}</h2>
              <div class="quantity-badge" v-if="getQuantity(drug.id) > 0">
                {{ getQuantity(drug.id) }}
              </div>
            </div>
            
            <p class="drug-presentation">{{ drug.presentation }}</p>
            <p class="drug-description">{{ drug.description }}</p>
            
            <!-- ← CONTROLES SIMPLES DE CANTIDAD -->
            <div class="quantity-section">
              <div class="quantity-controls">
                <ion-button 
                  size="small" 
                  @click="decreaseQuantity(drug.id)"
                  :disabled="getQuantity(drug.id) <= 0"
                >
                  -
                </ion-button>
                
                <span class="quantity">{{ getQuantity(drug.id) }}</span>
                
                <ion-button 
                  size="small" 
                  @click="increaseQuantity(drug.id)"
                >
                  +
                </ion-button>
              </div>
              
              <!-- ← BOTONES RÁPIDOS SIMPLES -->
              <div class="quick-buttons">
                <ion-button size="small" fill="outline" @click="setQuickQuantity(drug.id, 1)">1</ion-button>
                <ion-button size="small" fill="outline" @click="setQuickQuantity(drug.id, 2)">2</ion-button>
                <ion-button size="small" fill="outline" @click="setQuickQuantity(drug.id, 5)">5</ion-button>
                <ion-button size="small" fill="clear" color="danger" @click="clearQuantity(drug.id)" v-if="getQuantity(drug.id) > 0">
                  Limpiar
                </ion-button>
              </div>
            </div>
            
            <!-- ← BOTÓN PRINCIPAL SIMPLE -->
            <ion-button 
              expand="block" 
              :color="getQuantity(drug.id) > 0 ? 'success' : 'primary'"
              :disabled="getQuantity(drug.id) === 0"
            >
              {{ getQuantity(drug.id) > 0 ? `Agregado (${getQuantity(drug.id)})` : 'Seleccionar cantidad' }}
            </ion-button>
            
          </ion-card-content>
        </ion-card>
        
        <!-- ← MENSAJE SIMPLE CUANDO NO HAY RESULTADOS -->
        <div class="no-results" v-if="filteredDrugs.length === 0 && searchTerm">
          <h3>No se encontraron medicamentos</h3>
          <p>Intenta con otros términos</p>
        </div>
        
      </div>
    </ion-content>
    
    <!-- ← FOOTER SIMPLE -->
    <ion-footer v-show="hasSelectedDrugs">
      <ion-toolbar>
        <div class="footer-content">
          <div class="footer-info">
            <strong>{{ selectedDrugsCount }}</strong> medicamentos
          </div>
          <ion-button @click="consultarDisponibilidad">
            Consultar Disponibilidad
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
    
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonTitle, 
  IonContent,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonButton,
  IonSearchbar,
  IonFooter
} from '@ionic/vue';
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router'; 
import useAuth from '../../auth/composables/useAuth';

interface Drug {
  id: number;
  name: string;
  description: string;
  presentation: string;
}

export default defineComponent({
  name: 'DrugsPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonButton,
    IonSearchbar,
    IonFooter
  },
  setup() {
    const drugs = ref<Drug[]>([]);
    const quantities = ref<Record<number, number>>({});
    const searchTerm = ref('');

    const { auth } = useAuth();
    const userId = auth.value.user.id; 

    const route = useRoute();
    const pharmacyId = route.params.pharmacyId;

    const fetchDrugs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/drugs');
        const data = await response.json();
        
        drugs.value = data.data;
        
        drugs.value.forEach(drug => {
          quantities.value[drug.id] = 0;
        });
        
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const filteredDrugs = computed(() => {
      if (!searchTerm.value) {
        return drugs.value;
      }
      
      return drugs.value.filter(drug => 
        drug.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        drug.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        drug.presentation.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const selectedDrugsCount = computed(() => {
      return Object.values(quantities.value).reduce((total, qty) => total + qty, 0);
    });

    const hasSelectedDrugs = computed(() => {
      return selectedDrugsCount.value > 0;
    });

    const increaseQuantity = (drugId: number) => {
      quantities.value[drugId] = (quantities.value[drugId] || 0) + 1;
    };

    const decreaseQuantity = (drugId: number) => {
      if (quantities.value[drugId] > 0) {
        quantities.value[drugId] = quantities.value[drugId] - 1;
      }
    };

    const getQuantity = (drugId: number): number => {
      return quantities.value[drugId] || 0;
    };

    const setQuickQuantity = (drugId: number, quantity: number) => {
      quantities.value[drugId] = quantity;
    };

    const clearQuantity = (drugId: number) => {
      quantities.value[drugId] = 0;
    };

    const crearOrden = () => {
      try {
        const selectedDrugs = drugs.value.filter(drug => 
          getQuantity(drug.id) > 0
        );

        if (selectedDrugs.length === 0) {
          return null;
        }

        const details = selectedDrugs.map(drug => ({
          drug_id: drug.id,
          requested_amount: getQuantity(drug.id),
          unit_price: 0,
          description: `${drug.name} - ${drug.presentation} - ${getQuantity(drug.id)} unidades solicitadas`
        }));

        const orderData = {
          pharmacy_id: Number(pharmacyId),
          user_id: userId,
          payment_method: false,
          requires_shipping: false,
          address: "",
          lat: 9.9281,
          lot: -84.0907,
          shipping_total: 0,
          details: details
        };

        console.log('=== ORDEN CREADA ===');
        console.log(JSON.stringify(orderData, null, 2));
        
        return orderData;

      } catch (error) {
        console.error('Error al crear la orden:', error);
        return null;
      }
    };

    // ← FUNCIÓN PARA ENVIAR LA ORDEN A LA API
    const consultarDisponibilidad = async () => {
      const orden = crearOrden();
      
      if (!orden) {
        console.log('No hay medicamentos seleccionados para consultar');
        return;
      }

      try {
        console.log('=== ENVIANDO ORDEN A LA API ===');
        console.log('Datos a enviar:', orden);

        const response = await fetch('http://127.0.0.1:8000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(orden)
        });

        console.log('Respuesta HTTP:', response.status, response.statusText);

        if (response.ok) {
          const result = await response.json();
          console.log('✅ ÉXITO - Respuesta de la API:', result);
          
          Object.keys(quantities.value).forEach(key => {
            quantities.value[Number(key)] = 0;
          });
          
        } else {
          const errorData = await response.text();
          console.error('❌ ERROR HTTP:', response.status, errorData);
        }

      } catch (error) {
        console.error('❌ ERROR DE RED:', error);
      }
    };

    onMounted(() => {
      console.log('Pharmacy ID:', pharmacyId);
      console.log('User ID:', userId);
      fetchDrugs();
    });

    return {
      drugs,
      searchTerm,
      filteredDrugs,
      increaseQuantity,
      decreaseQuantity,
      getQuantity,
      setQuickQuantity,
      clearQuantity,
      consultarDisponibilidad, // ← AHORA ENVÍA A LA API
      selectedDrugsCount,
      hasSelectedDrugs
    };
  }
});
</script>

<style scoped>
.content-with-footer {
  padding-bottom: 80px;
}

.search-bar {
  margin-bottom: 16px;
  --background: #ffffff;
  --border-radius: 12px;
}

.page-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin: 16px 0;
}

.drug-card {
  background: #ffffff;
  border-radius: 12px;
  margin: 12px 0;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.drug-card.selected {
  border-color: #28a745;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.2);
}

.drug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.drug-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.quantity-badge {
  background: #28a745;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.drug-presentation {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  margin: 8px 0;
  display: inline-block;
}

.drug-description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 16px;
}

.quantity-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.quantity {
  font-size: 20px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
  padding: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.quick-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #ffffff;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #28a745;
  color: white;
}

.footer-info {
  font-size: 16px;
}
</style>