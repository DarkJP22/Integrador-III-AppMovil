import gpsApi from "@/services/gpsApi";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, toValue, watch } from "vue";

const useAppointmentRequest = (id: any) => {
    const appointmentRequest = ref<any>();
    
    const getAppointmentRequest = async (id: number) => {
    
        const { data } = await gpsApi.get('/medic/appointments/requests/' + id)
        return data;
    
      }
   
    const { isLoading, data, isError } = useQuery({
        queryKey: [ 'appointmentRequest', id ],
        queryFn: () => getAppointmentRequest(toValue(id)),
        retry: false,
    });

    watch( data, () => {
        if ( data.value )
        appointmentRequest.value = {...data.value};
    },{ immediate: true });
    
  

    return {
        isLoading: computed(() => isLoading.value),
        isError: computed(() => isError.value),
        appointmentRequest: computed(() => appointmentRequest.value),

    }
};

export default useAppointmentRequest