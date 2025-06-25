import { computed, ref, watch } from 'vue'
import gpsApi from '@/services/gpsApi';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import useAuth from '@/modules/auth/composables/useAuth';

const nextAppointmentRequests = ref<any>([])
const historyAppointmentRequests = ref<any>([]);
const notificationsAppointmentRequests = ref<any[]>([]);
const filters = ref<any>({
  q: "",
  status: [0, 2] //nuevas y pendientes
});

const useAppointmentRequests = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const errors = ref<any>([])


  const addNotification = async (notification: any) => {
   
    const noti = notificationsAppointmentRequests.value.find( noti => noti?.id === notification.id);
 
    if (!noti) {
      notificationsAppointmentRequests.value.push(notification);
    }

  }
  const clearNotifications = async () => {
    notificationsAppointmentRequests.value = [];
  }

  // const getAppointmentRequests = async (page = 1) => {

  //   const { q, status } = filters.value;

  //   if (page <= 0) page = 1

  //   isLoading.value = true

  //   const { data } = await gpsApi.get('/medic/appointments/requests', {
  //     params: { q, status, page }
  //   })

  //   nextAppointmentRequests.value = data.scheduledAppointments
  //   historyAppointmentRequests.value = data.initAppointments



  //   isLoading.value = false

  // }
  const getAppointmentRequests = async (page = 1) => {

    const { q, status } = filters.value;

    if (page <= 0) page = 1

    const { data } = await gpsApi.get('/medic/appointments/requests', {
      params: { q, status, page }
    })

    return data;


  }


  // const getAppointmentRequest = async (id: number) => {

  //   try {
  //     isLoading.value = true

  //     const { data } = await gpsApi.get('/medic/appointments/requests/' + id)

  //     isLoading.value = false
  //     return data;

  //   } catch (error) {
  //     isLoading.value = false
  //     //throw error
  //     return {}


  //   }

  // }

  // const updateStatusAppointmentRequest = async (form: any) => {

  //   const { id, status } = form
  //   const dataToSave = { id, status: +status }

  //   try {
  //     errors.value = [];
  //     isLoading.value = true

  //     const { data } = await gpsApi.put('/medic/appointments/requests/' + form.id, dataToSave)

  //     let idx = nextAppointmentRequests.value.map( (appReq:any) => appReq.id ).indexOf( form.id );
  //     nextAppointmentRequests.value[idx] = data

  //     idx = historyAppointmentRequests.value.map( (appReq:any) => appReq.id ).indexOf( form.id );
  //     historyAppointmentRequests.value[idx] = data

  //     isLoading.value = false

  //     return { ok: true, appointmentRequest: data };

  //   } catch (error: any) {
  //     isLoading.value = false

  //     if (error.response.status !== 422) throw error

  //     errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
  //     return { ok: false, message: error.response.data.message }


  //   }

  // }

  // const updateAppointmentRequest = async (form: any) => {

  //   const { id, scheduled_date, start, end, status } = form
  //   const dataToSave = { id, scheduled_date, start, end, status: +status }

  //   try {
  //     errors.value = [];
  //     isLoading.value = true

  //     const { data } = await gpsApi.put('/medic/appointments/requests/' + form.id, dataToSave)

  //     let idx = nextAppointmentRequests.value.map( (appReq:any) => appReq.id ).indexOf( form.id );
  //     nextAppointmentRequests.value[idx] = data

  //     idx = historyAppointmentRequests.value.map( (appReq:any) => appReq.id ).indexOf( form.id );
  //     historyAppointmentRequests.value[idx] = data

  //     idx = medicAppointmentRequests.value.map( (appReq:any) => appReq.id ).indexOf( form.id );
  //     medicAppointmentRequests.value[idx] = data

  //     isLoading.value = false

  //     return { ok: true, appointmentRequest: data };

  //   } catch (error: any) {
  //     isLoading.value = false

  //     if (error.response.status !== 422) throw error

  //     errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
  //     return { ok: false, message: error.response.data.message }


  //   }

  // }

  async function refetchAppointmentRequests() {
    
      await queryClient.refetchQueries({ queryKey: ['appointmentRequests', 1, filters] });
   

}

  const enabled = computed(() => auth.value.isMedic && auth.value.status === 'authenticated');

  const { isLoading, data } = useQuery({
    queryKey: ['appointmentRequests', 1, filters],
    queryFn: () => getAppointmentRequests(1),
    retry: false,
    enabled
  });

  watch(data, newVal => {
    if (newVal) {
      nextAppointmentRequests.value = newVal.scheduledAppointments
      historyAppointmentRequests.value = newVal.initAppointments
    }
  }, { immediate: true });


  return {
    filters,
    isLoading: computed(() => isLoading.value),
    nextAppointmentRequests: computed(() => nextAppointmentRequests.value),
    historyAppointmentRequests: computed(() => historyAppointmentRequests.value),
    errors: computed(() => errors.value),
    notificationsAppointmentRequests: computed(() => notificationsAppointmentRequests.value),
    addNotification,
    clearNotifications,
    refetchAppointmentRequests
  }

}


export default useAppointmentRequests