import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';


const useCommissionTransactions = () => {

  
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])
  const commissionTransactions = ref<any[]>([]);
  const totals = ref<any>();


  const getCommissionTransactions = async (page = 1) => {

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/medic/commission-transactions', {
        params: { page }
      })

      if(page === 1){
        commissionTransactions.value = [];
      }
      
      if(data.data && data.data.length > 0){
        commissionTransactions.value.push(...data.data)
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

  

  
  return {
    currentPage,
    lastPage,
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    commissionTransactions: computed( () => commissionTransactions.value ),
    totals: computed( () => totals.value ),
    errors: computed( () => errors.value ),
    nextPage: () => getCommissionTransactions(currentPage.value + 1),
    prevPage: () => getCommissionTransactions(currentPage.value - 1),
    getCommissionTransactions,
  }

}


export default useCommissionTransactions