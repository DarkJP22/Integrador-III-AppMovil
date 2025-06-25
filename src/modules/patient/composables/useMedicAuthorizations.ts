import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import useAuth from '@/modules/auth/composables/useAuth';
import { actionSheetController, alertController } from '@ionic/vue';
import { trash, close, create } from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { Patient } from '@/interfaces/patients';
import useUi from '@/composables/useUi';

const medicAuthorizations = ref<any[]>([]);

const useMedicAuthorizations = () => {

  const conditions = ref([]);
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const { auth } = useAuth()
  const { alertMessage } = useUi()
  const router = useRouter()
  const errors = ref<any>([])


  const getMedicAuthorizations = async (page = 1) => {

    if (page <= 0) page = 1

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      if (auth.value.user?.id) {
        const { data } = await gpsApi.get('/users/' + auth.value.user.id + '/medic-authorizations', {
          params: { page }
        })

        if (page === 1) {
          medicAuthorizations.value = [];
        }

        if (data.data && data.data.length > 0) {
          medicAuthorizations.value.push(...data.data)
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

  const deauthorize = async (id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete('/users/' + auth.value.user.id + '/medic-authorizations/' + id)

      medicAuthorizations.value = medicAuthorizations.value.filter(
        (authorization: any) => authorization.id !== id
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

  

  const onConfirmDeauthorize = async (autorization: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Desautorizar médico',
      message: 'Al desautorizar el médico no podra visualizar el expediente del paciente',
      buttons: [
        {
          text: 'cancelar',
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //
          },
        },
        {
          text: 'Confirmar',
          cssClass: "confirm",
          handler: async () => {
            // await deletePatient(patient.id);
            // getMedicAuthorizations()
            console.log(autorization);
            
            const { ok, message } = await deauthorize(autorization.id);
            if (!ok) alertMessage('Error', message)
            else {
              medicAuthorizations.value = medicAuthorizations.value.filter((au: any) => au.id !== autorization.id)
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
            //onConfirmDelete(patient);
          
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

  getMedicAuthorizations();

  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    medicAuthorizations: computed(() => medicAuthorizations.value),
    conditions: computed(() => conditions.value),
    errors: computed(() => errors.value),
    nextPage: () => getMedicAuthorizations(currentPage.value + 1),
    prevPage: () => getMedicAuthorizations(currentPage.value - 1),
    presentOptions,
    getMedicAuthorizations,
    onConfirmDeauthorize: onConfirmDeauthorize,
  }

}


export default useMedicAuthorizations