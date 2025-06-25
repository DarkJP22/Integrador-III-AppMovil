import { computed, onMounted, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import { alertController } from '@ionic/vue';
import useUtilities from '@/composables/useUtilities';


const pressures = ref<any>([]);

const usePressures = (patientId: number) => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])

  const createPressure = async (form: any) => {
    const { parseDate, parseTime24 } = useUtilities();
    const { ps, pd, heart_rate, measurement_place, observations } = form;
    const date_control = parseDate(form.date_control);
    const time_control = parseTime24(form.time_control, false);

    const dataToSave = { date_control, time_control, ps, pd, heart_rate, measurement_place, observations }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/patients/' + patientId + '/pressures', dataToSave);

      pressures.value = [data, ...pressures.value];

      isLoading.value = false
      //dataToSave.id = data.id;
      return { ok: true, pressure: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const getPressures = async () => {


    try {
      isLoading.value = true
      pressures.value = [];
      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/pressures')

      pressures.value = data;

      isLoading.value = false

    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const deletePressure = async (id: number) => {

    try {
      errors.value = [];
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete('/pressures/' + id);

      pressures.value = pressures.value.filter(
        (pre: any) => pre.id !== id
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

  onMounted(getPressures)



  const onConfirmDelete = async (pressure: any) => {
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
            await deletePressure(pressure.id);
          },
        },
      ],
    });
    return await alert.present();
  };


  return {
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    pressures: computed(() => pressures.value),
    errors: computed(() => errors.value),
    createPressure,
    onConfirmDelete
  }

}


export default usePressures