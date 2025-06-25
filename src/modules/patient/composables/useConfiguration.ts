import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const configuration = ref<any>({});

const useConfiguration = () => {


  const isLoading = ref(false)


  const getConfiguration = async () => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/configuration');

      isLoading.value = false
      configuration.value = data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  getConfiguration();
  
  return {
    isLoading: computed( () => isLoading.value ),
    configuration: computed( () => configuration.value ),
  }

}


export default useConfiguration