import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const appointmentRequests = ref<any>([]);

const useAppointmentRequests = () => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])


  const createAppointmentRequest = async (form: any) => {

    const { user_id, office_id, medic_id, patient_id  } = form
    const dataToSave = { user_id, office_id, medic_id, patient_id }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post(`/appointments/request/${medic_id}/${user_id}`, dataToSave)

      appointmentRequests.value = [data, ...appointmentRequests.value];

      isLoading.value = false

      return { ok: true, appointmentRequest: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const getAppointmentRequestUri = async (medic_id: any) => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.post('/appointment/request/uri', { medic_id })

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return null


    }

  }


  return {
    isLoading: computed(() => isLoading.value),
    appointmentRequests: computed(() => appointmentRequests.value),
    errorMessage: computed(() => errorMessage.value),
    errors: computed(() => errors.value),
    getAppointmentRequestUri,
    createAppointmentRequest
   
  }

}


export default useAppointmentRequests