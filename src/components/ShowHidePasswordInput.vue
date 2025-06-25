
<script lang="ts" setup>
import {
    eyeSharp,
    eyeOff

} from "ionicons/icons";
import { IonInput, IonIcon } from "@ionic/vue";
import { ref } from "vue";

defineProps(['modelValue', 'required', 'label', 'labelPlacement','error'])
defineEmits(['update:modelValue'])

const showPassword = ref(false);
</script>
<template>
    <ion-input :label="label || 'Contraseña'" :labelPlacement="labelPlacement" v-if="showPassword" type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :required="required" :class="{ 'ion-invalid ion-touched': error }" :errorText="error"></ion-input>
    <ion-input v-else :label="label || 'Contraseña'" :labelPlacement="labelPlacement" type="password" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :required="required" :class="{ 'ion-invalid ion-touched': error }" :errorText="error"></ion-input>
    <ion-icon :icon="showPassword ? eyeOff : eyeSharp" slot="end" @click="showPassword = !showPassword"></ion-icon>
</template>