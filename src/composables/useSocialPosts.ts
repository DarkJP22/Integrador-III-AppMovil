import gpsApi from "@/services/gpsApi";
import { computed, ref } from "vue";

const filters = ref<any>({
  q: "",
});
const socialPosts = ref<any[]>([]);
export function useSocialPosts() {
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])

  
  const getSocialPosts = async (page = 1) => {

    const { q, status } = filters.value;


    if (page <= 0) page = 1
    try {
      isLoading.value = true
      const { data } = await gpsApi.get(`/social-posts`, {
        params: { q, status, page }
      })

      if (page === 1) {
        socialPosts.value = [];
      }

      if (data.data && data.data.length > 0) {
        socialPosts.value.push(...data.data)
        currentPage.value = data.current_page;
        lastPage.value = data.last_page
        errorMessage.value = null
      }


    } catch (error) {
      isLoading.value = false
      throw error
    }


  }
  const getSocialPost = async (id: number) => {
    try {


      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get("/social-posts/" + id);



      return data;
    } catch (error) {

      //throw error
      return {};
    }
  };
  

  return {
    currentPage,
    lastPage,
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    socialPosts: computed(() => socialPosts.value),
    errors: computed(() => errors.value),
    nextPage: () => getSocialPosts(currentPage.value + 1),
    prevPage: () => getSocialPosts(currentPage.value - 1),
    getSocialPosts,
    getSocialPost,

  }
}