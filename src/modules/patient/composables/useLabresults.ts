import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import useUtilities from '@/composables/useUtilities';


const labresults = ref<any[]>([]);
const notificationsLabresults = ref<any[]>([]);

const useLabresults = () => {
  const { toFormData } = useUtilities(); 
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])

  const addNotification = async (notification: any) => {
    const noti = notificationsLabresults.value.find( noti => noti?.id === notification.id);

    if(!noti){
      notificationsLabresults.value.push(notification);
    }
    
  }
  const clearNotifications = async () => {
    notificationsLabresults.value = [];
  }

  const getLabresults = async (patientId: number, filters: any, page = 1) => {

    const { q } = filters;

    if (page <= 0) page = 1

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get(`/patients/${patientId}/lab-results`, {
        params: { q, page }
      })

      if(page === 1){
        labresults.value = [];
      }
      
      if(data.data && data.data.length > 0){
        labresults.value.push(...data.data)
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

  const createLabresult = async (form: any, files: any[] = []) => {

    const { patient_id, date, description } = form
    const dataToSave = { patient_id, date, description }

    const formData = toFormData(dataToSave);

      formData.append('file', files[0])
  

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post(`/patients/${patient_id}/lab-results`, formData)

      labresults.value = [ data, ...labresults.value];

      isLoading.value = false

      return { ok: true, patient: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const deleteLabresult = async (patientId: number, labresultId: number) => {
    
    try {
      isLoading.value = true

      await gpsApi.delete(`/patients/${patientId}/lab-results/${labresultId}`)

      const index = labresults.value.findIndex( (labresult: any) => labresult.id === labresultId);
      labresults.value.splice(index, 1);

      isLoading.value = false

      return { ok: true };

    } catch (error: any) {
      isLoading.value = false
      return { ok: false, message: error.response.data.message }

    }

  }


  


  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    labresults: computed( () => labresults.value ),
    notificationsLabresults: computed( () => notificationsLabresults.value ),
    errors: computed( () => errors.value ),
    nextPage: (patientId: number, filters: any) => getLabresults(patientId, filters, currentPage.value + 1),
    prevPage: (patientId: number, filters: any) => getLabresults(patientId, filters, currentPage.value - 1),
    getLabresults,
    addNotification,
    clearNotifications,
    createLabresult,
    deleteLabresult
    
  }

}


export default useLabresults