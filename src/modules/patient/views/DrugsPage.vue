<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Medicamentos</ion-title>
        <!-- BOTÓN A LA DERECHA -->
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="goToOrders">
            <ion-icon :icon="receiptSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <!-- CONTENIDO PRINCIPAL -->
    <ion-content :fullscreen="true">
      <div class="ion-padding content-with-footer">
        
        <!-- BARRA DE BÚSQUEDA -->
        <ion-searchbar
          v-model="searchTerm"
          placeholder="Buscar medicamentos..."
          class="search-bar"
        ></ion-searchbar>
        
        <h1 class="page-title">Catálogo de Medicamentos</h1>
        
        <!-- LISTA DE MEDICAMENTOS -->
        <ion-card 
          v-for="drug in filteredDrugs" 
          :key="drug.id" 
          class="drug-card"
          :class="{ 'selected': getQuantity(drug.id) > 0 }"
        >
          <ion-card-content>
            
            <!-- HEADER DEL MEDICAMENTO -->
            <div class="drug-header">
              <h2 class="drug-name">{{ drug.name }}</h2>
              <div class="quantity-badge" v-if="getQuantity(drug.id) > 0">
                {{ getQuantity(drug.id) }}
              </div>
            </div>
            
            <!-- INFORMACIÓN DEL MEDICAMENTO -->
            <p class="drug-presentation">{{ drug.presentation }}</p>
            <p class="drug-description">{{ drug.description }}</p>
            
            <!-- CONTROLES DE CANTIDAD -->
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
              
              <!-- BOTONES RÁPIDOS -->
              <div class="quick-buttons">
                <ion-button size="small" fill="outline" @click="setQuickQuantity(drug.id, 1)">1</ion-button>
                <ion-button size="small" fill="outline" @click="setQuickQuantity(drug.id, 2)">2</ion-button>
                <ion-button size="small" fill="outline" @click="setQuickQuantity(drug.id, 5)">5</ion-button>
                <ion-button size="small" fill="clear" color="danger" @click="clearQuantity(drug.id)" v-if="getQuantity(drug.id) > 0">
                  Limpiar
                </ion-button>
              </div>
            </div>
            
            <!-- BOTÓN PRINCIPAL -->
            <ion-button 
              expand="block" 
              :color="getQuantity(drug.id) > 0 ? 'success' : 'primary'"
              :disabled="getQuantity(drug.id) === 0"
            >
              {{ getQuantity(drug.id) > 0 ? `Agregado (${getQuantity(drug.id)})` : 'Seleccionar cantidad' }}
            </ion-button>
            
          </ion-card-content>
        </ion-card>
        
        <!-- MENSAJE SIN RESULTADOS -->
        <div class="no-results" v-if="filteredDrugs.length === 0 && searchTerm">
          <h3>No se encontraron medicamentos</h3>
          <p>Intenta con otros términos</p>
        </div>
        
      </div>
    </ion-content>
    
    <!-- FOOTER -->
    <ion-footer v-show="hasSelectedDrugs">
      <ion-toolbar>
        <div class="footer-content">
          <div class="footer-info">
            <strong>{{ selectedDrugsCount }}</strong> medicamentos
          </div>
          <ion-button @click="showOrderModal">
            Consultar Disponibilidad
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>

    <!-- MODAL DE REVISIÓN -->
    <ion-modal :is-open="isModalOpen" @will-dismiss="closeModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Revisar Orden</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" color="light" @click="closeModal">
              Cerrar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="modal-content">
        <div class="ion-padding">
          <div v-if="orderToReview">
            
            <h1 class="page-title">Revisar tu Orden</h1>

            <!-- MEDICAMENTOS SELECCIONADOS -->
            <ion-card class="drugs-card">
              <ion-card-content>
                <h2 class="section-title">Medicamentos Seleccionados</h2>
                
                <div v-for="(detail, index) in orderToReview.details" :key="index" class="medicamento-modal-item">
                  <div class="drug-header">
                    <h3 class="drug-name">{{ detail.description.split(' - ')[0] }}</h3>
                    <div class="quantity-badge">
                      {{ detail.requested_amount }}
                    </div>
                  </div>
                  
                  <p class="drug-presentation">{{ detail.description.split(' - ')[1] }}</p>
                  <p class="drug-quantity-text">
                    <strong>Cantidad solicitada:</strong> {{ detail.requested_amount }} unidades
                  </p>
                  
                  <div v-if="index < orderToReview.details.length - 1" class="separator"></div>
                </div>
                
              </ion-card-content>
            </ion-card>

            <!-- RESUMEN -->
            <ion-card class="summary-card">
              <ion-card-content>
                <div class="resumen">
                  <h2 class="section-title">Resumen de la Orden</h2>
                  <div class="summary-grid">
                    <div class="summary-item">
                      <span class="summary-label">Total de medicamentos:</span>
                      <span class="summary-value">{{ orderToReview.details.length }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">Total de unidades:</span>
                      <span class="summary-value-main">{{ totalUnits }} unidades</span>
                    </div>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>

            <!-- BOTONES -->
            <div class="modal-buttons">
              <ion-button 
                expand="block" 
                fill="outline" 
                color="medium" 
                @click="closeModal"
                class="cancel-btn"
              >
                Cancelar
              </ion-button>
              <ion-button 
                expand="block" 
                color="primary" 
                @click="submitOrder"
                class="confirm-btn"
              >
                Confirmar y Enviar Orden
              </ion-button>
            </div>

          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- ALERTA DE ÉXITO -->
    <ion-alert
      :is-open="showSuccessAlert"
      css-class="my-custom-class"
      header="Orden Enviada"
      message="Tu orden ha sido enviada exitosamente."
      :buttons="[{ text: 'Aceptar', handler: closeSuccessAlert }]"
    ></ion-alert>
    
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent,
  IonBackButton, IonCard, IonCardContent, IonButton, IonSearchbar,
  IonFooter, IonModal, IonAlert, IonIcon
} from '@ionic/vue';
import { receiptSharp } from 'ionicons/icons';
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAuth from '../../auth/composables/useAuth';

