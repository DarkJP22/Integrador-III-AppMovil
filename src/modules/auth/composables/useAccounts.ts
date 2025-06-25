
import { computed, ref } from "vue"
import gpsApi from "@/services/gpsApi"


const useAccounts = () => {

    const errors = ref<any>([])
    const isLoading = ref(false)

    

      const getUserByIde = async (ide:any) => {

        try {
          isLoading.value = true
    
          // const userId = auth.value.user ? auth.value.user.id : null
          const { data } = await gpsApi.get('/register/users/'+ ide);
    
          isLoading.value = false
          

          return { ok: true, user: data };
    
        } catch (error:any) {
          isLoading.value = false

          if (error.response.status !== 422)  return { ok: false, user: null }

          errors.value = error.response.data.errors ?? [];
          //throw error
          return { ok: false, user: null };
    
    
        }
    
      }


      
    return {
        errors: computed( () => errors.value ),
        isLoading: computed( () => isLoading.value ),
        getUserByIde,

        


    }

}


export default useAccounts