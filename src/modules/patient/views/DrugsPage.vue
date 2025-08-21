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

    <!-- ✅ MODAL DE REVISIÓN CON OPCIONES DE ENVÍO -->
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
      
      <ion-content>
        <div class="ion-padding" v-if="orderToReview">
          
          <h1 class="page-title">Revisar tu Orden</h1>

          <!-- MEDICAMENTOS SELECCIONADOS -->
          <ion-card class="order-detail-card">
            <ion-card-content>
              <h3>Medicamentos Seleccionados</h3>
              
              <div v-for="(detail, index) in orderToReview.details" :key="index" class="medication-item">
                <div class="medication-header">
                  <h4>{{ detail.description.split(' - ')[0] }}</h4>
                  <div class="quantity-badge">
                    {{ detail.requested_amount }}
                  </div>
                </div>
                
                <p class="medication-description">{{ detail.description.split(' - ')[1] }}</p>
                <div class="medication-info">
                  <p><strong>Cantidad solicitada:</strong> {{ detail.requested_amount }} unidades</p>
                </div>
                
                <hr v-if="index < orderToReview.details.length - 1">
              </div>
              
            </ion-card-content>
          </ion-card>

          <!-- ✅ NUEVA SECCIÓN: OPCIONES DE ENTREGA -->
          <ion-card class="order-detail-card">
            <ion-card-content>
              <h3>Opciones de Entrega</h3>
              
              <ion-item>
                <ion-checkbox 
                  v-model="requiresShipping" 
                  @ion-change="onShippingChange"
                ></ion-checkbox>
                <ion-label class="ion-margin-start">
                  <h4>Requiero envío a domicilio</h4>
                  <p>Si no lo marcas, deberás recoger en la farmacia</p>
                </ion-label>
              </ion-item>

              <!-- SECCIÓN DE DIRECCIÓN (SI REQUIERE ENVÍO) -->
              <div v-if="requiresShipping" class="shipping-section">
                <ion-item>
                  <ion-label position="stacked">Dirección de entrega</ion-label>
                  <ion-textarea
                    v-model="deliveryAddress"
                    placeholder="Escribe la dirección completa donde quieres recibir tu pedido..."
                    :rows="3"
                    :maxlength="255"
                  ></ion-textarea>
                </ion-item>

                <!-- BOTÓN PARA COORDENADAS GPS -->
                <ion-item>
                  <ion-label>
                    <h4>Ubicación GPS</h4>
                    <p v-if="!coordinates && !gettingLocation">Opcional: Tomar coordenadas actuales</p>
                    <p v-else-if="gettingLocation" class="coordinates-status">Obteniendo ubicación...</p>
                    <p v-else-if="coordinates" class="coordinates-display">
                      📍 Lat: {{ coordinates.lat.toFixed(6) }}, Lng: {{ coordinates.lng.toFixed(6) }}
                    </p>
                  </ion-label>
                  <ion-button 
                    slot="end" 
                    fill="outline" 
                    size="small"
                    @click="getCurrentLocation"
                    :disabled="gettingLocation"
                  >
                    <ion-icon 
                      :name="gettingLocation ? 'sync' : 'location'" 
                      slot="start"
                      :class="{ 'spinning': gettingLocation }"
                    ></ion-icon>
                    {{ gettingLocation ? 'Obteniendo...' : 'Tomar GPS' }}
                  </ion-button>
                </ion-item>
              </div>

            </ion-card-content>
          </ion-card>

          <!-- RESUMEN -->
          <ion-card class="order-detail-card">
            <ion-card-content>
              <h3>Resumen de la Orden</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Total de medicamentos:</span>
                  <span>{{ orderToReview.details.length }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Total de unidades:</span>
                  <span class="total-amount">{{ totalUnits }} unidades</span>
                </div>
                <div class="detail-item">
                  <span class="label">Tipo de entrega:</span>
                  <span>{{ requiresShipping ? 'Envío a domicilio' : 'Recogida en farmacia' }}</span>
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- BOTONES CON VALIDACIÓN -->
          <div class="confirmation-buttons">
            <ion-button 
              expand="block" 
              color="primary" 
              class="confirm-button"
              @click="submitOrder"
              :disabled="!isOrderValid"
            >
              Confirmar y Enviar Orden
            </ion-button>
            
            <ion-button 
              expand="block" 
              fill="outline" 
              color="medium" 
              @click="closeModal"
              class="cancel-button"
            >
              Cancelar
            </ion-button>
          </div>

        </div>
      </ion-content>
    </ion-modal>

    <!-- ✅ ALERTA DE ÉXITO CON ESTILOS ACTUALIZADOS -->
    <ion-alert
      :is-open="showSuccessAlert"
      css-class="success-alert-class"
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
  IonFooter, IonModal, IonAlert, IonIcon, IonCheckbox, IonItem,
  IonLabel, IonTextarea
} from '@ionic/vue';
import { receiptSharp } from 'ionicons/icons';
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Geolocation } from '@capacitor/geolocation';
import useAuth from '../../auth/composables/useAuth';

