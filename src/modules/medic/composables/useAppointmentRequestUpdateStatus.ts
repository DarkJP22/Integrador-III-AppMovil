import { handleError } from "@/composables/useErrorHandling";
import gpsApi from "@/services/gpsApi";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed, ref } from "vue";


const updateStatusAppointmentRequest = async ( form: any ) => {

    const { id, status } = form
    const dataToSave = { id, status: +status }

    
    const { data } = await gpsApi.put('/medic/appointments/requests/' + id, dataToSave)
     return  data ;

    

  }

const useAppointmentRequestUpdateStatus = () => {
   
    const queryClient = useQueryClient()
    const errors = ref<any>({})

    const { mutate, isPending, isSuccess, isError } = useMutation({
      mutationFn: updateStatusAppointmentRequest,
      onSuccess: () => {
        // refetch the articles list
        queryClient.invalidateQueries({ queryKey: ['appointmentRequests'] });
      },
      onError: (error: any) => {
        errors.value = handleError(error)
  
      }
    
  })
  

    return {
        isLoading: computed(() => isPending.value),
        isError,
        isSuccess,
        errors,
        updateStatus: mutate
    }
};

export default useAppointmentRequestUpdateStatus