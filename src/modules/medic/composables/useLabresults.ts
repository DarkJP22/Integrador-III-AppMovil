import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import { actionSheetController, alertController } from '@ionic/vue';
import { trash, close } from 'ionicons/icons'
import useUi from '@/composables/useUi';
import useUtilities from '@/composables/useUtilities';

const labresults = ref<any[]>([]);
const notificationsLabresults = ref<any[]>([]);

const useLabresults = () => {
  const { toFormData } = useUtilities(); 
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const { alertMessage } = useUi()
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
      const { data } = await gpsApi.get(`/medic/patients/${patientId}/lab-results`, {
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

  // const getPatient = async (id: number) => {

  //   try {
  //     isLoading.value = true

  //     // const userId = auth.value.user ? auth.value.user.id : null
  //     const { data } = await gpsApi.get('/patients/' + id)

  //     isLoading.value = false
  //     return data;

  //   } catch (error) {
  //     isLoading.value = false
  //     //throw error
  //     return {}


  //   }

  // }

  const createLabresult = async (form: any, files: any[] = []) => {

    const { patient_id, date, description } = form
    const dataToSave = { patient_id, date, description }

    const formData = toFormData(dataToSave);

      formData.append('file', files[0])
  

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post(`/medic/patients/${patient_id}/lab-results`, formData)

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

  

  const deleteLabresult = async (patientId: number, id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete(`/medic/patients/${patientId}/lab-results/${id}`)

      labresults.value = labresults.value.filter(
        (res: any) => res.id !== id
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

  const onConfirmDelete = async (labresult: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Eliminar',
      message: 'Eliminar Resultado ' + labresult.name,
      buttons: [
        {
          text: 'cancel',
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //
          },
        },
        {
          text: 'Eliminar',
          cssClass: "confirm",
          handler: async () => {
            // await deletePatient(patient.id);
            // getPatients()
            const { ok, message } = await deleteLabresult(labresult.patient_id, labresult.id);
            if (!ok) alertMessage('Error', message)
            else {
              labresults.value = labresults.value.filter((res: any) => res.id !== labresult.id)
            }
          },
        },
      ],
    });
    return alert.present();
  };

  const presentOptions = async (labresult: any) => {
    const actionSheet = await actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Eliminar',
          role: "destructive",
          icon: trash,
          handler: () => {
            onConfirmDelete(labresult);
           
          },
        },
        {
          text: 'Cerrar',
          icon: close,
          role: "cancel",
          handler: () => {
            //
          },
        },
      ],
    });
    return actionSheet.present();
  };

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
    presentOptions,
    getLabresults,
    createLabresult,
    addNotification,
    clearNotifications
    
  }

}


export default useLabresults