<template>
  <ion-page>
    <!-- ENCABEZADO DE LA PÁGINA -->
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Ordenes</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENIDO DE LA PÁGINA -->
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        
        <h1 class="page-title">Mis Ordenes</h1>
        
        <!-- ✅ MENSAJE DE ÉXITO PARA CANCELAR ORDEN -->
        <ion-card v-if="showSuccessMessage" class="success-message">
          <ion-card-content>
            <div class="success-content">
              <ion-icon name="checkmark-circle" color="success"></ion-icon>
              <div>
                <h3>¡Orden cancelada exitosamente!</h3>
                <p>Tu orden ha sido cancelada correctamente</p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
        
        <!-- MOSTRAR SPINNER MIENTRAS CARGA -->
        <div class="loading" v-if="loading">
          <ion-spinner></ion-spinner>
          <p>Cargando ordenes...</p>
        </div>
        
        <!-- MOSTRAR MENSAJE SI NO HAY ORDENES -->
        <div class="empty-state" v-else-if="orders.length === 0">
          <h2>No tienes ordenes</h2>
          <p>Cuando realices tu primera orden aparecerá aquí</p>
        </div>
        
        <!-- MOSTRAR LISTA DE ORDENES -->
        <ion-card 
          v-for="order in orders" 
          :key="order.id" 
          class="order-card"
        >
          <ion-card-content>
            
            <!-- TÍTULO Y ESTADO DE LA ORDEN -->
            <div class="order-header">
              <h2>{{ order.consecutive }}</h2>
              <ion-chip>
                {{ getStatusText(order.status) }}
              </ion-chip>
            </div>
            
            <!-- INFORMACIÓN BÁSICA DE LA ORDEN -->
            <div class="order-info">
              <p><strong>Farmacia:</strong> {{ order.pharmacy.name }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(order.date) }}</p>
              <p><strong>Medicamentos:</strong> {{ order.details.length }} items</p>
              <p><strong>Total:</strong> ₡{{ order.order_total }}</p>
            </div>
            
            <!-- BOTÓN PARA ABRIR DETALLES -->
            <ion-button 
              expand="block" 
              fill="outline" 
              @click="viewOrderDetails(order)"
            >
              Ver Detalles
            </ion-button>
            
          </ion-card-content>
        </ion-card>
        
      </div>
    </ion-content>
    
    <!-- VENTANA EMERGENTE CON DETALLES COMPLETOS -->
    <ion-modal :is-open="showModal" @will-dismiss="closeModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Detalles de la Orden</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" color="light" @click="closeModal">
              Cerrar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content v-if="selectedOrder">
        <div class="ion-padding">
          
          <!-- INFORMACIÓN GENERAL DE LA ORDEN -->
          <ion-card class="order-detail-card">
            <ion-card-content>
              <h2>{{ selectedOrder.consecutive }}</h2>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Estado:</span>
                  <ion-chip>
                    {{ getStatusText(selectedOrder.status) }}
                  </ion-chip>
                </div>
                <div class="detail-item">
                  <span class="label">Farmacia:</span>
                  <span>{{ selectedOrder.pharmacy.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Dirección:</span>
                  <span>{{ selectedOrder.pharmacy.address }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Fecha:</span>
                  <span>{{ formatDate(selectedOrder.date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Total:</span>
                  <span class="total-amount">₡{{ selectedOrder.order_total }}</span>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
          
          <!-- LISTA DETALLADA DE MEDICAMENTOS -->
          <ion-card class="order-detail-card">
            <ion-card-content>
              <h3>Medicamentos Solicitados</h3>
              
              <div v-for="(detail, index) in selectedOrder.details" :key="detail.id" class="medication-item">
                <div class="medication-header">
                  <h4>{{ detail.drug.name }}</h4>
                  <span class="quantity-badge">{{ detail.requested_amount }}</span>
                </div>
                <p class="medication-description">{{ detail.description }}</p>
                <div class="medication-info">
                  <p><strong>Cantidad solicitada:</strong> {{ detail.requested_amount }} unidades</p>
                  <p><strong>Cantidad disponible:</strong> {{ detail.quantity_available }} unidades</p>
                  <p><strong>Precio unitario:</strong> ₡{{ detail.unit_price }}</p>
                  <p><strong>Total:</strong> ₡{{ detail.products_total }}</p>
                </div>
                <hr v-if="index < selectedOrder.details.length - 1">
              </div>
              
            </ion-card-content>
          </ion-card>
          
          <!-- ✅ BOTONES DE CONFIRMACIÓN (SOLO SI ESTÁ EN ESPERANDO CONFIRMACIÓN) -->
          <div 
            v-if="selectedOrder.status.toLowerCase() === 'esperando_confirmacion'" 
            class="confirmation-buttons"
          >
            <ion-button 
              expand="block" 
              color="success"
              class="confirm-button"
              @click="openConfirmationModal"
            >
              Confirmar
            </ion-button>
            
            <ion-button 
              expand="block" 
              color="danger"
              fill="outline"
              class="cancel-button"
              @click="cancelOrder"
              :disabled="cancelingOrder"
            >
              <ion-spinner v-if="cancelingOrder" slot="start"></ion-spinner>
              {{ cancelingOrder ? 'Cancelando...' : 'Cancelar' }}
            </ion-button>
          </div>
          
        </div>
      </ion-content>
    </ion-modal>

    <!-- ✅ NUEVO MODAL DE CONFIRMACIÓN DE ORDEN -->
    <ion-modal :is-open="showConfirmationModal" @will-dismiss="closeConfirmationModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Confirmar Orden</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" color="light" @click="closeConfirmationModal">
              Cerrar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <ion-content>
        <div class="ion-padding">
          
          <h1 class="page-title">Confirmar tu Orden</h1>
          
          <!-- SECCIÓN MÉTODO DE PAGO -->
          <ion-card class="form-card">
            <ion-card-content>
              <h2 class="section-title">Método de Pago</h2>
              
              <ion-radio-group v-model="paymentMethod">
                <ion-item>
                  <ion-label>Efectivo</ion-label>
                  <ion-radio slot="start" value="efectivo"></ion-radio>
                </ion-item>
                
                <ion-item>
                  <ion-label>SINPE Móvil</ion-label>
                  <ion-radio slot="start" value="sinpe"></ion-radio>
                </ion-item>
              </ion-radio-group>
              
              <!-- VOUCHER PARA SINPE -->
              <div v-if="paymentMethod === 'sinpe'" class="voucher-section">
                <ion-item>
                  <ion-label position="stacked">Comprobante de SINPE Móvil</ion-label>
                  <input 
                    type="file" 
                    ref="fileInputRef"
                    @change="handleFileSelect"
                    accept="image/*"
                    style="display: none"
                  >
                  <ion-button 
                    fill="outline" 
                    size="small" 
                    class="upload-button"
                    @click="triggerFileInput"
                  >
                    <ion-icon name="camera" slot="start"></ion-icon>
                    Subir Comprobante
                  </ion-button>
                </ion-item>
                
                <div class="voucher-preview" v-if="selectedFile">
                  <ion-card class="voucher-card">
                    <ion-card-content>
                      <div class="voucher-placeholder">
                        <ion-icon name="document-text" size="large"></ion-icon>
                        <p>{{ selectedFile.name }}</p>
                        <ion-button fill="clear" color="danger" size="small" @click="removeFile">
                          <ion-icon name="trash" slot="icon-only"></ion-icon>
                        </ion-button>
                      </div>
                    </ion-card-content>
                  </ion-card>
                </div>
              </div>
              
            </ion-card-content>
          </ion-card>
          
          <!-- SECCIÓN ENVÍO -->
          <ion-card class="form-card">
            <ion-card-content>
              <h2 class="section-title">Opciones de Entrega</h2>
              
              <ion-item>
                <ion-label>¿Requiere envío a domicilio?</ion-label>
                <ion-checkbox v-model="requiresShipping"></ion-checkbox>
              </ion-item>
              
              <!-- DIRECCIÓN SI REQUIERE ENVÍO -->
              <div v-if="requiresShipping" class="shipping-section">
                <ion-item>
                  <ion-label position="stacked">Dirección de Entrega</ion-label>
                  <ion-textarea 
                    v-model="deliveryAddress"
                    placeholder="Ingresa tu dirección completa"
                    :rows="3"
                  ></ion-textarea>
                </ion-item>
                
                <ion-item>
                  <ion-label>Coordenadas GPS</ion-label>
                  <ion-button 
                    fill="outline" 
                    size="small" 
                    class="coordinates-button"
                    @click="getCurrentLocation"
                    :disabled="gettingLocation"
                  >
                    <ion-spinner v-if="gettingLocation" slot="start" name="crescent"></ion-spinner>
                    <ion-icon v-else name="location" slot="start"></ion-icon>
                    {{ gettingLocation ? 'Obteniendo...' : 'Obtener Coordenadas' }}
                  </ion-button>
                </ion-item>
                
                <div class="coordinates-display" v-if="coordinates">
                  <ion-card class="coordinates-card">
                    <ion-card-content>
                      <div class="coordinates-info">
                        <ion-icon name="location-sharp" color="primary"></ion-icon>
                        <div>
                          <p><strong>Latitud:</strong> {{ coordinates.lat }}</p>
                          <p><strong>Longitud:</strong> {{ coordinates.lng }}</p>
                        </div>
                      </div>
                    </ion-card-content>
                  </ion-card>
                </div>
              </div>
              
            </ion-card-content>
          </ion-card>
          
          <!-- RESUMEN DE LA ORDEN -->
          <ion-card class="form-card" v-if="selectedOrder">
            <ion-card-content>
              <h2 class="section-title">Resumen de la Orden</h2>
              
              <div class="order-summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>₡{{ selectedOrder.order_total }}</span>
                </div>
                <div class="summary-row" v-if="requiresShipping">
                  <span>Envío:</span>
                  <span>₡{{ selectedOrder.shipping_total || '0' }}</span>
                </div>
                <div class="summary-row total-row">
                  <span><strong>Total:</strong></span>
                  <span><strong>₡{{ calculateTotal() }}</strong></span>
                </div>
              </div>
              
            </ion-card-content>
          </ion-card>
          
          <!-- BOTONES DE ACCIÓN -->
          <div class="confirmation-form-buttons">
            <ion-button 
              expand="block" 
              fill="outline" 
              color="medium" 
              @click="closeConfirmationModal"
              class="cancel-form-button"
              :disabled="confirmingOrder"
            >
              Cancelar
            </ion-button>
            
            <ion-button 
              expand="block" 
              color="success" 
              class="confirm-form-button"
              @click="confirmOrder"
              :disabled="confirmingOrder || !isFormValid"
            >
              <ion-spinner v-if="confirmingOrder" slot="start" name="crescent"></ion-spinner>
              {{ confirmingOrder ? 'Confirmando...' : 'Confirmar Orden' }}
            </ion-button>
          </div>
          
        </div>
      </ion-content>
    </ion-modal>
    
    <!-- ALERT DE CANCELACIÓN EXISTENTE -->
    <ion-alert
      :is-open="showSuccessMessage"
      css-class="success-alert-class"
      header="¡Orden Cancelada!"
      message="Tu orden ha sido cancelada exitosamente."
      :buttons="[{ text: 'Aceptar', handler: closeSuccessAlert }]"
    ></ion-alert>
    
    <!-- ✅ NUEVO ALERT DE CONFIRMACIÓN EXITOSA -->
    <ion-alert
      :is-open="showConfirmationSuccessAlert"
      css-class="success-alert-class"
      header="¡Orden Confirmada!"
      message="Tu orden ha sido confirmada exitosamente."
      :buttons="[{ text: 'Aceptar', handler: closeConfirmationSuccessAlert }]"
    ></ion-alert>
    
  </ion-page>
</template>

<script lang="ts">
// filepath: c:\Users\UTN\Documents\Repositorio-Integrador-Mobil\Integrador-III-AppMovil\src\modules\patient\views\OrdersPage.vue
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonCard, IonCardContent, IonButton, IonChip, IonModal,
  IonSpinner, IonAlert, IonItem, IonLabel, IonRadioGroup, IonRadio,
  IonCheckbox, IonTextarea, IonIcon
} from '@ionic/vue';

import { useMyBroadcastEvents } from '@/composables/useMyBroadcastEvents';
import usePushNotifications from '@/composables/usePushNotifications';

const URL = import.meta.env.VITE_API_URL;

// INTERFACES
interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  notification_datetime: string;
  notification_hour: string;
  name_address: string;
  provinceName: string;
}

interface Drug {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
}

interface OrderDetail {
  id: number;
  order_id: number;
  drug_id: number;
  requested_amount: number;
  quantity_available: number;
  unit_price: string;
  products_total: string;
  description: string;
  drug: Drug;
}

interface Order {
  id: number;
  consecutive: string;
  pharmacy_id: number;
  user_id: number;
  date: string;
  status: string;
  payment_method: boolean;
  requires_shipping: boolean;
  address: string | null;
  lat: string;
  lot: string;
  order_total: string;
  shipping_total: string;
  voucher: string | null;
  created_at: string;
  updated_at: string;
  pharmacy: Pharmacy;
  details: OrderDetail[];
}

// CONSTANTES
const STATUS_MAP = {
  'cotizacion': 'Cotización',
  'aprobado': 'Aprobado',
  'esperando_confirmacion': 'Esperando Confirmación',
  'confirmado': 'Confirmado',
  'cancelado': 'Cancelado',
  'preparando': 'Preparando',
  'despachado': 'Despachado'
} as const;

const ERROR_MESSAGES = {
  401: 'Error: No tienes autorización. Por favor inicia sesión nuevamente.',
  403: 'Error: No tienes permisos para realizar esta acción.',
  404: 'Error: La orden no fue encontrada.',
  422: 'Errores de validación:',
  default: 'Error al procesar la orden. Intenta nuevamente.'
} as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default defineComponent({
  name: 'OrdersPage',
  components: {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonCard, IonCardContent, IonButton, IonChip, IonModal,
    IonSpinner, IonAlert, IonItem, IonLabel, IonRadioGroup, IonRadio,
    IonCheckbox, IonTextarea, IonIcon
  },
  
  setup() {
    // COMPOSABLES
    const route = useRoute();
    const { auth, checkAuthentication } = useAuth();
    const { currentChannel } = useMyBroadcastEvents();
    
    const userId = route.params.userId as string;

<<<<<<< HEAD
    // USAR LOS COMPOSABLES
    const { currentChannel } = useMyBroadcastEvents();
    const { setOrderUpdateCallback } = usePushNotifications();
=======
    // ESTADO PRINCIPAL
    const orders = ref<Order[]>([]);
    const selectedOrder = ref<Order | null>(null);
    const loading = ref(false);
    
    // ESTADO DE MODALES
    const showModal = ref(false);
    const showConfirmationModal = ref(false);
    const showSuccessMessage = ref(false);
    const showConfirmationSuccessAlert = ref(false);
    
    // ESTADO DE ACCIONES
    const cancelingOrder = ref(false);
    const confirmingOrder = ref(false);
    const gettingLocation = ref(false);
    
    // ESTADO DEL FORMULARIO
    const paymentMethod = ref('efectivo');
    const requiresShipping = ref(false);
    const deliveryAddress = ref('');
    const coordinates = ref<{ lat: number; lng: number } | null>(null);
    const selectedFile = ref<File | null>(null);
    const voucherBase64 = ref<string>('');
    const fileInputRef = ref<HTMLInputElement | null>(null);
>>>>>>> d6ebf60be449ddca1e5925e37e743340d05a8081

    // COMPUTED
    const isFormValid = computed(() => {
      if (paymentMethod.value === 'sinpe' && !selectedFile.value) return false;
      if (requiresShipping.value && (!deliveryAddress.value.trim() || !coordinates.value)) return false;
      return true;
    });

    // UTILIDADES
    const getStatusText = (status: string): string => {
      return STATUS_MAP[status?.toLowerCase() as keyof typeof STATUS_MAP] || status || 'Desconocido';
    };

    const getStatusColor = (status: string): string => {
      return status === 'confirmado' ? 'success' : 'medium';
    };

    const canPerformOrderActions = (status: string): boolean => {
      return status === 'esperando_confirmacion';
    };

    const formatDate = (dateString: string): string => {
      try {
        return new Date(dateString).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return dateString;
      }
    };

    const calculateTotal = (): string => {
      if (!selectedOrder.value) return '0';
      const subtotal = parseFloat(selectedOrder.value.order_total);
      const shipping = requiresShipping.value ? parseFloat(selectedOrder.value.shipping_total || '0') : 0;
      return (subtotal + shipping).toString();
    };

    const handleApiError = (status: number, errorData: any): void => {
      if (status === 422) {
        const messages = errorData.messages || {};
        const errorList = Object.values(messages).flat().join('\n');
        alert(`${ERROR_MESSAGES[422]}\n${errorList}`);
      } else {
        const message = ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
        alert(message);
      }
    };

    // FUNCIONES DE API
    const loadOrders = async (): Promise<void> => {
      try {
        loading.value = true;
        
        const response = await fetch( URL + `/users/${userId}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          orders.value = data.orders?.data || [];
        } else {
          orders.value = [];
        }
      } catch (error) {
        orders.value = [];
      } finally {
        loading.value = false;
      }
    };

<<<<<<< HEAD
    // ✅ FUNCIÓN PARA MANEJAR NOTIFICACIONES PUSH DE ÓRDENES
    const handleOrderPushNotification = (notificationData: any) => {
      console.log('🔔 [OrdersPage] Notificación push de orden recibida:', notificationData);
      
      // Si es una notificación simple (sin datos completos de la orden)
      if (notificationData.isSimpleNotification) {
        console.log('🔔 [OrdersPage] Notificación simple detectada, recargando lista completa...');
        loadOrders();
        return;
      }
      
      // Si la notificación contiene datos completos de la orden, actualizar la lista
      if (notificationData.order && notificationData.orderDetails) {
        console.log('📦 [OrdersPage] Actualizando orden desde notificación push:', {
          orderId: notificationData.order.id,
          status: notificationData.order.status,
          cantidadDetalles: notificationData.orderDetails.length
        });
        
        updateOrderInList(notificationData.order, notificationData.orderDetails);
      } else {
        // Si no tiene los datos completos, recargar la lista
        console.log('🔄 [OrdersPage] Datos incompletos en notificación, recargando lista...');
        loadOrders();
      }
    };

    // ✅ FUNCIÓN PARA ACTUALIZAR UNA ORDEN ESPECÍFICA EN LA LISTA
    const updateOrderInList = (updatedOrderData: any, orderDetailsData: any[]) => {
      const orderIndex = orders.value.findIndex(order => order.id === updatedOrderData.id);
      
      if (orderIndex !== -1) {
        // Actualizar datos generales de la orden
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          ...updatedOrderData,
          // Campos críticos de la orden
          status: updatedOrderData.status,
          order_total: updatedOrderData.order_total,
          shipping_total: updatedOrderData.shipping_total,
          updated_at: updatedOrderData.updated_at,
          // ✅ REEMPLAZAR los detalles con los que vienen del evento
          details: orderDetailsData.map((detail: any) => ({
            id: detail.id,
            order_id: detail.order_id,
            drug_id: detail.drug_id,
            requested_amount: detail.requested_amount,
            quantity_available: detail.quantity_available,
            unit_price: detail.unit_price.toString(),
            products_total: detail.products_total.toString(),
            description: detail.description,
            drug: detail.drug
          }))
        };
        
        console.log(`✅ Orden ${updatedOrderData.id} y sus ${orderDetailsData.length} detalles actualizados`);
        
        // Si el modal está abierto con esta orden, actualizarlo también
        if (selectedOrder.value && selectedOrder.value.id === updatedOrderData.id) {
          selectedOrder.value = {
            ...selectedOrder.value,
            ...updatedOrderData,
            status: updatedOrderData.status,
            order_total: updatedOrderData.order_total,
            shipping_total: updatedOrderData.shipping_total,
            updated_at: updatedOrderData.updated_at,
            // ✅ Actualizar también los detalles en el modal
            details: orders.value[orderIndex].details
          };
          
          console.log(`✅ Modal también actualizado para orden ${updatedOrderData.id}`);
=======
    const updateOrderStatus = async (orderId: number, status: string, additionalData: Record<string, any> = {}): Promise<boolean> => {
      try {
        const token = auth.value.access_token;
        if (!token) {
          alert(ERROR_MESSAGES[401]);
          return false;
>>>>>>> d6ebf60be449ddca1e5925e37e743340d05a8081
        }

        const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status, ...additionalData })
        });

        if (response.ok) return true;
        
        const errorData = await response.json().catch(() => ({}));
        handleApiError(response.status, errorData);
        return false;
      } catch (error) {
        alert('Error de conexión. Verifica tu internet.');
        return false;
      }
    };

    // FUNCIONES DE ACCIÓN
    const confirmOrder = async (event?: Event): Promise<void> => {
      event?.preventDefault();
      event?.stopPropagation();
      
      if (!selectedOrder.value || !isFormValid.value) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }

      confirmingOrder.value = true;

      const orderData: Record<string, any> = {
        payment_method: paymentMethod.value === 'sinpe' ? 1 : 0,
        requires_shipping: requiresShipping.value ? 1 : 0
      };

      if (paymentMethod.value === 'sinpe' && voucherBase64.value) {
        orderData.voucher = voucherBase64.value;
      }

      if (requiresShipping.value) {
        orderData.address = deliveryAddress.value.trim();
        if (coordinates.value) {
          orderData.lat = coordinates.value.lat;
          orderData.lot = coordinates.value.lng;
        }
      }

      const success = await updateOrderStatus(selectedOrder.value.id, 'confirmado', orderData);

      if (success) {
        confirmingOrder.value = false;
        resetConfirmationForm();
        closeAllModals();
        setTimeout(() => {
          showConfirmationSuccessAlert.value = true;
        }, 100);
      } else {
        confirmingOrder.value = false;
      }
    };

    const cancelOrder = async (): Promise<void> => {
      if (!selectedOrder.value) return;

      cancelingOrder.value = true;
      const success = await updateOrderStatus(selectedOrder.value.id, 'cancelado');

      if (success) {
        closeModal();
        showSuccessMessage.value = true;
      }
      cancelingOrder.value = false;
    };

    // FUNCIONES DE ARCHIVO
    const triggerFileInput = (): void => {
      fileInputRef.value?.click();
    };

    const validateFile = (file: File): boolean => {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return false;
      }

      return true;
    };

    const handleFileSelect = (event: Event): void => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file || !validateFile(file)) return;

      selectedFile.value = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        voucherBase64.value = reader.result as string;
      };
      reader.onerror = () => {
        alert('Error al leer el archivo');
        removeFile();
      };
      reader.readAsDataURL(file);
    };

    const removeFile = (): void => {
      selectedFile.value = null;
      voucherBase64.value = '';
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
    };

    // FUNCIONES DE GEOLOCALIZACIÓN
    const getCurrentLocation = (): void => {
      if (!navigator.geolocation) {
        alert('La geolocalización no está soportada');
        return;
      }

      gettingLocation.value = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          gettingLocation.value = false;
        },
        () => {
          gettingLocation.value = false;
          alert('Error obteniendo ubicación');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    };

    // FUNCIONES DE MODAL
    const viewOrderDetails = (order: Order): void => {
      selectedOrder.value = order;
      showModal.value = true;
    };

    const closeModal = (): void => {
      showModal.value = false;
      selectedOrder.value = null;
    };

    const openConfirmationModal = (): void => {
      showConfirmationModal.value = true;
    };

    const closeConfirmationModal = (): void => {
      if (confirmingOrder.value) return;
      showConfirmationModal.value = false;
      resetConfirmationForm();
    };

    const closeAllModals = (): void => {
      showConfirmationModal.value = false;
      showModal.value = false;
      selectedOrder.value = null;
    };

    const resetConfirmationForm = (): void => {
      paymentMethod.value = 'efectivo';
      requiresShipping.value = false;
      deliveryAddress.value = '';
      coordinates.value = null;
      selectedFile.value = null;
      voucherBase64.value = '';
    };

    // FUNCIONES DE ALERT
    const closeSuccessAlert = (): void => {
      showSuccessMessage.value = false;
    };

    const closeConfirmationSuccessAlert = (): void => {
      showConfirmationSuccessAlert.value = false;
    };

    // PUSHER
    const updateOrderInList = (newOrderData: any, newDetailsData: any[]): void => {
      const orderIndex = orders.value.findIndex(order => order.id === newOrderData.id);
      
<<<<<<< HEAD
      // ✅ Configurar callback para notificaciones push de órdenes
      console.log('🔔 [OrdersPage] Configurando callback para notificaciones push');
      setOrderUpdateCallback(handleOrderPushNotification);
      
      setTimeout(() => {
        listenToPusherEvents();
      }, 1500);
=======
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          ...newOrderData,
          details: newDetailsData.map((detail: any) => ({
            ...detail,
            unit_price: detail.unit_price.toString(),
            products_total: detail.products_total.toString()
          }))
        };
        
        if (selectedOrder.value && selectedOrder.value.id === newOrderData.id) {
          selectedOrder.value = orders.value[orderIndex];
        }
      } else {
        loadOrders();
      }
    };

    const listenToPusherEvents = (): void => {
      if (!currentChannel.value) {
        setTimeout(listenToPusherEvents, 2000);
        return;
      }

      currentChannel.value.listen('PharmacyOrderUpdate', (data: any) => {
        if (data.order && data.order.user_id == userId && data.orderDetails) {
          updateOrderInList(data.order, data.orderDetails);
        }
      });
    };

    // LIFECYCLE
    onMounted(async () => {
      await checkAuthentication();
      await loadOrders();
      setTimeout(listenToPusherEvents, 1500);
>>>>>>> d6ebf60be449ddca1e5925e37e743340d05a8081
    });

    onUnmounted(() => {
<<<<<<< HEAD
      console.log('Limpiando listeners de OrdersPage');
      // ✅ Limpiar callback de notificaciones push
      setOrderUpdateCallback(() => {});
=======
      // Cleanup listeners
>>>>>>> d6ebf60be449ddca1e5925e37e743340d05a8081
    });

    return {
      // Estado
      orders,
      showModal,
      selectedOrder,
      loading,
      cancelingOrder,
      showSuccessMessage,
      showConfirmationModal,
      paymentMethod,
      requiresShipping,
      deliveryAddress,
      coordinates,
      selectedFile,
      confirmingOrder,
      gettingLocation,
      showConfirmationSuccessAlert,
      fileInputRef,
      
      // Computed
      isFormValid,
      
      // Funciones
      getStatusText,
      getStatusColor,
      canPerformOrderActions,
      formatDate,
      calculateTotal,
      viewOrderDetails,
      closeModal,
      loadOrders,
      cancelOrder,
      closeSuccessAlert,
      openConfirmationModal,
      closeConfirmationModal,
      triggerFileInput,
      handleFileSelect,
      removeFile,
      getCurrentLocation,
      confirmOrder,
      closeConfirmationSuccessAlert
    };
  }
});
</script>

<style scoped>
.page-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading ion-spinner {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* ✅ ESTILOS PARA EL MENSAJE DE ÉXITO */
.success-message {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 1px solid #28a745;
  margin-bottom: 16px;
  animation: slideDown 0.3s ease-out, fadeOut 0.5s ease-in 3.5s forwards;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.success-content ion-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.success-content h3 {
  margin: 0 0 4px 0;
  color: #155724;
  font-weight: bold;
  font-size: 16px;
}

.success-content p {
  margin: 0;
  color: #155724;
  font-size: 14px;
}

.order-card {
  margin: 12px 0;
  background: white;
  border: 1px solid #dee2e6;
  color: #333;
  animation: slideUp 0.3s ease-out;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-header h2 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.order-info {
  margin-bottom: 16px;
}

.order-info p {
  margin: 4px 0;
  font-size: 14px;
}

.order-detail-card {
  background: white;
  border: 1px solid #dee2e6;
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
}

.total-amount {
  font-weight: bold;
  font-size: 16px;
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
}

.quantity-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 12px;
}

.medication-description {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  margin: 8px 0;
  display: inline-block;
}

.medication-info p {
  font-size: 14px;
  margin: 4px 0;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
}

ion-chip {
  --background: #f1f3f4;
  --color: #333;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
}

.order-header ion-chip {
  background: #e9ecef;
  color: #495057;
  border: 1px solid #ced4da;
}

.detail-item ion-chip {
  background: #e9ecef;
  color: #495057;
  border: 1px solid #ced4da;
}

/* ✅ ESTILOS PARA LOS BOTONES DE CONFIRMACIÓN */
.confirmation-buttons {
  margin-top: 24px;
  padding: 16px 0;
}

.confirm-button {
  margin-bottom: 12px;
}

.cancel-button {
  margin-bottom: 0;
}

/* ✅ ESTILOS PARA EL MODAL DE CONFIRMACIÓN */
.form-card {
  margin: 16px 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
}

.voucher-section {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.upload-button {
  margin-top: 8px;
}

.voucher-preview {
  margin-top: 12px;
}

.voucher-card {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.voucher-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.voucher-placeholder p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.shipping-section {
  margin-top: 16px;
  padding: 12px;
  background: #f0f8f0;
  border-radius: 8px;
}

.coordinates-button {
  margin-top: 8px;
}

.coordinates-display {
  margin-top: 12px;
}

.coordinates-card {
  background: #fff3e0;
  border: 1px solid #ff9800;
}

.coordinates-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coordinates-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #333;
}

.order-summary {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-row:last-child {
  border-bottom: none;
}

.total-row {
  border-top: 2px solid #333;
  margin-top: 8px;
  padding-top: 12px;
  font-size: 16px;
}

.confirmation-form-buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cancel-form-button {
  height: 48px;
  font-weight: 600;
}

.confirm-form-button {
  height: 48px;
  font-weight: 600;
}

/* ✅ ESTILOS PARA EL ALERT DE ÉXITO */
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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ✅ ANIMACIONES PARA EL MENSAJE DE ÉXITO */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>