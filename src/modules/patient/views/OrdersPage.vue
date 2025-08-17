<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Ordenes</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENIDO PRINCIPAL -->
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        
        <h1 class="page-title">Mis Ordenes</h1>
        
        <!-- LOADING -->
        <div class="loading" v-if="loading">
          <ion-spinner></ion-spinner>
          <p>Cargando ordenes...</p>
        </div>
        
        <!-- MENSAJE CUANDO NO HAY ORDENES -->
        <div class="empty-state" v-else-if="orders.length === 0">
          <h2>No tienes ordenes</h2>
          <p>Cuando realices tu primera orden aparecerá aquí</p>
        </div>
        
        <!-- LISTA DE ORDENES -->
        <ion-card 
          v-for="order in orders" 
          :key="order.id" 
          class="order-card"
        >
          <ion-card-content>
            
            <!-- HEADER DE LA ORDEN -->
            <div class="order-header">
              <h2>{{ order.consecutive }}</h2>
              <ion-chip>
                {{ getStatusText(order.status) }}
              </ion-chip>
            </div>
            
            <!-- INFORMACIÓN DE LA ORDEN -->
            <div class="order-info">
              <p><strong>Farmacia:</strong> {{ order.pharmacy.name }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(order.date) }}</p>
              <p><strong>Medicamentos:</strong> {{ order.details.length }} items</p>
              <p><strong>Total:</strong> ₡{{ order.order_total }}</p>
            </div>
            
            <!-- BOTÓN PARA VER DETALLES -->
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
    
    <!-- MODAL DE DETALLES -->
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
          
          <!-- INFORMACIÓN GENERAL -->
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
          
          <!-- MEDICAMENTOS -->
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
          
        </div>
      </ion-content>
    </ion-modal>
    
  </ion-page>
</template>

<script lang="ts">
// filepath: c:\Users\UTN\Documents\Repositorio-Integrador-Mobil\Integrador-III-AppMovil\src\modules\patient\views\OrdersPage.vue
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonCard, IonCardContent, IonButton, IonChip, IonModal,
  IonSpinner
} from '@ionic/vue';

// IMPORTAR COMPOSABLES
import { useMyBroadcastEvents } from '@/composables/useMyBroadcastEvents';
import usePushNotifications from '@/composables/usePushNotifications';

const URL = import.meta.env.VITE_API_URL;

// INTERFACES (mantener iguales)
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

export default defineComponent({
  name: 'OrdersPage',
  components: {
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle,
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonButton, 
    IonChip, 
    IonModal,
    IonSpinner
  },
  
  setup() {
    // ESTADO REACTIVO
    const orders = ref<Order[]>([]);
    const showModal = ref(false);
    const selectedOrder = ref<Order | null>(null);
    const loading = ref(false);

    // CONFIGURACIÓN
    const route = useRoute();
    const userId = route.params.userId as string;

    // USAR LOS COMPOSABLES
    const { currentChannel } = useMyBroadcastEvents();
    const { setOrderUpdateCallback } = usePushNotifications();

    // FUNCIONES PRINCIPALES
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
          console.error('Error al cargar ordenes:', response.status);
          orders.value = [];
        }
        
      } catch (error) {
        console.error('Error de red al cargar ordenes:', error);
        orders.value = [];
      } finally {
        loading.value = false;
      }
    };

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
        }
        
        return true;
      } else {
        // Si no existe la orden, puede ser nueva - recargar la lista completa
        console.log('🔄 Orden nueva detectada, recargando lista completa...');
        loadOrders();
        return false;
      }
    };

    // ✅ FUNCIÓN PARA ESCUCHAR EVENTO PharmacyOrderUpdate
    const listenToPusherEvents = () => {
      if (!currentChannel.value) {
        setTimeout(listenToPusherEvents, 2000);
        return;
      }

      // Escuchar únicamente el evento PharmacyOrderUpdate
      currentChannel.value.listen('PharmacyOrderUpdate', (data: any) => {
        console.log('🔥 PharmacyOrderUpdate evento completo:', data);
        
        // Verificar que sea del usuario actual y actualizar
        if (data.order && data.order.user_id == userId && data.orderDetails) {
          console.log('📦 Actualizando orden con detalles:', {
            orderId: data.order.id,
            status: data.order.status,
            total: data.order.order_total,
            cantidadDetalles: data.orderDetails.length
          });
          
          // ✅ Pasar orderDetails directamente desde data.orderDetails
          updateOrderInList(data.order, data.orderDetails);
        }
      });
    };

    // FUNCIONES DE UTILIDAD (mantener iguales)
    const getStatusText = (status: string): string => {
      const statusMap: Record<string, string> = {
        'cotizacion': 'Cotización',
        'aprobado': 'Aprobado',
        'esperando_confirmacion': 'Esperando Confirmación',
        'confirmado': 'Confirmado',
        'cancelado': 'Cancelado',
        'preparando': 'Preparando',
        'despachado': 'Despachado'
      };
      
      return statusMap[status?.toLowerCase()] || status || 'Desconocido';
    };

    const formatDate = (dateString: string): string => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return dateString;
      }
    };

    // FUNCIONES DEL MODAL (mantener iguales)
    const viewOrderDetails = (order: Order): void => {
      selectedOrder.value = order;
      showModal.value = true;
    };

    const closeModal = (): void => {
      showModal.value = false;
      selectedOrder.value = null;
    };

    // INICIALIZACIÓN
    onMounted(async () => {
      await loadOrders();
      
      // ✅ Configurar callback para notificaciones push de órdenes
      console.log('🔔 [OrdersPage] Configurando callback para notificaciones push');
      setOrderUpdateCallback(handleOrderPushNotification);
      
      setTimeout(() => {
        listenToPusherEvents();
      }, 1500);
    });

    // LIMPIEZA
    onUnmounted(() => {
      console.log('Limpiando listeners de OrdersPage');
      // ✅ Limpiar callback de notificaciones push
      setOrderUpdateCallback(() => {});
    });

    // RETURN
    return {
      // Estado
      orders,
      showModal,
      selectedOrder,
      loading,
      
      // Funciones
      getStatusText,
      formatDate,
      viewOrderDetails,
      closeModal,
      loadOrders
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
</style>