import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const appointmentConsultations = ref<any>([]);

const useAppointmentConsultations = () => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])


  const createAppointmentConsultation = async (form: any, files: any[] = []) => {

    const { user_id, office_id, medic_id, patient_id  } = form
    const dataToSave = { user_id, office_id, medic_id, patient_id }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.postForm(`/appointments/consultation/${medic_id}/${user_id}`, {
        ...dataToSave,
        files
      })

      appointmentConsultations.value = [data, ...appointmentConsultations.value];

      isLoading.value = false

      return { ok: true, appointmentConsultation: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  


  return {
    isLoading: computed(() => isLoading.value),
    appointmentConsultations: computed(() => appointmentConsultations.value),
    errorMessage: computed(() => errorMessage.value),
    errors: computed(() => errors.value),
    createAppointmentConsultation
   
  }

}


export default useAppointmentConsultations