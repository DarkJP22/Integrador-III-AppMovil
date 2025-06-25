<template>
  <div class="fixed inset-0 bg-black touch-pan-y z-50 mt-14" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- Progress bars -->
    <div class="absolute top-0 left-0 right-0 flex p-2 z-10">
      <ProgressBar v-for="(story, idx) in stories" :key="idx" :index="idx" :current-index="currentIndex" :is-playing="isPlaying" :duration-in-seconds="story.duration" />
    </div>

    <!-- Close button -->
    <button class="absolute top-4 right-4 text-white/80 hover:text-white z-30 p-2" @click="emit('close')" aria-label="Close story">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Left navigation -->
    <div class="absolute inset-y-0 left-0 flex items-center z-20">
      <NavigationButton v-if="currentIndex > 0" direction="left" @click="handlePrevious" />
    </div>

    <!-- Right navigation -->
    <div class="absolute inset-y-0 right-0 flex items-center z-20">
      <NavigationButton v-if="currentIndex < stories.length - 1" direction="right" @click="handleNext" />
    </div>

    <!-- Story image -->
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- <img v-if="currentStory.type === 'image'" :src="currentStory?.url" :alt="`Story ${currentIndex + 1}`" class="max-w-full max-h-full object-contain" /> -->
      <CldVideo :key="currentStory.id" v-if="currentStory.type === 'video'" :autoplay="true" :public-id="currentStory.public_id" classes="w-full h-full object-contain object-center" />
      <div class="max-w-full max-h-full object-contain" v-if="currentStory.type === 'image'">

            <CldImage :public-id="currentStory.public_id" :key="currentStory.id" />
        </div>
    </div>

    <!-- Time indicator -->
    <div class="absolute bottom-4 left-4 text-white/70 text-sm">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import ProgressBar from './ProgressBar.vue';
import NavigationButton from './NavigationButton.vue';
import { Story } from '@/interfaces/stories';
import CldImage from './CldImage.vue';
import CldVideo from './CldVideo.vue';

const props = defineProps<{
  stories: Story[];
  initialIndex: number;
}>();

const emit = defineEmits(['close']);

const STORY_DURATION = 3000;
const currentIndex = ref(props.initialIndex);
const isPlaying = ref(true);
const progressTimeout = ref<NodeJS.Timeout | null>(null);
const touchStart = ref<{ x: number; y: number } | null>(null);
const touchEnd = ref<{ x: number; y: number } | null>(null);

// Time formatting
const formattedTime = computed(() => {
  const timestamp = props.stories[currentIndex.value]?.time_ago;
  return timestamp ?? '';
});

// Current story reference
const currentStory = computed(() => props.stories[currentIndex.value]);

// Progress management
const startProgress = () => {
  if (progressTimeout.value) clearTimeout(progressTimeout.value);

  progressTimeout.value = setTimeout(() => {
    if (currentIndex.value < props.stories.length - 1) {
      currentIndex.value++;
    } else {
      emit('close');
    }
  }, currentStory.value.type === 'video' ? (currentStory.value.duration * 1000) : STORY_DURATION);
};

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft' && currentIndex.value > 0) {
    currentIndex.value--;
  } else if (e.key === 'ArrowRight' && currentIndex.value < props.stories.length - 1) {
    currentIndex.value++;
  } else if (e.key === 'Escape') {
    emit('close');
  }
};

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
  //isPlaying.value = false;
  touchStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};

const handleTouchMove = (e: TouchEvent) => {
  touchEnd.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};

const handleTouchEnd = () => {
  if (!touchStart.value || !touchEnd.value) return;

  const xDiff = touchStart.value.x - touchEnd.value.x;
  const yDiff = touchStart.value.y - touchEnd.value.y;

  if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
    if (xDiff > 0 && currentIndex.value < props.stories.length - 1) {
      currentIndex.value++;
    } else if (xDiff < 0 && currentIndex.value > 0) {
      currentIndex.value--;
    }
  }

  isPlaying.value = true;
  touchStart.value = null;
  touchEnd.value = null;
};

// Navigation handlers
const handlePrevious = () => {
  currentIndex.value > 0 && currentIndex.value--;
  isPlaying.value = true;
}
const handleNext = () => {
  currentIndex.value < props.stories.length - 1 && currentIndex.value++
  isPlaying.value = true;
};

// Story viewed tracking
const markStoryAsViewed = (index: number) => {
  const savedStories = localStorage.getItem('stories');
  if (!savedStories) return;

  const allStories = JSON.parse(savedStories);
  const storyToUpdate = allStories.find((s: Story) => s.id === props.stories[index].id);
  if (storyToUpdate) {
    storyToUpdate.viewed = true;
    localStorage.setItem('stories', JSON.stringify(allStories));
  }
};

// Watchers
watch(currentIndex, (newIndex) => {
  markStoryAsViewed(newIndex);
  startProgress();
});

watch(isPlaying, (newVal) => {
  if (newVal) startProgress();
});

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  startProgress();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (progressTimeout.value) clearTimeout(progressTimeout.value);
});
</script>