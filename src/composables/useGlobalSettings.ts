import useAuth from "@/modules/auth/composables/useAuth";
import { computed } from "vue";

interface subscriptionInvoicePaidStatuses {
    UNPAID: 1,
    CHECKING: 2,
    PAID: 3,
    REFUSED: 4
}
interface typesOfHealthProfessional {
    FISIOTERAPEUTA: "fisioterapeuta";
    MEDICO: "medico";
    NUTRICIONISTA: "nutricionista";
    ODONTOLOGO: "odontologo";
    PSICOLOGO: "psicologo";
}
export function useGlobalSettings() {
    const { auth } = useAuth();

    const maxUploadSizeInMb = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.upload_max_filesize_in_mb) return null;

        return parseFloat(auth.value.global.upload_max_filesize_in_mb); //10485760
    });

    const maxUploadStoryImageSizeInMb = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.upload_story_image_max_filesize_in_mb) return null;

        return parseFloat(auth.value.global.upload_story_image_max_filesize_in_mb); //10485760
    });

    const maxUploadStoryVideoSizeInMb = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.upload_story_video_max_filesize_in_mb) return null;

        return parseFloat(auth.value.global.upload_story_video_max_filesize_in_mb); //10485760
    });
    const maxAllowedVideoLengthInMinutes = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.upload_story_video_max_length_in_minutes) return null;

        return parseFloat(auth.value.global.upload_story_video_max_length_in_minutes); //10485760
    });

    const limitStoryUploadImages = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.limit_story_upload_images) return null;

        return parseInt(auth.value.global.limit_story_upload_images); //10 archivos

    });

    const limitStoryUploadVideos = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.limit_story_upload_videos) return null;

        return parseInt(auth.value.global.limit_story_upload_videos); //10 archivos

    });

    const limitUploadFiles = computed(() => {
        if (!auth.value.global) return null;
        if (!auth.value.global.limit_upload_files) return null;

        return parseInt(auth.value.global.limit_upload_files); //10 archivos

    });

    const subscriptionInvoicePaidStatusesAsConst = computed(() => {

        return auth.value.global?.subscription_invoice_paid_statuses_as_const as subscriptionInvoicePaidStatuses;

    });
    const subscriptionInvoicePaidStatuses = computed(() => {

        return auth.value.global?.subscription_invoice_paid_statuses;

    });

    const typesOfHealthProfessional = computed(() => {

        return auth.value.global?.types_of_health_professional;

    });
    const typesOfHealthProfessionalAsConst = computed(() => {

        return auth.value.global?.types_of_health_professional_as_const as typesOfHealthProfessional;

    });

    const porcDiscountGeneralCostAppointments = computed(() => {
        if(!auth.value.global?.porc_discount_general_cost_appointment) return 0;
        
        return parseFloat(auth.value.global?.porc_discount_general_cost_appointment);

    });

    return {
        maxUploadSizeInMb,
        limitUploadFiles,
        subscriptionInvoicePaidStatusesAsConst,
        subscriptionInvoicePaidStatuses,
        porcDiscountGeneralCostAppointments,
        typesOfHealthProfessional,
        typesOfHealthProfessionalAsConst,
        maxUploadStoryImageSizeInMb,
        maxUploadStoryVideoSizeInMb,
        limitStoryUploadImages,
        limitStoryUploadVideos,
        maxAllowedVideoLengthInMinutes
    }
}