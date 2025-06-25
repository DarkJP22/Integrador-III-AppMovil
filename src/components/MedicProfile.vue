<script setup lang="ts">
import { useCloudinary } from "@/composables/useCloudinary";
import useUi from "@/composables/useUi";
import useAuth from "@/modules/auth/composables/useAuth";
import useAccount from "@/modules/medic/composables/useAccount";
import { OverlayEventDetail } from "@ionic/core";

import {
  IonAvatar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonButtons,
  IonModal,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonInput,
  IonItem,
  IonContent,
  IonFab,
  IonFabButton,
  IonToggle,



} from "@ionic/vue";

import { image, videocam, add } from "ionicons/icons";
import { computed, provide, ref } from "vue";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
import useUtilities from "@/composables/useUtilities";
import AllPosts from "./AllPosts.vue";
import VideoPosts from "./VideoPosts.vue";
import { useQueryClient } from "@tanstack/vue-query";

const { auth } = useAuth();
const { updateSocialProfile, saveImageSocialProfile, totalImages, totalVideosInSeconds } = useAccount();

const { alertMessage, loadingMessage, dismissLoading } = useUi();
const { uploadResource } = useCloudinary();
const { mbToBytes } = useUtilities();
const { maxUploadStoryImageSizeInMb, maxUploadStoryVideoSizeInMb, maxAllowedVideoLengthInMinutes, limitStoryUploadImages } = useGlobalSettings();
const queryClient = useQueryClient();

const props = defineProps({
  medic: {
    type: Object,
    required: true,
  },
});
const segmentCase = ref("all");
const medicId = computed(() => {
  return props.medic?.id;
});

const socialProfile = ref(props.medic.social_profile_fields);
const form = ref({
  schools: props.medic.social_profile_fields?.schools,
  titles: props.medic.social_profile_fields?.titles,
  services: props.medic.social_profile_fields?.services,
});

const fileInput = ref<HTMLInputElement>();
const files = ref<any>([]);
const isOpenUploadModal = ref(false);
const editModal = ref();
const uploadStory = ref(false);
const medicName = computed(() => {
  return props.medic.name; //temporalmente desabilitado
});
//const previewVideoUrlTag = ref<HTMLVideoElement | null>(null);
const previewUrls = computed(() => {
  if (!files.value.length) return [];
  
  return files.value
    .filter((file: any) => file.type.startsWith('image/'))
    .map((file: any) => typeof URL !== 'undefined' ? URL.createObjectURL(file) : '');
});

const previewVideoUrls = computed(() => {
  if (!files.value.length) return [];
  
  return files.value
    .filter((file: any) => file.type.startsWith('video/'))
    .map((file: any) => {
      if (typeof URL !== 'undefined') {
        const videoURL = URL.createObjectURL(file);
        return { url: videoURL, name: file.name };
      }
      return { url: '', name: file.name };
    });
});


const specialities = computed(() => {
  if (!props.medic.id) return "";

  if (!props.medic.specialities.length) {
    return props.medic.type_of_health_professional === 'medico' ? ["Médico General"] : '';
  }

  return props.medic.specialities.map((s: any) => s.name);
});

