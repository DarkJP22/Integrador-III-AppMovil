import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const laboratories = ref<any[]>([]);
const currentLab = ref<any>(null);
const useLaboratories = () => {

  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])


  const getLaboratories = async (filters: any, page = 1) => {

    const { q, lat, lon, radius, province, canton, district } = filters;

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get<any>('/laboratories', {
        params: { q, page, lat, lon, radius, province, canton, district }
      })

      if(page === 1){
        laboratories.value = [];
      }
      
      if(data.data && data.data.length > 0){
        laboratories.value.push(...data.data)
        currentPage.value = data.current_page;
        lastPage.value =  data.last_page
        errorMessage.value = null
      }
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getLaboratory = async (id: number, filters:any = null) => {
    let params = {};

    if(filters){
      const { lat, lon } = filters;
      params = {
        lat, lon
      }
    }
   
    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/laboratories/' + id,  {
        params: params
      })

      isLoading.value = false
      currentLab.value = data

      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  

  

  return {
    currentLab: computed(() => currentLab.value),
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    laboratories: computed( () => laboratories.value ),
    errors: computed( () => errors.value ),
    nextPage: (filters: any) => getLaboratories(filters, currentPage.value + 1),
    prevPage: (filters: any) => getLaboratories(filters, currentPage.value - 1),
    getLaboratory,
    getLaboratories,

  }

}


export default useLaboratories