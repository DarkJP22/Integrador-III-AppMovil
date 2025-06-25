import { computed, onMounted, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const compras = ref<any>([]);

const useCompras = (patientId: number) => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])

  const getCompras = async () => {


    try {
      isLoading.value = true
      compras.value = [];
      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/patients/' + patientId + '/historialcompras')
      compras.value = data.data;

      isLoading.value = false
      return data.data;

    } catch (error) {
      isLoading.value = false
      throw error

    }

  }


  onMounted(getCompras)


  return {
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    compras: computed(() => compras.value),
    errors: computed(() => errors.value),

  }

}


export default useCompras