const cancel = () => editModal.value.$el.dismiss(null, 'cancel');
const confirm = async () => {

  const { ok, message, user } = await updateSocialProfile(form.value);
  if (!ok) alertMessage("Error", message);
  else {
    socialProfile.value = user.social_profile_fields;
    editModal.value.$el.dismiss('confirm');
  }
};
const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
  if (event.detail.role === 'confirm') {
    console.log('Confirm');

  }
};
async function uploadToGallery() {
  try {
    loadingMessage('Subiendo archivos');

    // Primero subimos todos los archivos a Cloudinary usando Promise.all
    const uploadPromises = files.value.map((file: any) => {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      // const { ok, resource, message } = await uploadResource(file, type);
      
      // if (!ok) {
      //   throw new Error(message ?? 'No se pudo subir el archivo');
      // }
      
      return uploadResource(file, type);
    });

    // Esperamos a que todos los archivos se suban a Cloudinary
    const resources = await Promise.allSettled(uploadPromises);
    console.log('Recursos subidos:', resources);
    
    // Ahora guardamos todos los recursos en la base de datos
    const savePromises = resources.map((resourceResult) => {
      // const { ok: okDb, image, storyError } = saveImageSocialProfile(resourceResult.resource, uploadStory.value);
      
      // if (!okDb) {
      //   throw new Error('No se pudo guardar la imagen');
      // }
      
      return (resourceResult.status === 'fulfilled' && resourceResult.value.ok) ? saveImageSocialProfile(resourceResult.value.resource, uploadStory.value) : null;
    });

    // Esperamos a que todos los recursos se guarden en la base de datos
    const results = await Promise.allSettled(savePromises);
    console.log('Resultados de guardado:', results);
    
    // Invalidamos la query para actualizar la UI
    queryClient.invalidateQueries({ queryKey: ['medic-social-posts', medicId.value] });
    
    // Limpiamos el input de archivos
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    
    // Cerramos el modal y limpiamos estados
    dismissLoading();
    isOpenUploadModal.value = false;
    uploadStory.value = false;
    
    // Verificamos si algún recurso tuvo error al subirse como historia
    const storyErrors = results.map(result => {
      if (result.status === 'rejected') {
       return result.reason
      }
      return result.value?.storyError ?? null;
    });
    const errorMessages = storyErrors.filter(Boolean);
    if (errorMessages.length > 0) {

      alertMessage(
        'Error al subir a historias', 
        'Los archivos se subieron correctamente a tu galería. ' + [...new Set(errorMessages)].join(', ')
      );
      // console.log('Errores al subir a historias:', [...new Set(storyErrors.filter(Boolean))]);
      
    }

  } catch (e) {
    dismissLoading();
    console.error('Error:', e);
    alertMessage('Error', e instanceof Error ? e.message : 'Ocurrió un error al subir los archivos');
  }
}
const onChangeFileUpload = async () => {
  const maxAllowedImageSize = mbToBytes(maxUploadStoryImageSizeInMb.value);
  const maxAllowedVideoSize = mbToBytes(maxUploadStoryVideoSizeInMb.value);
  const maxAllowedVideoLengthSeconds = (maxAllowedVideoLengthInMinutes.value ?? 0) * 60;
  const limitImageFiles = limitStoryUploadImages.value;

  if (fileInput.value?.files) {
    files.value = Array.from(fileInput.value.files);
  }

  if (!files.value.length) return;

  // Validar imágenes
  const imageFiles = files.value.filter((file: any) => file.type.startsWith('image/'));
  if (imageFiles.length > 0) {
    // Comprobar el límite total de imágenes
    if (limitImageFiles && (imageFiles.length + totalImages.value) > limitImageFiles) {
      if (fileInput.value) fileInput.value.value = '';
      return alertMessage('Error', `No puedes subir más de ${limitImageFiles} imágenes en total`);
    }

    // Comprobar el tamaño de cada imagen
    const oversizedImages = imageFiles.filter((file: any) => file.size > maxAllowedImageSize);
    if (oversizedImages.length > 0) {
      if (fileInput.value) fileInput.value.value = '';
      return alertMessage('Error', `El tamaño de cada imagen debe ser menor de ${maxUploadStoryImageSizeInMb.value}MB`);
    }
  }

  // Validar videos
  const videoFiles = files.value.filter((file: any) => file.type.startsWith('video/'));
  if (videoFiles.length > 0) {
    // Comprobar el tamaño de cada video
    const oversizedVideos = videoFiles.filter((file: any) => file.size > maxAllowedVideoSize);
    if (oversizedVideos.length > 0) {
      if (fileInput.value) fileInput.value.value = '';
      return alertMessage('Error', `El tamaño de cada video debe ser menor de ${maxUploadStoryVideoSizeInMb.value}MB. Intenta reduciendo la calidad a 720p ó la duración del video`);
    }

    // Comprobar la duración de cada video
    const totalDuration = totalVideosInSeconds.value;
    
    // Crear promesas para cada video
    const videoDurationPromises = videoFiles.map((file: any) => {
      return new Promise<number>((resolve) => {
        const videoURL = URL.createObjectURL(file);
        const video = document.createElement('video');
        
        video.addEventListener('loadedmetadata', () => {
          const duration = video.duration;
          URL.revokeObjectURL(videoURL);
          resolve(duration);
        });
        
        video.addEventListener('error', () => {
          URL.revokeObjectURL(videoURL);
          resolve(0); // En caso de error, asumimos duración 0
        });
        
        video.src = videoURL;
      });
    });
    
    // Verificar la duración total
    try {
      const durations = await Promise.all(videoDurationPromises);
      const totalNewVideoDuration = durations.reduce((sum, duration) => sum + duration, 0);
      
      if (maxAllowedVideoLengthSeconds && (totalNewVideoDuration + totalDuration) > maxAllowedVideoLengthSeconds) {
        if (fileInput.value) fileInput.value.value = '';
        return alertMessage('Error', `Has alcanzado el límite de duración de videos. La duración máxima de los videos en tu galería no debe superar los ${maxAllowedVideoLengthInMinutes.value} minutos.`);
      }
    } catch (error) {
      console.error('Error al verificar la duración de los videos', error);
      if (fileInput.value) fileInput.value.value = '';
      return alertMessage('Error', 'No se pudo verificar la duración de los videos');
    }
  }

  isOpenUploadModal.value = true;
};




