<template>
  <div class="h-0.5 flex-1 mx-0.5">
    <div class="h-full bg-white/30 rounded-full overflow-hidden">
      <div class="h-full bg-white" :style="{
        width: progressWidth + '%',
        //transition: progressTransition
      }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  index: number;
  currentIndex: number;
  isPlaying: boolean;
  durationInSeconds: number;
}>();

const progress = ref(0);
const duration = props.durationInSeconds ? (props.durationInSeconds * 1000) : 3000; // Total duration in milliseconds
const interval = 10; // Update every 10 milliseconds
const increment = 100 / (duration / interval);

const isActive = computed(()=>{
  return props.index === props.currentIndex;
})

let timer:undefined | NodeJS.Timeout;

function fireInterval(){
    timer = setInterval(() => {

    progress.value = progress.value + increment;
    //console.log('next', progress.value);

    if (progress.value >= 100) {
      clearInterval(timer);
      //return 100;
      progress.value = 100;
    }
    //progress.value = nextProgress;
    //console.log('progress', progress.value);

    }, interval);
}

 watch(isActive, (newVal) => {
   if(newVal){
    // console.log('active', props.currentIndex);
    progress.value = 0;
    fireInterval();
   
   }
 }, { immediate: true});

const progressWidth = computed(() => {

  if (props.index !== props.currentIndex) {
    clearInterval(timer)
    return 0;
  }

  return progress.value;

});

</script>