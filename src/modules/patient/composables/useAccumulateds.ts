import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';


const useAccumulateds = () => {


  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])
  const trasactions = ref<any[]>([]);


  const getTrasactions = async (accumulatedId: any, page = 1) => {

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/accumulateds/'+ accumulatedId + '/trasactions', {
        params: { page }
      })

      if(page === 1){
        trasactions.value = [];
      }
      
      if(data.data && data.data.length > 0){
        trasactions.value.push(...data.data)
        currentPage.value = data.current_page;
        lastPage.value =  data.last_page
        errorMessage.value = null
      }
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getAccumulated = async (id: number) => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/accumulateds/' + id)

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  
  return {
    currentPage,
    lastPage,
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    trasactions: computed( () => trasactions.value ),
    errors: computed( () => errors.value ),
    nextPage: (accumulatedId: any) => getTrasactions(accumulatedId, currentPage.value + 1),
    prevPage: (accumulatedId: any) => getTrasactions(accumulatedId, currentPage.value - 1),
    getAccumulated,
  }

}


export default useAccumulateds