provide("medicId", medicId);
</script>
<template>
  <div lines="none" class="flex gap-4 mt-3 p-2">
    <ion-avatar slot="start">
      <img :alt="medicName" :src="medic.avatar_path" />
    </ion-avatar>
    <ion-label class="flex-1" color="dark">
      {{ medicName }}
      <h3 class="specialities">
        <span v-for="(speciality, index) in specialities" :key="speciality + index">{{ speciality }}</span>
      </h3>

      <p>{{ socialProfile?.schools }}</p>
      <p>{{ socialProfile?.titles }}</p>

    </ion-label>
  </div>
  <div class="p-2 text-sm">
    <h3> <ion-text color="primary">Servicios Médicos Ofrecidos:</ion-text></h3>
    <p>{{ socialProfile?.services }}</p>
  </div>
  <div class="p-2 text-sm" v-if="medic.id === auth.user?.id">
    <ion-button fill="outline" size="small" id="open-modal">Editar Perfil</ion-button>
  </div>





  <ion-segment v-model="segmentCase">
    <ion-segment-button value="all">
      <ion-icon :icon="image"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="videos">
      <ion-icon :icon="videocam"></ion-icon>
    </ion-segment-button>

  </ion-segment>
  <component :is="segmentCase == 'all' ? AllPosts : VideoPosts" />
 
 

  <!-- Modal de subida -->
  <ion-modal ref="showUploadModal" :is-open="isOpenUploadModal" :initial-breakpoint="0.50" :breakpoints="[0, 0.25, 0.5, 0.75, 1]">
    <ion-content class="ion-padding">

      <ion-item>
        <ion-toggle v-model="uploadStory">¿Quieres también subirlo como historia?</ion-toggle>
      </ion-item>
      
      <!-- Previsualización de imágenes múltiples -->
      <div class="preview-container">
        <div v-for="url in previewUrls" :key="url" class="preview-image-container">
          <img :src="url" class="preview-image" />
        </div>
      </div>
      
      <!-- Previsualización de videos múltiples -->
      <div class="preview-container">
        <div v-for="video in previewVideoUrls" :key="video.url" class="preview-video-container">
          <video controls class="preview-video">
            <source :src="video.url" />
            Tu navegador no soporta videos.
          </video>
          <p class="video-name">{{ video.name }}</p>
        </div>
        <p v-if="previewVideoUrls.length > 0" class="text-base text-center">
          Se recomienda videos cortos de 30 segundos (capacidad máxima en tu galería: {{ maxAllowedVideoLengthInMinutes }} minutos)
        </p>
      </div>

      <div class="flex justify-center gap-2 mt-4">
        <ion-button @click="uploadToGallery">Subir</ion-button>
        <ion-button color="medium" @click="isOpenUploadModal = false">Cancelar</ion-button>
      </div>
    </ion-content>
  </ion-modal>


  <ion-modal ref="editModal" trigger="open-modal" @willDismiss="onWillDismiss">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="cancel()">Cancelar</ion-button>
        </ion-buttons>
        <ion-title>Perfil Social</ion-title>

      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="Universidades" label-placement="stacked" v-model="form.schools" type="text" placeholder="Donde de graduaste"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Titulos" label-placement="stacked" v-model="form.titles" type="text" placeholder="Tus títulos"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Servicios que ofreces" label-placement="stacked" v-model="form.services" type="text" placeholder="Tus servicios"></ion-input>
      </ion-item>
      <ion-button expand="block" @click="confirm()">Guardar</ion-button>
    </ion-content>
  </ion-modal>
  <input type="file" multiple ref="fileInput" @change="onChangeFileUpload" class="hidden" accept="image/*, video/*" />
  <ion-fab slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button @click="fileInput?.click()">
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>

  </ion-fab>


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

.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.preview-image-container, .preview-video-container {
  width: calc(32% - 4px);
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.preview-video {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.video-name {
  font-size: 12px;
  margin: 4px 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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