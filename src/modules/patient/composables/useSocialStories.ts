import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const stories = ref<any>([]);

const useSocialStories = () => {

  const isLoading = ref(false)
  const errorMessage = ref()
  const errors = ref<any>([])


  const getSocialStories = async () => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.get('/social-stories')
      stories.value = [...data.data];
      isLoading.value = false

      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return null


    }

  }


  return {
    isLoading: computed(() => isLoading.value),
    stories: computed(() => stories.value),
    errorMessage: computed(() => errorMessage.value),
    errors: computed(() => errors.value),
    getSocialStories,
    
   
  }

}


export default useSocialStories