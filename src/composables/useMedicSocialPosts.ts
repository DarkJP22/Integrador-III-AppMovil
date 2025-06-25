import useAccount from "@/modules/medic/composables/useAccount";
import gpsApi from "@/services/gpsApi";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, toValue } from "vue";
const { totalImages, totalVideos, totalVideosInSeconds } = useAccount();




export function useMedicSocialPosts(medicId: any) {

  const errorMessage = ref()
  const errors = ref<any>([])


  const filters = ref<any>({
    q: "",

  });

  const getMedicSocialPosts = async (page = 1, type = '') => {

    const { q } = filters.value;

    if (page <= 0) page = 1

    const { data } = await gpsApi.get(`/medic/${toValue(medicId)}/social-posts`, {
      params: { q, type, page }
    })
    return data;

  }
  

  const allPostsQuery = useInfiniteQuery({
    queryKey: ['medic-social-posts', medicId, filters],
    queryFn:({ pageParam }) =>{
        return getMedicSocialPosts(pageParam)
    },
    initialPageParam: 1,
    //gcTime: 1 * 60 * 1000, // 1 minute
    staleTime: 1 * 60 * 1000, // 1 minute
   
    getNextPageParam: (lastPage: any) => {

      totalImages.value = lastPage.total_images || 0
      totalVideos.value = lastPage.total_videos || 0
      totalVideosInSeconds.value = lastPage.total_videos_in_seconds || 0
     
      return lastPage.links.next ? lastPage.meta.current_page + 1 : undefined;
    },
  });

  const videoPostsQuery = useInfiniteQuery({
    queryKey: ['medic-social-posts', medicId, 'videos', filters],
    queryFn:({ pageParam }) =>{
        return getMedicSocialPosts(pageParam, 'video')
    },
    initialPageParam: 1,
    //gcTime: 1 * 60 * 1000, // 1 minute
    staleTime: 1 * 60 * 1000, // 1 minute
   
    getNextPageParam: (lastPage: any) => {

      totalImages.value = lastPage.total_images || 0
      totalVideos.value = lastPage.total_videos || 0
      totalVideosInSeconds.value = lastPage.total_videos_in_seconds || 0
     
      return lastPage.links.next ? lastPage.meta.current_page + 1 : undefined;
    },
  });



  const deleteSocialPost = async (medicId: number, id: number) => {
    try {
      // isLoading.value = true
      const { data } = await gpsApi.delete(`/medic/${medicId}/social-posts/${id}`)

      if (data) {
        // socialPosts.value = socialPosts.value.filter((post: any) => post.id !== id)
        // errorMessage.value = null
      }
      return { ok: true, message: "Social post deleted successfully" }
    } catch (error: any) {
      //isLoading.value = false
      if (error.response.status === 422) {
        errors.value = error.response.data.errors;
      } else {
        errorMessage.value = "Error deleting the social post";
      }
      return { ok: false, message: errorMessage.value }
    }
  }

  return {
    filters,
    errorMessage: computed(() => errorMessage.value),
    errors: computed(() => errors.value),
    allPostsQuery,
    videoPostsQuery,
    deleteSocialPost,
    totalImages: computed(() => totalImages.value),
    totalVideos: computed(() => totalVideos.value),
    totalVideosInSeconds: computed(() => totalVideosInSeconds.value),

  }
}