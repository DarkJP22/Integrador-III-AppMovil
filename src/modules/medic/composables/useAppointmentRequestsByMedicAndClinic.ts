import { computed, ref, watch } from 'vue'
import gpsApi from '@/services/gpsApi';
import { useQuery } from '@tanstack/vue-query';


const medicAppointmentRequests = ref<any>([]);



const useAppointmentRequestsByMedicAndClinic = (medicId:number, officeId:number) => {
  
  const filters = ref<any>({
    medicId: null,
    officeId: null,
    date1: "",
    date2: "",
  });

  filters.value.medicId = medicId;
  filters.value.officeId = officeId;
  
  const errors = ref<any>([])

  const getAppointmentRequestsByMedicAndClinic = async (filters: any) => {

    const { medicId, officeId, date1, date2 } = filters;

    const { data } = await gpsApi.get('/medics/' + medicId + '/appointments/requests', {
      params: { office: officeId, date1, date2 }
    })

    return data;

  }

  const enabled = computed(() =>  !!(filters.value.date1 && filters.value.date2));

  const { isLoading, data } = useQuery({
    queryKey: ['appointmentRequestsMedicClinic', 1, filters],
    queryFn: () => getAppointmentRequestsByMedicAndClinic(filters.value),
    enabled,
  });

  watch(data, newVal =>{
      if(newVal){ 
        medicAppointmentRequests.value = newVal
      }
  }, { immediate: true });

  return {
    filters,
    isLoading: computed(() => isLoading.value),
    medicAppointmentRequests: computed(() => medicAppointmentRequests.value),
    errors: computed(() => errors.value),
  }

}


export default useAppointmentRequestsByMedicAndClinic