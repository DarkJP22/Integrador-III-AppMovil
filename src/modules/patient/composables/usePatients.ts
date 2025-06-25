import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import useAuth from '@/modules/auth/composables/useAuth';
import { actionSheetController, alertController } from '@ionic/vue';
import { trash, close, create } from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { Patient } from '@/interfaces/patients';
import useUi from '@/composables/useUi';

const currentPatient = ref<{ id?: number; name: string; ide: string | null; }>({
  name: '',
  ide: ''
})
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


  const getPatients = async (page = 1) => {

    if (page <= 0) page = 1

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      if (auth.value.user?.id) {
        const { data } = await gpsApi.get('/users/' + auth.value.user.id + '/patients', {
          params: { page }
        })

        if (page === 1) {
          patients.value = [];
        }

        if (data.data && data.data.length > 0) {
          patients.value.push(...data.data)
          currentPage.value = data.current_page;
          lastPage.value = data.last_page
          errorMessage.value = null
        }
      }
      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getPatientByIde = async (ide: string) => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients-ide/' + ide)

      isLoading.value = false

      return { ok: true, patient: data.patient, belongsToMe: data.belongsToMe };

    } catch (error) {
      isLoading.value = false
      //throw error
      return { ok: false, patient: null, belongsToMe: false };


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

    const { tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, canton, district, city, conditions } = form
    const dataToSave = { tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, canton, district, city, conditions }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post<Patient>('/patient/register', dataToSave)

      patients.value = [data, ...patients.value];

      isLoading.value = false

      return { ok: true, patient: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

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

  const checkPatientAuthorization = async (patientId: any, code: string) => {

    try {

      const { data } = await gpsApi.post("/patients/" + patientId + "/authorization", { code });

      patients.value = [data.data, ...patients.value];

      return { ok: true, code };

    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const updatePatient = async (form: any) => {

    const { id, tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, canton, district, city, conditions } = form
    const dataToSave = { id, tipo_identificacion, ide, first_name, birth_date, gender, phone_country_code, phone_number, email, address, province, canton, district, city, conditions }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.put('/patients/' + form.id, dataToSave)

      const idx = patients.value.map(pat => pat.id).indexOf(form.id);
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
      await gpsApi.delete('/patients/' + id)

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

  const getAnthropometry = async (patientId: number) => {



    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/anthropometry');

      isLoading.value = false
      return data;


    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getDocumentations = async (patientId: number) => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/documentations');

      isLoading.value = false
      return data;


    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

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
          text: 'Editar',
          icon: create,
          handler: () => {
            router.push({ name: 'patient', params: { id: patient.id } })

          },
        },
        {
          text: 'Eliminar',
          role: "destructive",
          icon: trash,
          handler: () => {
            onConfirmDelete(patient);
          
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

  getPatients();

  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    patients: computed(() => patients.value),
    conditions: computed(() => conditions.value),
    errors: computed(() => errors.value),
    nextPage: () => getPatients(currentPage.value + 1),
    prevPage: () => getPatients(currentPage.value - 1),
    presentOptions,
    getPatients,
    getPatient,
    getPatientByIde,
    createPatient,
    updatePatient,
    getConditions,
    getAnthropometry,
    getDocumentations,
    requestPatientAuthorization,
    checkPatientAuthorization,
    currentPatient,
  }

}


export default usePatients