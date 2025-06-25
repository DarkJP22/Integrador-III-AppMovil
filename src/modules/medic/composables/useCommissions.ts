import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const notificationsCommissions = ref<any[]>([]);

const useCommissions = () => {

  
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])
  const commissions = ref<any[]>([]);
  const transactions = ref<any[]>([]);
  const totals = ref<any>();

  const addNotification = async (notification: any) => {
    
    const noti = notificationsCommissions.value.find( noti => noti?.id === notification.id);

    if(!noti){
      notificationsCommissions.value.push(notification);
    }
    
  }
  const clearNotifications = async () => {
    notificationsCommissions.value = [];
  }

  const getCommissions = async (page = 1) => {

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/medic/commissions', {
        params: { page }
      })

      if(page === 1){
        commissions.value = [];
      }
      
      if(data.data && data.data.length > 0){
        commissions.value.push(...data.data)
        currentPage.value = data.meta.current_page;
        lastPage.value =  data.meta.last_page
        errorMessage.value = null
        totals.value = data.meta.totals
      }
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getTransactions = async (commissionId: any, page = 1) => {

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/medic/commissions/'+ commissionId + '/transactions', {
        params: { page }
      })

      if(page === 1){
        transactions.value = [];
      }
      
      if(data.data && data.data.length > 0){
        transactions.value.push(...data.data)
        currentPage.value = data.meta.current_page;
        lastPage.value =  data.meta.last_page
        errorMessage.value = null
      }
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  

  
  return {
    currentPage,
    lastPage,
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    commissions: computed( () => commissions.value ),
    notificationsCommissions: computed( () => notificationsCommissions.value ),
    transactions: computed( () => transactions.value ),
    totals: computed( () => totals.value ),
    errors: computed( () => errors.value ),
    nextPage: () => getCommissions(currentPage.value + 1),
    prevPage: () => getCommissions(currentPage.value - 1),
    getCommissions,
    getTransactions,
    addNotification,
    clearNotifications
  }

}


export default useCommissions