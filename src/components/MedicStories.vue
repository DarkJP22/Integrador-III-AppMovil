<script setup lang="ts">
import useSocialStories from '@/modules/patient/composables/useSocialStories';
import { onMounted, ref } from 'vue';
import CldImage from './CldImage.vue';
import StoryViewer from './StoryViewer.vue';
import CldVideo from './CldVideo.vue';
const selectedStoryIndex = ref<number | null>(null);
const { getSocialStories, stories } = useSocialStories();

function openMedia(publicId: string) {
    console.log('Open media', publicId);
    selectedStoryIndex.value = stories.value.findIndex((story: any) => story.public_id === publicId);
}
function handleClose() {
    console.log('Close story viewer');
    selectedStoryIndex.value = null;
}
onMounted(getSocialStories);
</script>
<template>
    <swiper-container slides-per-view="4" css-mode="true" :autoplay="true" space-between="30" class="py-3">
        <swiper-slide v-for="story in stories" :key="story.id">
            <button class="flex-shrink-0 w-24 h-24 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">
                <div class="w-full h-full rounded-full overflow-hidden border-4 border-red-400">

                    <CldImage v-if="story.type === 'image'" :public-id="story.public_id" @click="openMedia(story.public_id)" />
                    <div class="relative w-full h-full" @click="openMedia(story.public_id)" v-if="story.type === 'video'">
                        <div class="absolute inset-0 z-10 w-full h-full"></div>
                        <CldVideo :public-id="story.public_id" :controls="false" classes="w-full h-full object-cover object-center" />
                    </div>
                </div>
            </button>
            <span class="text-[10px] text-gray-500 truncate max-w-[64px] text-center">{{ story.user?.name }}</span>
        </swiper-slide>

    </swiper-container>
    <!-- <div class="flex items-start space-x-3 py-3 overflow-x-auto pb-2 scrollbar-hide"> -->
    <!-- <div class="flex flex-col flex-shrink-0 items-center space-y-1">
            <button class="flex justify-center items-center w-16 h-16 rounded-full border-2 border-blue-400 border-dashed transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 group" aria-label="Add new story"><span class="text-2xl text-blue-400 transition-colors duration-300 group-hover:text-blue-500">+</span>
            </button>
            <span class="text-xs text-gray-500">Add Story</span>
        </div> -->
    <!-- <div class="flex flex-col flex-shrink-0 items-center space-y-1" v-for="story in stories" :key="story.id">
            <button class="flex-shrink-0 w-24 h-24 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">
                <div class="w-full h-full rounded-full overflow-hidden border-4 border-red-400">
                 
                    <CldImage v-if="story.type === 'image'" :public-id="story.public_id" @click="openMedia(story.public_id)" />
                    <div class="relative w-full h-full" @click="openMedia(story.public_id)" v-if="story.type === 'video'">
                        <div class="absolute inset-0 z-10 w-full h-full"></div>
                        <CldVideo :public-id="story.public_id" :controls="false" classes="w-full h-full object-cover object-center" />
                    </div>
                </div>
            </button>
            <span class="text-[10px] text-gray-500 truncate max-w-[64px] text-center">{{ story.time_ago }}</span>
        </div> -->
    <!-- </div> -->
    <StoryViewer v-if="selectedStoryIndex !== null" :stories="stories" :initial-index="selectedStoryIndex" @close="handleClose" />
</template>