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
                <h3>TIPO DE SUSCRIPCIÓN</h3>
                <ion-item lines="none" class="affiliation-select">
                    <ion-select v-model="form.type_affiliation" interface="action-sheet" placeholder="Selecciona tipo">
                        <ion-select-option value="1">BASICO</ion-select-option>
                        <ion-select-option value="2">PREMIUM</ion-select-option>
                    </ion-select>
                </ion-item>
                <div class="affiliation-input">
                    <label>NÚMERO PARA TRANSACCIÓN</label>
                    <ion-item lines="none">
                        <ion-label color="white" style="font-size:1.2em;">
                            8888-9999
                        </ion-label>
                    </ion-item>
                </div>
                <ion-button expand="block" color="primary" @click="triggerFileInput">
                    <ion-icon slot="start" name="camera"></ion-icon>
                    SUBIR FOTO
                </ion-button>
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
                <ion-button expand="block" color="primary" @click="onSubmit" :disabled="isLoading">
                    VERIFICAR
                </ion-button>
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
    type_affiliation: "1",
    phone: "45454454",
    voucher: null as File | null,
    date: "2024-06-01",
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
    if (!form.value.phone || !form.value.voucher) {
        alert("Por favor, completa todos los campos y sube una foto.");
        return;
    }
    const formData = new FormData();
    formData.append("date", "2024-06-01");
    formData.append("type_affiliation", form.value.type_affiliation);
    formData.append("voucher", form.value.voucher);
   alert("Enviando datos de afiliación..." + form.value.voucher);
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