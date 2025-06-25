import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const schedules = ref<any[]>([]);

const useSchedules = () => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])


  const getSchedules = async (filters: any, page = 1) => {

    const { medicId, officeId, date1, date2, order, dir } = filters;

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/medics/'+ medicId +'/schedules', {
        params: { office: officeId, date1, date2, order, dir }
      })

   
        schedules.value = data;
      
        errorMessage.value = null
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  

  return {
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    schedules: computed( () => schedules.value ),
    errors: computed( () => errors.value ),
    getSchedules
  }

}


export default useSchedules