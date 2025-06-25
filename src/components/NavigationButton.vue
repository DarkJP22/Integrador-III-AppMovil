<template>
    <button
      class="p-4 text-white/50 hover:text-white transition-colors"
      @click="$emit('click')"
      :aria-label="direction === 'left' ? 'Previous story' : 'Next story'"
    >
      <svg
        class="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'"
        />
      </svg>
    </button>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    direction: 'left' | 'right';
  }>();
  
  defineEmits(['click']);
  </script>