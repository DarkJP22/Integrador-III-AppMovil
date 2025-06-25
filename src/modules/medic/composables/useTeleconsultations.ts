import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const teleconsultations = ref<any>([]);
const notificationsTeleconsultations = ref<any[]>([]);
const useTeleconsultations = () => {

  const isLoading = ref(false)
  const currentPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])

  const addNotification = async (notification: any) => {
    const noti = notificationsTeleconsultations.value.find( noti => noti?.id === notification.id);

    if(!noti){
      notificationsTeleconsultations.value.push(notification);
    }
    
  }
  const clearNotifications = async () => {
    notificationsTeleconsultations.value = [];
  }


  const getTeleconsultations = async (filters: any, page = 1) => {

    const { q, status } = filters;

    if (page <= 0) page = 1

    isLoading.value = true

    const { data } = await gpsApi.get('/medic/teleconsultations', {
       params: { q, page, status }
    })

    teleconsultations.value = data
  



    isLoading.value = false

  }

 
  //getTeleconsultations()


  return {
    currentPage: computed(() => currentPage.value),
    isLoading: computed(() => isLoading.value),
    teleconsultations: computed(() => teleconsultations.value),
    errorMessage: computed(() => errorMessage.value),
    errors: computed(() => errors.value),
    notificationsTeleconsultations: computed( () => notificationsTeleconsultations.value ),
    nextPage: () => getTeleconsultations(currentPage.value + 1),
    prevPage: () => getTeleconsultations(currentPage.value - 1),
    getTeleconsultations,
    addNotification,
    clearNotifications
  }

}


export default useTeleconsultations