import { computed, onMounted, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import { alertController } from '@ionic/vue';


const allergies = ref<any[]>([]);

const useAllergies = (patientId: number) => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])

  const createAllergy = async (form: any) => {

    const { name } = form;

    const dataToSave = { name }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/patients/' + patientId + '/allergies', dataToSave)

      allergies.value = [data, ...allergies.value];

      isLoading.value = false

      return { ok: true, id: data.id };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const getAllergies = async () => {


    try {
      isLoading.value = true
      allergies.value = [];
      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/allergies')

      allergies.value = data;

      isLoading.value = false

    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const deleteAllergy = async (id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete('/allergies/' + id)

      allergies.value = allergies.value.filter(
        (alle: any) => alle.id !== id
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

  const onConfirmDelete = async (allergy: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Eliminar',
      message: 'Eliminar Alergia',
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
            await deleteAllergy(allergy.id);
          },
        },
      ],
    });
    return await alert.present();
  };

  onMounted(getAllergies);

  return {
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    allergies: computed(() => allergies.value),
    errors: computed(() => errors.value),
    createAllergy,
    onConfirmDelete
  }

}


export default useAllergies