// INTERFAZ
interface Drug {
  id: number;
  name: string;
  description: string;
  presentation: string;
}

export default defineComponent({
  name: 'DrugsPage',
  components: {
    IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent,
    IonBackButton, IonCard, IonCardContent, IonButton, IonSearchbar,
    IonFooter, IonModal, IonAlert, IonIcon
  },
  
  setup() {
    // ESTADO REACTIVO
    const drugs = ref<Drug[]>([]);
    const quantities = ref<Record<number, number>>({});
    const searchTerm = ref('');
    const isModalOpen = ref(false);
    const orderToReview = ref<any>(null);
    const showSuccessAlert = ref(false);
    const orderResult = ref<any>(null);

    // CONFIGURACIÓN
    const { auth } = useAuth();
    const route = useRoute();
    const router = useRouter(); // ← AGREGAR router
    const userId = auth.value.user.id;
    const pharmacyId = route.params.pharmacyId;

    // COMPUTED PROPERTIES
    const filteredDrugs = computed(() => {
      if (!searchTerm.value) return drugs.value;
      
      const term = searchTerm.value.toLowerCase();
      return drugs.value.filter(drug => 
        drug.name.toLowerCase().includes(term) ||
        drug.description.toLowerCase().includes(term) ||
        drug.presentation.toLowerCase().includes(term)
      );
    });

    const selectedDrugsCount = computed(() => 
      Object.values(quantities.value).reduce((total, qty) => total + qty, 0)
    );

    const hasSelectedDrugs = computed(() => 
      selectedDrugsCount.value > 0
    );

    const totalUnits = computed(() => {
      if (!orderToReview.value) return 0;
      return orderToReview.value.details.reduce((total: number, detail: any) => 
        total + detail.requested_amount, 0
      );
    });

    // FUNCIONES DE CANTIDAD
    const getQuantity = (drugId: number): number => 
      quantities.value[drugId] || 0;

    const setQuantity = (drugId: number, quantity: number) => {
      quantities.value[drugId] = Math.max(0, quantity);
    };

    const increaseQuantity = (drugId: number) => 
      setQuantity(drugId, getQuantity(drugId) + 1);

    const decreaseQuantity = (drugId: number) => 
      setQuantity(drugId, getQuantity(drugId) - 1);

    const setQuickQuantity = (drugId: number, quantity: number) => 
      setQuantity(drugId, quantity);

    const clearQuantity = (drugId: number) => 
      setQuantity(drugId, 0);

    // FUNCIONES PRINCIPALES
    const loadDrugs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/drugs');
        const data = await response.json();
        
        drugs.value = data.data;
        
        // Inicializar cantidades
        drugs.value.forEach(drug => {
          quantities.value[drug.id] = 0;
        });
        
      } catch (error) {
        console.error('Error al cargar medicamentos:', error);
      }
    };

    const createOrder = () => {
      try {
        const selectedDrugs = drugs.value.filter(drug => 
          getQuantity(drug.id) > 0
        );

        if (selectedDrugs.length === 0) return null;

        const details = selectedDrugs.map(drug => ({
          drug_id: drug.id,
          requested_amount: getQuantity(drug.id),
          unit_price: 0,
          description: `${drug.name} - ${drug.presentation} - ${getQuantity(drug.id)} unidades solicitadas`
        }));

        return {
          pharmacy_id: Number(pharmacyId),
          user_id: userId,
          payment_method: false,
          requires_shipping: false,
          address: "",
          lat: 9.9281,
          lot: -84.0907,
          shipping_total: 0,
          details
        };

      } catch (error) {
        console.error('Error al crear la orden:', error);
        return null;
      }
    };

    const showOrderModal = () => {
      const order = createOrder();
      
      if (!order) {
        console.log('No hay medicamentos seleccionados');
        return;
      }

      orderToReview.value = order;
      isModalOpen.value = true;
      console.log('=== MOSTRANDO ORDEN EN MODAL ===');
      console.log(order);
    };

    const closeModal = () => {
      isModalOpen.value = false;
      orderToReview.value = null;
    };

    const submitOrder = async () => {
      if (!orderToReview.value) return;

      try {
        console.log('=== ENVIANDO ORDEN A LA API ===');
        console.log('Datos a enviar:', orderToReview.value);

        const response = await fetch('http://127.0.0.1:8000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(orderToReview.value)
        });

        console.log('Respuesta HTTP:', response.status, response.statusText);

        if (response.ok) {
          const result = await response.json();
          console.log('✅ ÉXITO - Respuesta de la API:', result);
          
          // Guardar resultado
          orderResult.value = result;
          
          // Limpiar cantidades
          resetQuantities();
          
          // Cerrar modal
          closeModal();
          
          // Mostrar mensaje de éxito
          showSuccessAlert.value = true;
          
        } else {
          const errorData = await response.text();
          console.error('❌ ERROR HTTP:', response.status, errorData);
        }

      } catch (error) {
        console.error('❌ ERROR DE RED:', error);
      }
    };

    const resetQuantities = () => {
      Object.keys(quantities.value).forEach(key => {
        quantities.value[Number(key)] = 0;
      });
    };

    const closeSuccessAlert = () => {
      showSuccessAlert.value = false;
      orderResult.value = null;
    };

    // NUEVA FUNCIÓN PARA NAVEGAR
    const goToOrders = () => {
      router.push(`/patient/orders/${userId}`); // ← Cambia la ruta según tu configuración
    };

    // INICIALIZACIÓN
    onMounted(() => {
      console.log('Pharmacy ID:', pharmacyId);
      console.log('User ID:', userId);
      loadDrugs();
    });

    // RETURN
    return {
      // Estado
      drugs,
      searchTerm,
      isModalOpen,
      orderToReview,
      showSuccessAlert,
      orderResult,
      
      // Computed
      filteredDrugs,
      selectedDrugsCount,
      hasSelectedDrugs,
      totalUnits,
      
      // Funciones
      getQuantity,
      increaseQuantity,
      decreaseQuantity,
      setQuickQuantity,
      clearQuantity,
      showOrderModal,
      closeModal,
      submitOrder,
      closeSuccessAlert,
      goToOrders,
      
      // Iconos
      receiptSharp // ← CAMBIAR A receiptSharp
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

.modal-content {
  --background: linear-gradient(135deg, #cdd1e6 0%, #8bb6ee 100%);
}

.info-card, .drugs-card, .summary-card {
  background: #ffffff;
  border-radius: 12px;
  margin: 12px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
}

.info-section {
  text-align: center;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.info-value-highlight {
  background: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
}

.medicamento-modal-item {
  margin-bottom: 16px;
}

.medicamento-modal-item .drug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.medicamento-modal-item .drug-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.medicamento-modal-item .quantity-badge {
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

.medicamento-modal-item .drug-presentation {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  margin: 8px 0;
  display: inline-block;
}

.drug-quantity-text {
  color: #666;
  font-size: 14px;
  margin: 8px 0 0 0;
}

.separator {
  height: 1px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
  margin: 16px 0;
}

.resumen {
  text-align: center;
}

.summary-grid {
  display: grid;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-label {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.summary-value {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.summary-value-main {
  background: #007bff;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.modal-buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 4px;
}

.cancel-btn {
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
}

.confirm-btn {
  --border-radius: 12px;
  height: 48px;
  font-weight: 600;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.my-custom-class {
  --background: #ffffff;
  --border-radius: 12px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.my-custom-class .alert-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.my-custom-class .alert-message {
  font-size: 16px;
  color: #666;
  margin: 8px 0;
}

.my-custom-class .alert-button {
  font-weight: 600;
  color: #007bff;
}
</style>