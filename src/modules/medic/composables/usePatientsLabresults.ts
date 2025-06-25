import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import useAuth from '@/modules/auth/composables/useAuth';
import { Patient } from '@/interfaces/patients';


const patients = ref<Patient[]>([]);

const usePatientsLabresults = () => {

  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const { auth } = useAuth()
  const errors = ref<any>([])


  const getPatients = async (filters: any, page = 1) => {

    const { q, labresults } = filters;

    if (page <= 0) page = 1

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/medic/' + auth.value.user.id + '/patients', {
        params: { q, labresults, page }
      })

      if(page === 1){
        patients.value = [];
      }
      
      if(data.data && data.data.length > 0){
        patients.value.push(...data.data)
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

  

  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    patients: computed( () => patients.value ),
    errors: computed( () => errors.value ),
    nextPage: (filters: any) => getPatients(filters, currentPage.value + 1),
    prevPage: (filters: any) => getPatients(filters,currentPage.value - 1),
    getPatients,
    
  }

}


export default usePatientsLabresults