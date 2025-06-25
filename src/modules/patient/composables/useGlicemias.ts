import { computed, onMounted, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import { alertController } from '@ionic/vue';
import useUtilities from '@/composables/useUtilities';


const glicemias = ref<any>([]);

const useGlicemias = (patientId: number) => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])

  const createGlicemia = async (form: any) => {
    const { parseDate, parseTime24 } = useUtilities();
    const { glicemia, condition } = form;
    const date_control = parseDate(form.date_control);
    const time_control = parseTime24(form.time_control, false);

    const dataToSave = { date_control, time_control, glicemia, condition }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/patients/' + patientId + '/sugars', dataToSave)

      glicemias.value = [data, ...glicemias.value];

      isLoading.value = false

      return { ok: true, glicemia: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const getGlicemias = async () => {


    try {
      isLoading.value = true
      glicemias.value = [];
      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/sugars')
      glicemias.value = data;

      isLoading.value = false

    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const deleteGlicemia = async (id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete('/sugars/' + id)

      glicemias.value = glicemias.value.filter(
        (gli: any) => gli.id !== id
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


  onMounted(getGlicemias)



  const onConfirmDelete = async (glicemia: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Eliminar',
      message: 'Eliminar Medición',
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
          role: 'destructive',
          cssClass: "confirm",
          handler: async () => {
            await deleteGlicemia(glicemia.id);
          },
        },
      ],
    });
    return await alert.present();
  };


  return {
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    glicemias: computed(() => glicemias.value),
    errors: computed(() => errors.value),
    createGlicemia,
    onConfirmDelete
  }

}


export default useGlicemias