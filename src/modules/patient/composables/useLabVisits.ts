import gpsApi from '@/services/gpsApi';
import { ref, computed } from 'vue';

const currentVisitLocation = ref('');

export default function useLabVisits() {
    const visits = ref<any[]>([]);
    const isLoading = ref(false)
    const errorMessage = ref()
    const errors = ref<any>([])

    async function getVisits(filters: any) {

        const { q, office_id, location } = filters;



        try {
            isLoading.value = true

            // const userId = auth.value.user ? auth.value.user.id : null
            const { data } = await gpsApi.get<any>('/lab/visits', {
                params: { q, office_id, location }
            })


            visits.value = [];



            visits.value.push(...data)

            errorMessage.value = null




            isLoading.value = false
        } catch (error) {
            isLoading.value = false
            throw error

        }

    }
    async function createVisitRequest(form:any) {
        const { ide, first_name, birth_date, gender, phone_country_code, phone_number, province, canton, district, coords, visit_location, tipo_identificacion, office_id } = form
        const dataToSave = { ide, first_name, birth_date, gender, phone_country_code, phone_number, province, canton, district, coords, visit_location, tipo_identificacion, office_id }
    
        try {
          errors.value = [];
          isLoading.value = true
    
          const { data } = await gpsApi.post<any>('/lab/appointment-requests/register', dataToSave)
    
        
    
          isLoading.value = false
    
          return { ok: true, appointmentRequest: data };
    
        } catch (error: any) {
          isLoading.value = false
    
          if (error.response.status !== 422) throw error
    
          errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
          return { ok: false, message: error.response.data.message }
    
        }
    }
    return {
        errorMessage: computed(() => errorMessage.value),
        isLoading: computed(() => isLoading.value),
        visits: computed(() => visits.value),
        errors: computed(() => errors.value),
        getVisits,
        createVisitRequest,
        currentVisitLocation
    }
}