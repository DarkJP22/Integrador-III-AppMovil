
import { computed, ref } from "vue"
import gpsApi from "@/services/gpsApi"


const useSpecialities = () => {
  
    const errors = ref<any>([])
    const isLoading = ref(false)

    const getSpecialities = async() => {

        try {
          isLoading.value = true
    
          const { data } = await gpsApi.get('/medics/specialities')
    
          isLoading.value = false

          return data;
    
        } catch (error) {
          isLoading.value = false
          //throw error
          return []
    
    
        }
       
  
  
    }

      
    return {
        errors: computed( () => errors.value ),
        isLoading: computed( () => isLoading.value ),
        getSpecialities

    }

}


export default useSpecialities