import { computed, onMounted, ref } from 'vue'
import gpsApi from '@/services/gpsApi'
import { alertController } from '@ionic/vue'
import { tr } from 'date-fns/locale'

const affiliations = ref<any[]>([])

const useAffiliation = (userId: number) => {
    const isLoading = ref(false)
    const errorMessage = ref<string | undefined>()
    const errors = ref<any[]>([])
    const active = ref<boolean>(false)

   const createAffiliation = async (formData: any) => {
    try {
        errors.value = []
        isLoading.value = true

        const { data } = await gpsApi.post('/affiliation-users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        affiliations.value = [data, ...affiliations.value]
        isLoading.value = false
        return { ok: true, id: data.id }
    } catch (error: any) {
        isLoading.value = false
        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors ?? []
            return { ok: false, message: error.response.data.message }
        }
        throw error
    }
}

    const getAffiliations = async () => {
        try {
            isLoading.value = true
            affiliations.value = []
            const { data } = await gpsApi.get('/affiliation-users')
            affiliations.value = data
            isLoading.value = false
        } catch (error) {
            isLoading.value = false
            throw error
        }
    }
    const getAffiliationsByUser = async (id: number) => {
        try {
            isLoading.value = true
            affiliations.value = []
            const { data } = await gpsApi.get(`/affiliation-users/${id}`)
            // Retorna true si hay al menos una afiliación activa, false si no
        const hasActive = data.active === 1;
            affiliations.value = data
            isLoading.value = false
           //  alert("Obteniendo afiliaciones del usuario..."+ hasActive);
            return hasActive
        } catch (error) {
            isLoading.value = false
            throw error
        }
    }

    const deleteAffiliation = async (id: number) => {
        try {
            errors.value = []
            isLoading.value = true
            await gpsApi.delete(`/affiliation-users/${id}`)
            affiliations.value = affiliations.value.filter((aff: any) => aff.id !== id)
            isLoading.value = false
            return { ok: true, id }
        } catch (error: any) {
            isLoading.value = false
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors ?? []
                return { ok: false, message: error.response.data.message }
            }
            throw error
        }
    }

    const onConfirmDelete = async (affiliation: any) => {
        const alert = await alertController.create({
            cssClass: "confirm-delete-alert",
            header: 'Eliminar',
            message: 'Eliminar Afiliación',
            buttons: [
                {
                    text: 'Cancelar',
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {},
                },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    cssClass: "confirm",
                    handler: async () => {
                        await deleteAffiliation(affiliation.id)
                    },
                },
            ],
        })
        return await alert.present()
    }

    onMounted(getAffiliations)

    return {
        errorMessage: computed(() => errorMessage.value),
        isLoading: computed(() => isLoading.value),
        affiliations: computed(() => affiliations.value),
        errors: computed(() => errors.value),
        createAffiliation,
        onConfirmDelete,
        getAffiliationsByUser,
    }
}

export default useAffiliation