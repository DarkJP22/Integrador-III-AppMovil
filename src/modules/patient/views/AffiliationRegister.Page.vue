<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text="MÉTODO DE PAGO"></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="affiliation-content">
            <div class="affiliation-form">
                <div class="affiliation-input">
                    <label>Numero para  Sinpe</label>
                    <ion-item lines="none">
                        <ion-label color="white" style="font-size:1.2em;">
                            8888-9999
                        </ion-label>
                    </ion-item>
                </div>
                <ion-item lines="none" class="affiliation-select">
                    <ion-select v-model="form.type_affiliation" interface="action-sheet" placeholder="Selecciona tipo afiliación" class="ion-text-center">
                        <ion-select-option value="Monthly">Mensual</ion-select-option>
                        <ion-select-option value="Semi-Annually">Semestral</ion-select-option>
                        <ion-select-option value="Annually">Anual</ion-select-option>
                    </ion-select>
                </ion-item>
                <div class="space-y-4 mt-4" v-if="form.type_affiliation">
  <div
    v-if="form.type_affiliation === 'Monthly'"
    class="flex items-center justify-between max-w-2xl px-2 py-6 mx-auto border border-gray-300 text-gray-300 cursor-pointer rounded-xl dark:border-gray-800 bg-white/10"
  >
    <!-- Contenido Mensual -->
    <div class="flex items-center">
      <svg class="w-5 h-5 text-gray-400 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 20 20">
        <path clip-rule="evenodd" fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
      </svg>
      <div class="flex flex-col items-start mx-2 space-y-2">
        <h2 class="text-2xl font-medium text-gray-700 dark:text-gray-200">Mensual</h2>
        <div class="px-1 text-xs text-white-700">Costo Mensual de 2,000 mil colones</div>
      </div>
    </div>
    <div class="flex flex-col space-y-2 text-center">
      <h2 class="text-xs font-bold text-gray-700 dark:text-white">Beneficios </h2>
      <div class="text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">Descuento de Laboratorios</div>
      <div class="text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">Descuento en atención medica </div>
      <div class="flex items-center justify-center gap-1 text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">
        Descuento x Cita: 10% <span class="font-bold"></span>
      </div>
    </div>
  </div>

  <div
    v-else-if="form.type_affiliation === 'Semi-Annually'"
    class="flex items-center justify-between max-w-2xl px-2 py-6 mx-auto border border-gray-300 text-gray-300 cursor-pointer rounded-xl dark:border-gray-800 bg-white/10"
  >
    <!-- Contenido Semestral -->
    <div class="flex items-center">
      <svg class="w-5 h-5 text-gray-400 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 20 20">
        <path clip-rule="evenodd" fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
      </svg>
    <div class="flex flex-col items-start mx-2 space-y-2">
        <h2 class="text-2xl font-medium text-gray-700 dark:text-gray-200">Semestral</h2>
        <div class="px-1 text-xs text-white-700">Costo Semestral de 10,000 mil colones</div>
      </div>
    </div>
    <div class="flex flex-col space-y-2 text-center">
      <h2 class="text-xs font-bold text-gray-700 dark:text-white">Beneficios </h2>
      <div class="text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">Descuento de Laboratorios</div>
      <div class="text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">Descuento en atención medica </div>
      <div class="flex items-center justify-center gap-1 text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">
        Descuento x Cita: 10% <span class="font-bold"></span>
      </div>
    </div>
  </div>

  <div
    v-else-if="form.type_affiliation === 'Annually'"
    class="flex items-center justify-between max-w-2xl px-2 py-6 mx-auto border border-yellow-300 text-gray-300 cursor-pointer rounded-xl dark:border-yellow-500 bg-yellow-50/10"
  >
    <!-- Contenido Anual -->
    <div class="flex items-center">
      <svg class="w-5 h-5 text-yellow-400 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 20 20">
        <path clip-rule="evenodd" fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
      </svg>
     <div class="flex flex-col items-start mx-2 space-y-2">
        <h2 class="text-2xl font-medium text-gray-700 dark:text-gray-200">Anual</h2>
        <div class="px-1 text-xs text-white-700">Costo Anual de 30,000 mil colones</div>
      </div>
    </div>
    <div class="flex flex-col space-y-2 text-center">
      <h2 class="text-xs font-bold text-gray-700 dark:text-white">Beneficios </h2>
      <div class="text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">Descuento de Laboratorios</div>
      <div class="text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">Descuento en atención medica </div>
      <div class="flex items-center justify-center gap-1 text-xs text-teal-600 bg-teal-100 rounded-full px-2 py-1">
        Descuento x Cita: 10% <span class="font-bold"></span>
      </div>
    </div>
  </div>
</div>
                 <div style="display: flex; flex-direction: row; gap: 12px;"><ion-button expand="block" color="primary" @click="triggerFileInput">
                    SUBIR FOTO
                </ion-button>
                   <ion-button expand="block" color="primary" @click="onSubmit" :disabled="isLoading">
                    Enviar
                </ion-button></div>
    
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="onFileChange"
                />
                <div class="affiliation-note">
                    ASEGÚRATE DE SUBIR UNA FOTO DE BUENA CALIDAD QUE SEA ELEGIBLE<br />
                    TAMAÑO MÁXIMO DEL ARCHIVO 5MB
                </div>
                <div class="affiliation-logo">
                    <img src="@/assets/logo-white.png" alt="Doctor Blue" />
                </div>
            
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonBackButton,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonItem,
} from "@ionic/vue";
import { ref } from "vue";
import useAffiliation from "../composables/useAffiliation";
import { useRouter } from "vue-router";

const router = useRouter();
const userId = 1; // Replace with actual user id from auth/session
const { createAffiliation, isLoading, errors } = useAffiliation(userId);

const form = ref({
    type_affiliation: "",
    phone: "",
    voucher: null as File | null,
    active: true,
});

const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
    fileInput.value?.click();
}

function onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files[0]) {
        if (files[0].size > 5 * 1024 * 1024) {
            alert("El archivo excede el tamaño máximo de 5MB.");
            return;
        }
        form.value.voucher = files[0];
    }
}

async function onSubmit() {
   if(!confirm("¿Estás seguro de que deseas enviar los datos de afiliación?")) {
        return;
    }

    if (!form.value.type_affiliation|| !form.value.voucher) {
        alert("Por favor, completa todos los campos y sube una foto.");
        return;
    }
    const formData = new FormData();
    formData.append("type_affiliation", form.value.type_affiliation);
    formData.append("voucher", form.value.voucher);
    const result = await createAffiliation(formData);
    if (result.ok) {
        router.push("/patient/home/");
    } else {
        alert(result.message || "Error al registrar afiliación.");
    }
}


</script>

<style scoped>
.affiliation-content {
    background: #37474f;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.affiliation-form {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}
h3 {
    color: #fff;
    font-weight: 400;
    margin-bottom: 16px;
    letter-spacing: 1px;
}
.affiliation-select {
    width: 90%;
    margin-bottom: 18px;
    background: #263238;
    border-radius: 20px;
    color: #fff;
}
.affiliation-input {
    width: 90%;
    margin-bottom: 18px;
    color: #fff;
}
.affiliation-input label {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 4px;
    display: block;
}
.affiliation-note {
    color: #fff;
    font-size: 0.75rem;
    text-align: center;
    margin: 12px 0 18px 0;
}
.affiliation-logo {
    margin: 24px 0;
    text-align: center;
}
.affiliation-logo img {
    width: 120px;
    opacity: 0.7;
}
ion-button {
    margin-top: 12px;
}
</style>