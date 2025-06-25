import gpsApi from "@/services/gpsApi";
import { ref } from "vue";

export default function useMedicineReminders(){
    const isLoading = ref(false)
    const errors = ref<any>([])

    const updateStatus = async (form: any) => {

        const { id, status } = form;
    
        const dataToSave = { status }
    
        try {
          errors.value = [];
          isLoading.value = true
    
          const { data } = await gpsApi.put('/medicines/reminders/'+ id, dataToSave)
    
       
    
          isLoading.value = false
    
          return { ok: true, reminder: data };
    
        } catch (error: any) {
          isLoading.value = false
    
          if (error.response.status !== 422) throw error
    
          errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
          return { ok: false, message: error.response.data.message }
    
        }
    
      }
    
    return {
        updateStatus
    };
}