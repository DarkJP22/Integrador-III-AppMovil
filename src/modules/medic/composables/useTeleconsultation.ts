import gpsApi from "@/services/gpsApi";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, toValue, watch } from "vue";

const useTeleconsultation = (id: any) => {
    const teleconsultation = ref<any>();
    
    const getTeleconsultation = async (id: number) => {
    
        const { data } = await gpsApi.get('/medic/teleconsultations/' + id)
        return data;
    
      }
   
    const { isLoading, data, isError } = useQuery({
        queryKey: [ 'appointmentRequest', id ],
        queryFn: () => getTeleconsultation(toValue(id)),
        retry: false,
    });

    watch( data, () => {
        if ( data.value )
        teleconsultation.value = {...data.value};
    },{ immediate: true });
    
  

    return {
        isLoading: computed(() => isLoading.value),
        isError: computed(() => isError.value),
        teleconsultation: computed(() => teleconsultation.value),

    }
};

export default useTeleconsultation