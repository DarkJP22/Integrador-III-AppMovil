import { computed, onMounted, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import { alertController } from '@ionic/vue';

const medicines = ref<any>([]);


const useMedicines = (patientId: number) => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])

  const getMedicines = async () => {


    try {
      isLoading.value = true
      medicines.value = [];
      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/medicines')
      medicines.value = data;


      isLoading.value = false

    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const disableEnableDosesReminder = async (data: any) => {

    data.active = !data.active;

    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.put('/patients/' + data.patient_id + '/dosereminders/' + data.id, data)

      isLoading.value = false

      return { ok: true };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }

  const createMedicine = async (form: any) => {

    const { name } = form;

    const dataToSave = { name }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/patients/' + patientId + '/medicines', dataToSave)

      medicines.value = [data, ...medicines.value];

      isLoading.value = false

      return { ok: true, id: data.id };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const deleteMedicine = async (id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete('/medicines/' + id)

      medicines.value = medicines.value.filter(
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

  const onConfirmDelete = async (medicine: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Eliminar',
      message: 'Eliminar medicamento?',
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
            await deleteMedicine(medicine.id);
          },
        },
      ],
    });
    return await alert.present();
  };


  onMounted(getMedicines)


  return {
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    medicines: computed(() => medicines.value),
    errors: computed(() => errors.value),
    disableEnableDosesReminder,
    createMedicine,
    onConfirmDelete
  }

}


export default useMedicines