import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import useAuth from '@/modules/auth/composables/useAuth';
import { actionSheetController, alertController } from '@ionic/vue';
import { close, thermometer, cloudUpload } from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { Patient } from '@/interfaces/patients';
import useUi from '@/composables/useUi';

const patients = ref<Patient[]>([]);

const usePatients = () => {

  const conditions = ref([]);
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const { auth } = useAuth()
  const { alertMessage } = useUi()
  const router = useRouter()
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
        currentPage.value = data.meta.current_page;
        lastPage.value =  data.meta.last_page
        errorMessage.value = null
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getPatient = async (id: number) => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + id)

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  const createPatient = async (form: any) => {

    const { tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, city, conditions } = form
    const dataToSave = { tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, city, conditions }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post<Patient>('/medic/patients', dataToSave)

      patients.value = [ data, ...patients.value];

      isLoading.value = false

      return { ok: true, patient: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const updatePatient = async (form: any) => {

    const { id, tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, city, conditions } = form
    const dataToSave = { id, tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, city, conditions }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.put('/medic/patients/' + form.id, dataToSave)

      const idx = patients.value.map( pat => pat.id ).indexOf( form.id );
      patients.value[idx] = data

      isLoading.value = false

      return { ok: true, patient: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }

  const deletePatient = async (id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete('/medic/patients/' + id)

      patients.value = patients.value.filter(
        (pat: any) => pat.id !== id
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

  const getConditions = async () => {


    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/conditions')

      if (data.length > 0) {
        conditions.value = data
        errorMessage.value = null
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const requestPatientAuthorization = async (form: any) => {

    const { id } = form
  

    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.post('/patients/' + id + '/request-authorization')

      isLoading.value = false

      return { ok: true };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const checkPatientAuthorization = async (patientId:any, code: string) => {
    
    try {

      const { data } = await gpsApi.post("/patients/"+ patientId +"/authorization", { code });

      const idx = patients.value.map( pat => pat.id ).indexOf( patientId );
      patients.value[idx] = data.data
     

      return { ok: true, code };

    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const onConfirmDelete = async (patient: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Eliminar',
      message: 'Eliminar Paciente ' + patient.first_name,
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
            const { ok, message } = await deletePatient(patient.id);
            if (!ok) alertMessage('Error', message)
            else {
              patients.value = patients.value.filter((pa: any) => pa.id !== patient.id)
            }
          },
        },
      ],
    });
    return alert.present();
  };

  const presentOptions = async (patient: any) => {
    const actionSheet = await actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Resultados de Laboratorio',
          icon: thermometer,
          cssClass: patient.authorized_medic ? '' : 'disabled-present-option',
          handler: () => {
            if(patient.authorized_medic){
              router.push({ name: 'medic-patient-lab-results', params: { id: patient.id } })
            }

          },
        },
        {
          text: 'Subir Resultado Laboratorio',
          icon: cloudUpload,
          cssClass: patient.authorized_medic ? '' : 'disabled-present-option',
          handler: () => {
            if(patient.authorized_medic){
              router.push({ name: 'medic-patient-lab-result', params: { patientId: patient.id, id: 'new' } })
            }

          },
        },
        // {
        //   text: 'Editar',
        //   icon: create,
        //   handler: () => {
        //     router.push({ name: 'medic-patient', params: { id: patient.id } })

        //   },
        // },
        // {
        //   text: 'Eliminar',
        //   role: "destructive",
        //   icon: trash,
        //   handler: () => {
        //     onConfirmDelete(patient);
        //   },
        // },
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

  getPatients({ q:'', labresults: 1});

  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    patients: computed( () => patients.value ),
    conditions: computed( () => conditions.value ),
    errors: computed( () => errors.value ),
    nextPage: (filters: any) => getPatients(filters, currentPage.value + 1),
    prevPage: (filters: any) => getPatients(filters,currentPage.value - 1),
    presentOptions,
    getPatient,
    getPatients,
    createPatient,
    updatePatient,
    getConditions,
    requestPatientAuthorization,
    checkPatientAuthorization
    
  }

}


export default usePatients