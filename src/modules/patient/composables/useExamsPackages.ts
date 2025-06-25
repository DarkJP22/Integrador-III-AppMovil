import gpsApi from '@/services/gpsApi';
import { ref, computed } from 'vue';

const examsPackages = ref<any[]>([]);

export default function useExamsPackages() {
    const isLoading = ref(false)
    const currentPage = ref(1)
    const lastPage = ref(1)
    const errorMessage = ref()
    const errors = ref<any>([])
    async function getExamsPackages(filters: any, page = 1) {

        const { q, office_id } = filters;

        if (page <= 0) page = 1;

        try {
            isLoading.value = true

            // const userId = auth.value.user ? auth.value.user.id : null
            const { data } = await gpsApi.get<any>('/lab/exams-packages', {
                params: { q, office_id, page }
            })

            if (page === 1) {
                examsPackages.value = [];
            }

            if (data.data && data.data.length > 0) {
                examsPackages.value.push(...data.data)
                currentPage.value = data.current_page;
                lastPage.value = data.last_page
                errorMessage.value = null
            }



            isLoading.value = false
        } catch (error) {
            isLoading.value = false
            throw error

        }

    }
    return {
        currentPage: computed(() => currentPage.value),
        lastPage: computed(() => lastPage.value),
        errorMessage: computed(() => errorMessage.value),
        isLoading: computed(() => isLoading.value),
        examsPackages: computed(() => examsPackages.value),
        errors: computed(() => errors.value),
        nextPage: (filters: any) => getExamsPackages(filters, currentPage.value + 1),
        prevPage: (filters: any) => getExamsPackages(filters, currentPage.value - 1),
        getExamsPackages
    }
}