const URL = import.meta.env.VITE_API_URL;

// INTERFACES
interface Drug {
  id: number;
  name: string;
  description: string;
  presentation: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default defineComponent({
  name: 'DrugsPage',
  components: {
    IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent,
    IonBackButton, IonCard, IonCardContent, IonButton, IonSearchbar,
    IonFooter, IonModal, IonAlert, IonIcon, IonCheckbox, IonItem,
    IonLabel, IonTextarea
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

    // ✅ NUEVAS VARIABLES PARA ENVÍO
    const requiresShipping = ref(false);
    const deliveryAddress = ref('');
    const coordinates = ref<Coordinates | null>(null);
    const gettingLocation = ref(false);

    // CONFIGURACIÓN
    const { auth } = useAuth();
    const route = useRoute();
    const router = useRouter();
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

    // ✅ VALIDACIÓN DE LA ORDEN
    const isOrderValid = computed(() => {
      if (!requiresShipping.value) return true;
      return deliveryAddress.value.trim().length > 10;
    });

    // FUNCIONES DE CANTIDAD (sin cambios)
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

    // ✅ NUEVAS FUNCIONES PARA ENVÍO
    const onShippingChange = () => {
      if (!requiresShipping.value) {
        deliveryAddress.value = '';
        coordinates.value = null;
      }
    };

    const getCurrentLocation = async (): Promise<void> => {
      try {
        gettingLocation.value = true;

        const permission = await Geolocation.checkPermissions();
        if (permission.location !== 'granted') {
          const requestPermission = await Geolocation.requestPermissions();
          if (requestPermission.location !== 'granted') {
            alert('Se necesitan permisos de ubicación para usar esta función');
            return;
          }
        }

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000
        });

        coordinates.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

      } catch (error) {
        alert('No se pudo obtener la ubicación. Verifica que el GPS esté activado.');
      } finally {
        gettingLocation.value = false;
      }
    };

    // FUNCIONES PRINCIPALES ACTUALIZADAS
    const loadDrugs = async () => {
      try {
        const response = await fetch(`${URL}/drugs`);
        const data = await response.json();
        
        drugs.value = data.data;
        
        // Inicializar cantidades
        drugs.value.forEach(drug => {
          quantities.value[drug.id] = 0;
        });
        
      } catch (error) {
        // Error silencioso
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
          requires_shipping: requiresShipping.value ? 1 : 0, // ✅ 1 o 0
          address: requiresShipping.value ? deliveryAddress.value : "",
          lat: coordinates.value ? coordinates.value.lat : 9.9281,
          lot: coordinates.value ? coordinates.value.lng : -84.0907,
          shipping_total: 0,
          details
        };

      } catch (error) {
        return null;
      }
    };

    const showOrderModal = () => {
      const order = createOrder();
      
      if (!order) {
        return;
      }

      orderToReview.value = order;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      orderToReview.value = null;
      // ✅ Resetear variables de envío
      requiresShipping.value = false;
      deliveryAddress.value = '';
      coordinates.value = null;
    };

