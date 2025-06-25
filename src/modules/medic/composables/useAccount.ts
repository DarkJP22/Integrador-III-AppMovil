
import { computed, ref } from "vue"
import gpsApi from "@/services/gpsApi"
import useAuth from "@/modules/auth/composables/useAuth";
import { CloudinaryResource } from "@/interfaces/cloudinary";

const filters = ref<any>({
  q: "",
});
const totalImages = ref(0)
const totalVideos = ref(0)
const totalVideosInSeconds = ref(0)

const useAccount = () => {
  const { auth, logout } = useAuth();
  const errors = ref<any>([])
  const isLoading = ref(false)


  const updateUser = async (form: any) => {

    const { id, ide, name, phone_country_code, phone_number, email, password, minTime, maxTime, freeDays, accumulated_affiliation, general_cost_appointment } = form
    const dataToSave = { id, ide, name, phone_country_code, phone_number, email, password, minTime, maxTime, freeDays, accumulated_affiliation, general_cost_appointment }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.put('/account', dataToSave)

      auth.value.user = data.user;
      auth.value.settings = data.user_settings;

      isLoading.value = false

      return { ok: true, user: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }

  const updateSocialProfile = async (form: any) => {

    const { schools, titles, services } = form
    const dataToSave = { schools, titles, services }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.put('/medic/social-profile', dataToSave)

      // auth.value.user = data.user;
      // auth.value.settings = data.user_settings;

      isLoading.value = false

      return { ok: true, user: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }



  const saveImageSocialProfile = async (resource: CloudinaryResource, uploadStory = false) => {

    const dataToSave = { url: resource.secure_url, public_id: resource.public_id, type: resource.resource_type, duration: resource.duration ?? 0, format: resource.format, upload_story: uploadStory }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post('/medic/social-profile/images', dataToSave)


      isLoading.value = false

      return { ok: true, image: data.image, storyError: data.story_error };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }

  const createStoryFromSocialImage = async (socialImageId: number) => {

    // const dataToSave = { url: resource.url, public_id: resource.public_id, type: resource.type, duration: resource.duration ?? 0, format: resource.format }

    try {
      errors.value = [];
      isLoading.value = true

      const { data } = await gpsApi.post(`/medic/social-profile/images/${socialImageId}/stories`)


      isLoading.value = false

      return { ok: true, image: data };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }


  const deleteAccount = async () => {

    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.delete('/account/cancel')

      isLoading.value = false

      logout();

      return { ok: true };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }

  const getUser = async () => {

    try {
      isLoading.value = true

      const { data } = await gpsApi.get('/user')

      isLoading.value = false

      auth.value.user = data.user;
      auth.value.settings = data.user_settings;

      return { user: data.user, settings: data.user_settings };

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }


  return {
    filters,
    errors: computed(() => errors.value),
    isLoading: computed(() => isLoading.value),
    updateUser,
    getUser,
    deleteAccount,
    updateSocialProfile,
    saveImageSocialProfile,
    createStoryFromSocialImage,
    totalImages,
    totalVideos,
    totalVideosInSeconds,





  }

}


export default useAccount