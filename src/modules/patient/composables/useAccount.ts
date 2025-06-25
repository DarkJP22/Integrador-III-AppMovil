
import { computed, ref } from "vue"
import gpsApi from "@/services/gpsApi"
import useAuth from "@/modules/auth/composables/useAuth";

const useAccount = () => {
    const { auth, logout } = useAuth();
    const errors = ref<any>([])
    const isLoading = ref(false)

    const updateUser = async (form: any) => {

        const { id, ide, name, phone_country_code, phone_number, email, password } = form
        const dataToSave = { id, ide, name, phone_country_code, phone_number, email, password }
    
        try {
          errors.value = [];
          isLoading.value = true
    
          const { data } = await gpsApi.put('/account', dataToSave)
         
          auth.value.user = data.user;
          auth.value.settings = data.user_settings;
          
          isLoading.value = false

          return { ok: true, user: data };
    
        } catch (error: any) {
          isLoading.value = false
    
          if (error.response.status !== 422) throw error
    
          errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
          return { ok: false, message: error.response.data.message }
    
    
        }
    
      }

      const getUser = async () => {

        try {
          isLoading.value = true
    
          // const userId = auth.value.user ? auth.value.user.id : null
          const { data } = await gpsApi.get('/user')
    
          isLoading.value = false
          
          auth.value.user = data.user;
          auth.value.settings = data.user_settings;

          return { user: data.user, settings: data.user_settings };
    
        } catch (error) {
          isLoading.value = false
          //throw error
          return {}
    
    
        }
    
      }

      const deleteAccount = async () => {
    
        try {
          errors.value = [];
          isLoading.value = true
         
          await gpsApi.delete('/account/cancel')
          
          isLoading.value = false

          logout();

          return { ok: true };
    
        } catch (error: any) {
          isLoading.value = false
    
          if (error.response.status !== 422) throw error
    
          errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
          return { ok: false, message: error.response.data.message }
    
    
        }
    
      }

      
    return {
        errors: computed( () => errors.value ),
        isLoading: computed( () => isLoading.value ),
        updateUser,
        getUser,
        deleteAccount

        


    }

}


export default useAccount