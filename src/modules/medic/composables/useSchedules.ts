import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const schedules = ref<any[]>([]);

const useSchedules = () => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])


  const getSchedules = async (filters: any, page = 1) => {

    const { medicId, officeId, date1, date2 } = filters;

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/medics/'+ medicId +'/schedules', {
        params: { office: officeId, date1, date2 }
      })

   
        schedules.value = data;
      
        errorMessage.value = null
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getSchedule = async (id: number) => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.get('/medic/schedules/' + id)

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }
  const createSchedules = async (form: any, slotDuration: any) => {

    //const { title, dates, start, end, user_id, office_id  } = form
    const dataToSave = { schedules: [...form], slotDuration }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/medic/schedules/all', dataToSave)

      schedules.value = [...data, ...schedules.value];

      isLoading.value = false

      return { ok: true, schedules: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const createSchedule = async (form: any) => {

    const { title, date, start, end, user_id, office_id  } = form
    const dataToSave = { title, date, start, end, user_id, office_id }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/medic/schedules', dataToSave)

      schedules.value = [data, ...schedules.value];

      isLoading.value = false

      return { ok: true, schedule: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const deleteSchedule = async (id: number) => {


    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.delete('/medic/schedules/' + id)

      schedules.value = schedules.value.filter(
        (schedule: any) => schedule.id !== id
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

  

  return {
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    schedules: computed( () => schedules.value ),
    errors: computed( () => errors.value ),
    getSchedules,
    getSchedule,
    createSchedule,
    createSchedules,
    deleteSchedule
  }

}


export default useSchedules