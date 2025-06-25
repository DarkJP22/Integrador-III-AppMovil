import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const nextAppointments = ref<any>([])
const historyAppointments = ref<any>([]);
const medicAppointments = ref<any>([]);
const notificationsAppointments = ref<any[]>([]);
const useAppointments = () => {

  const isLoading = ref(false)
  const currentPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])

  const addNotification = async (notification: any) => {
    const noti = notificationsAppointments.value.find( noti => noti?.id === notification.id);

    if(!noti){
      notificationsAppointments.value.push(notification);
    }
    
  }
  const clearNotifications = async () => {
    notificationsAppointments.value = [];
  }

  const getPatientAppointments = async (id: number, page = 1) => {
    
    nextAppointments.value = [];
    historyAppointments.value = [];

    if (page <= 0) page = 1

    isLoading.value = true

    const { data } = await gpsApi.get(`/medic/patients/${id}/appointments`, {
      params: { page }
    })

    nextAppointments.value = data.scheduledAppointments
    historyAppointments.value = data.initAppointments



    isLoading.value = false

  }

  const getAppointments = async (filters: any, page = 1) => {

    const { q, status } = filters;

    if (page <= 0) page = 1

    isLoading.value = true

    const { data } = await gpsApi.get('/medic/appointments', {
       params: { q, page, status }
    })

    nextAppointments.value = data.scheduledAppointments
    historyAppointments.value = data.initAppointments



    isLoading.value = false

  }

  const getAppointment = async (id: number) => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.get('/medic/appointments/' + id)

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  const updateStatusAppointment = async (form: any) => {

    const { id, status } = form
    const dataToSave = { id, status: +status }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.put('/medic/appointments/' + form.id, dataToSave)

      let idx = nextAppointments.value.map( (app:any) => app.id ).indexOf( form.id );
      nextAppointments.value[idx] = data

      idx = historyAppointments.value.map( (app:any) => app.id ).indexOf( form.id );
      historyAppointments.value[idx] = data

      isLoading.value = false

      return { ok: true, appointment: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


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
    notificationsAppointments: computed( () => notificationsAppointments.value ),
    nextPage: () => getAppointments(currentPage.value + 1),
    prevPage: () => getAppointments(currentPage.value - 1),
    getAppointments,
    getAppointment,
    deleteAppointment,
    getPatientAppointments,
    updateStatusAppointment,
    addNotification,
    clearNotifications
  }

}


export default useAppointments