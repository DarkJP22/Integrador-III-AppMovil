<script setup lang="ts">
import { useMedicSocialPosts } from "@/composables/useMedicSocialPosts";
import {
    InfiniteScrollCustomEvent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonIcon,
} from "@ionic/vue";
import { computed, inject, ref } from "vue";
import CldVideo from "./CldVideo.vue";
import { trash } from "ionicons/icons";
import useAccount from "@/modules/medic/composables/useAccount";
import useUi from "@/composables/useUi";
import { alertController } from "@ionic/core";
const { alertMessage, loadingMessage, dismissLoading } = useUi();
const { createStoryFromSocialImage } = useAccount();

const medicId = inject<number>('medicId');
const showMediaModal = ref(false);
const socialImage = ref<any>(null);

const { videoPostsQuery, deleteSocialPost } = useMedicSocialPosts(medicId);

const socialVideos = computed(() => {
    return videoPostsQuery.data.value?.pages.flatMap((page) => page.data) ?? [];
});
function openMedia(socialPost: any) {
    showMediaModal.value = true;

    socialImage.value = socialPost;

}
const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {

    if (videoPostsQuery.hasNextPage.value) {
        await videoPostsQuery.fetchNextPage();
    }
    await ev.target.complete();
};

const onConfirmDelete = async (postId: number) => {
  const alert = await alertController.create({
    cssClass: "confirm-delete-alert",
    header: "Eliminar",
    message: "¿Estas seguro que deseas eliminar este elemento?",
    buttons: [
      {
        text: "cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => {
          //
        },
      },
      {
        text: "Eliminar",
        cssClass: "confirm",
        handler: async () => {
          loadingMessage('Eliminando...');
          const { ok, message } = await deleteSocialPost(medicId!, postId);
          if (!ok) {
            dismissLoading();
            alertMessage('Error', message);
            return;
          }
          showMediaModal.value = false;
          socialImage.value = null;
          dismissLoading();
        },
      },
    ],
  });
  return alert.present();
};

const onConfirmCreateStory = async (postId: number) => {
  const alert = await alertController.create({
    cssClass: "confirm-create-alert",
    header: "Subir a historia",
    message: "¿Deseas subirlo a las historias?",
    buttons: [
      {
        text: "cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => {
          //
        },
      },
      {
        text: "Subir",
        cssClass: "confirm",
        handler: async () => {
          loadingMessage('Subiendo historia...');
          const { ok, message } = await createStoryFromSocialImage(postId);
          if (!ok) {
            dismissLoading();
            return alertMessage('Error', message);
          }
          showMediaModal.value = false;
          socialImage.value = null;
          dismissLoading();
        },
      },
    ],
  });
  return alert.present();
};
</script>
<template>
    <div class="gallery-container">
        <div v-if="socialVideos.length === 0" class="no-posts-message text-center pt-4">
            <p>No hay publicaciones</p>
        </div>
        <div class="gallery-grid grid grid-cols-3 gap-1">
            <div v-for="(video) in socialVideos" :key="video.id" class="gallery-item aspect-square">

                <div class="relative w-full h-full" @click="openMedia(video)" v-if="video.type === 'video'">
                    <div class="absolute inset-0 z-10 w-full h-full"></div>
                    <CldVideo :public-id="video.public_id" :controls="false" classes="w-full h-full object-cover object-center" />
                </div>
            </div>
        </div>
        <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll-videos" v-if="videoPostsQuery.hasNextPage">
            <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
            </ion-infinite-scroll-content>
        </ion-infinite-scroll>


    </div>
    <!-- Modal de show Image & Video -->
    <div v-if="showMediaModal" class="modal">
        <div class="backdrop" @click="showMediaModal = false"></div>
        <div class="modal-content">
            <div class="modal-close"><button @click="showMediaModal = false">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button></div>
            <!-- <img v-if="previewUrl" :src="previewUrl" class="preview-image" /> -->

    
            <CldVideo :public-id="socialImage.public_id" v-if="socialImage?.type === 'video'" :autoplay="true" />

            <div class="modal-buttons" v-if="socialImage?.public_id">
                <!-- <ion-button @click="showMediaModal = false" fill="solid" size="small" color="danger"><ion-icon :icon="closeCircle"></ion-icon></ion-button> -->
                <ion-button @click="onConfirmDelete(socialImage.id)" fill="solid" size="small" color="danger"><ion-icon :icon="trash"></ion-icon></ion-button>
                <ion-button @click="onConfirmCreateStory(socialImage.id)" fill="solid" size="small">Subir a historias</ion-button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.modal-content {
    /* background: white; */
    /* padding: 5px; */
    margin-top: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    position: relative;
    z-index: 2;
}

.preview-image {
    width: 100%;
    max-height: 350px;
    object-fit: contain;
    /* margin: 16px 0; */
}

.modal-close {
    position: absolute;
    top: -30px;
    right: 0;
    z-index: 10;
    color: white;
}

.modal-buttons {
    /* position: absolute;
  top: 0;
  right: 0; */
    /* background-color: white; */

}

.modal-buttons button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.modal-buttons button:first-child {
    background: #0095f6;
    color: white;
    border: none;
}

.modal-buttons button:last-child {
    background: #fff;
    border: 1px solid #dbdbdb;
}
</style>