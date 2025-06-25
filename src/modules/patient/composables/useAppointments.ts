import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
const nextAppointments = ref<any>([])
const historyAppointments = ref<any>([]);
const medicAppointments = ref<any>([]);

const useAppointments = () => {

  const isLoading = ref(false)
  const currentPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])

  const getAppointmentsByMedicAndClinic = async (filters: any) => {

    const { medicId, officeId, date1, date2 } = filters;

    isLoading.value = true

    const { data } = await gpsApi.get('/medics/' + medicId + '/appointments', {
      params: { office: officeId, date1, date2 }
    })

    medicAppointments.value = data

    isLoading.value = false

  }

  const getAppointments = async (page = 1, filters = {}) => {

    if (page <= 0) page = 1

    isLoading.value = true

    const { data } = await gpsApi.get('/appointments', {
      params: { page, ...filters}
    })

    nextAppointments.value = data.scheduledAppointments
    historyAppointments.value = data.initAppointments



    isLoading.value = false

  }

  const createAppointment = async (form: any) => {

    const { title, date, start, end, user_id, patient_id, office_id, cost, available_accumulated_discount, total_cost  } = form
    const dataToSave = { title, date, start, end, user_id, patient_id, office_id, cost, available_accumulated_discount, total_cost }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/reservations', dataToSave)

      medicAppointments.value = [data.appointment, ...medicAppointments.value];

      isLoading.value = false

      return { ok: true, appointment: data.appointment };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const uploadSinpeFile = async (appointmentId: number, file: any) => {
     
      try {
        isLoading.value = true

        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
    
         const { data } = await gpsApi.post('/appointments/' + appointmentId + '/upload-sinpe', bodyFormData);

         isLoading.value = false

        return { ok: true, appointment: data };

        } catch (error: any) {
          isLoading.value = false

          if (error.response.status !== 422) throw error

          errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
          return { ok: false, message: error.response.data.message }

    }

  };

  const getAppointment = async (id: number) => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.get('/appointments/' + id)

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }



  const getAppointmentPDF = async (id: number) => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.get('/appointments/' + id + '/pdf')

      // const { data } = await gpsApi.get('/appointments/' + id + '/pdf', { responseType: 'blob'})
      // const base64Data = (await convertBlobToBase64(data)) as string;
      // const fileName = 'summary.pdf';
      // const rawFileUri = await Filesystem.writeFile({
      //   path: fileName,
      //   data: base64Data,
      //   directory: Directory.Data
      // });

      // const file = await Filesystem.readFile({
      //   path: fileName,
      //   directory: Directory.Data,
      // });

      // const fileUri = `data:application/pdf;base64,${file.data}`;
      
     //const fileUri = Capacitor.convertFileSrc(rawFileUri.uri)
    
      isLoading.value = false
    
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return '';


    }

  }

  const deleteAppointment = async (id: number) => {


    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.delete('/appointments/' + id)

      nextAppointments.value = nextAppointments.value.filter(
        (appointment: any) => appointment.id !== id
      );
      medicAppointments.value = medicAppointments.value.filter(
        (appointment: any) => appointment.id !== id
      );

      isLoading.value = false

      return { ok: true, id };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  //getAppointments()


  return {
    currentPage: computed(() => currentPage.value),
    isLoading: computed(() => isLoading.value),
    nextAppointments: computed(() => nextAppointments.value),
    historyAppointments: computed(() => historyAppointments.value),
    medicAppointments: computed(() => medicAppointments.value),
    errorMessage: computed(() => errorMessage.value),
    errors: computed(() => errors.value),
    nextPage: () => getAppointments(currentPage.value + 1),
    prevPage: () => getAppointments(currentPage.value - 1),
    getAppointments,
    getAppointment,
    getAppointmentPDF,
    createAppointment,
    deleteAppointment,
    getAppointmentsByMedicAndClinic,
    uploadSinpeFile
  }

}


export default useAppointments