    const submitOrder = async () => {
      if (!orderToReview.value || !isOrderValid.value) return;

      // ✅ Actualizar orden con datos actuales antes de enviar
      const updatedOrder = createOrder();
      if (!updatedOrder) return;

      try {
        const response = await fetch(`${URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(updatedOrder)
        });

        if (response.ok) {
          const result = await response.json();
          
          // Guardar resultado
          orderResult.value = result;
          
          // Limpiar cantidades
          resetQuantities();
          
          // Cerrar modal
          closeModal();
          
          // Mostrar mensaje de éxito
          showSuccessAlert.value = true;
          
        } else {
          // Error silencioso
        }

      } catch (error) {
        // Error silencioso
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

    const goToOrders = () => {
      router.push(`/patient/orders/${userId}`);
    };

    // INICIALIZACIÓN
    onMounted(() => {
      loadDrugs();
    });

    // RETURN
    return {
      // Estado existente
      drugs,
      searchTerm,
      isModalOpen,
      orderToReview,
      showSuccessAlert,
      orderResult,
      
      // ✅ Nuevas variables de envío
      requiresShipping,
      deliveryAddress,
      coordinates,
      gettingLocation,
      
      // Computed
      filteredDrugs,
      selectedDrugsCount,
      hasSelectedDrugs,
      totalUnits,
      isOrderValid,
      
      // Funciones existentes
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
      
      // ✅ Nuevas funciones de envío
      onShippingChange,
      getCurrentLocation,
      
      // Iconos
      receiptSharp
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
  color: #333;
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
  margin: 0;
  color: #333;
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

.order-detail-card {
  background: white;
  border: 1px solid #dee2e6;
  color: #333;
  margin: 12px 0;
  border-radius: 12px;
}

.order-detail-card h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  text-align: left;
}

.medication-item {
  margin-bottom: 16px;
}

.medication-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.medication-header h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.medication-description {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  margin: 8px 0;
  display: inline-block;
}

.medication-info p {
  font-size: 14px;
  margin: 4px 0;
  color: #333;
}

.detail-grid {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.total-amount {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.confirmation-buttons {
  margin-top: 24px;
  padding: 16px 0;
}

.confirm-button {
  margin-bottom: 12px;
  height: 48px;
  font-weight: 600;
}

.cancel-button {
  margin-bottom: 0;
  height: 48px;
  font-weight: 600;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
}

.modal-content {
  --background: #f8f9fa;
}

/* ✅ NUEVOS ESTILOS PARA OPCIONES DE ENVÍO */
.shipping-section {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa !important; /* Forzar fondo claro */
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* Forzar colores claros en los items dentro de shipping-section */
.shipping-section ion-item {
  --background: #ffffff !important;
  --color: #333333 !important;
  --border-color: #e9ecef !important;
}

/* Labels dentro de shipping-section */
.shipping-section ion-label {
  --color: #333333 !important;
}

.shipping-section ion-label h4 {
  color: #333333 !important;
}

.shipping-section ion-label p {
  color: #666666 !important;
}

/* Textarea dentro de shipping-section */
.shipping-section ion-textarea {
  --background: #ffffff !important;
  --color: #333333 !important;
  --placeholder-color: #999999 !important;
  --border-color: #e9ecef !important;
}

/* Botones dentro de shipping-section */
.shipping-section ion-button {
  --background: #ffffff !important;
  --color: #007bff !important;
  --border-color: #007bff !important;
}

/* Checkbox */
.order-detail-card ion-item ion-checkbox {
  --background-checked: #28a745 !important;
  --border-color-checked: #28a745 !important;
  --checkmark-color: #ffffff !important;
}

/* Forzar colores para el card de opciones de entrega */
.order-detail-card {
  background: #ffffff !important;
  border: 1px solid #dee2e6;
  color: #333333 !important;
  margin: 12px 0;
  border-radius: 12px;
}

.order-detail-card ion-card-content {
  --background: #ffffff !important;
  --color: #333333 !important;
}

.order-detail-card h3 {
  color: #333333 !important;
}

/* Items dentro del card */
.order-detail-card ion-item {
  --background: #ffffff !important;
  --color: #333333 !important;
  --border-color: #e9ecef !important;
}

.order-detail-card ion-label {
  --color: #333333 !important;
}

.order-detail-card ion-label h4 {
  color: #333333 !important;
}

.order-detail-card ion-label p {
  color: #666666 !important;
}

/* Estados específicos para coordenadas */
.coordinates-status {
  color: #007bff !important;
  font-style: italic;
  margin: 0;
}

.coordinates-display {
  color: #28a745 !important;
  font-weight: 500;
  margin: 0;
  font-family: monospace;
  font-size: 12px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Validación visual */
ion-textarea.ion-invalid {
  --border-color: #dc3545;
}

ion-textarea.ion-valid {
  --border-color: #28a745;
}

/* ESTILOS PARA EL ALERT */
:deep(.success-alert-class) {
  --background: #ffffff;
  --border-radius: 12px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:deep(.success-alert-class .alert-title) {
  font-size: 18px;
  font-weight: bold;
  color: #28a745 !important;
}

:deep(.success-alert-class .alert-message) {
  font-size: 16px;
  color: #666 !important;
  margin: 8px 0;
}

:deep(.success-alert-class .alert-button) {
  font-weight: 600;
  color: #28a745 !important;
}
</style>