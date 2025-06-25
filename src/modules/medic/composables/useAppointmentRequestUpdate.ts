import { handleError } from "@/composables/useErrorHandling";
import gpsApi from "@/services/gpsApi";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref, computed } from "vue";

const updateAppointmentRequest = async (form: any) => {

  const { id, scheduled_date, start, end, status } = form
  const dataToSave = { id, scheduled_date, start, end, status: +status }


  const { data } = await gpsApi.put('/medic/appointments/requests/' + id, dataToSave)
  return data;



}

const useAppointmentRequestUpdate = () => {

  const queryClient = useQueryClient();
  const errors = ref<any>({});

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: updateAppointmentRequest,
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
    isError: computed(() => isError.value),
    isSuccess: computed(() => isSuccess.value),
    errors: errors.value,
    updateAppointmentRequest: mutate
  }
};

export default useAppointmentRequestUpdate