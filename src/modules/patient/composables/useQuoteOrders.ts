
import useUtilities from '@/composables/useUtilities';
import gpsApi from '@/services/gpsApi';
import { ref, computed } from 'vue';
const { toFormData } = useUtilities();

export default function useQuoteOrder() {
 
    const errors = ref<any>([]);
    const isLoading = ref(false);

    async function send(data: any) {
       
        const bodyFormData = toFormData(data)


        data.photos.forEach((item: any) => {
            bodyFormData.append('photos[]', item.blobImg, item.filepath)
        });

        try {
            errors.value = [];
            isLoading.value = true

            const { data } = await gpsApi.post('/lab/quotes', bodyFormData);



            isLoading.value = false
            //dataToSave.id = data.id;
            return { ok: true };

        } catch (error: any) {
            isLoading.value = false

            if (error.response.status !== 422) throw error

            errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
            return { ok: false, message: error.response.data.message }

        }

    }
    return {
        errors: computed(() => errors.value),
        isLoading: computed(() => isLoading.value),
        send,
        
    }
}