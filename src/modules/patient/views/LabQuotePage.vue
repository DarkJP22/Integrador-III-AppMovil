<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Cotizar Boleta</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <form action="#" @submit.prevent="onSave()" novalidate>
                <ion-grid>
                    <ion-row class="ion-justify-content-center" color="primary">
                        <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                            <div class="">
                                <ion-item>
                                    <ion-input label="Identificación" labelPlacement="floating" type="number" v-model="form.ide"  :class="{ 'ion-invalid ion-touched': errors?.ide }" :errorText="errors?.ide" @change="searchPerson"></ion-input>
                                   
                                </ion-item>
                                <ion-item>
                                    <ion-input label="Nombre completo" labelPlacement="floating" type="text" v-model="form.name" :class="{ 'ion-invalid ion-touched': errors?.name }" :errorText="errors?.name"></ion-input>
                                   
                                </ion-item>
                                <ion-item>
                                    <ion-input label="Teléfono" labelPlacement="floating" type="text" v-model="form.phone_number" :class="{ 'ion-invalid ion-touched': errors?.phone_number }" :errorText="errors?.phone_number"></ion-input>
                                 
                                </ion-item>
                                <ion-item>
                                    <ion-button @click="takePhoto()">
                                        <ion-icon :icon="camera" slot="start"></ion-icon> Tomar Foto
                                    </ion-button>
                                    <ion-grid>
                                        <ion-row>
                                            <ion-col size="6" :key="index" v-for="(photo, index) in photos">
                                                <ion-img :src="photo.webviewPath" @click="removeTempPhoto(photo, index)"></ion-img>
                                                <span v-if="errors && errors[`photos.${index}`]">
                                                <p class="photos error-text sc-ion-textarea-md">{{ errors[`photos.${index}`][0] }}</p>
                                                </span>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>
                                </ion-item>
                                <ion-item lines="none">
                                <small>
                                    <NoteMaxUploadFileSize />
                                </small>
                                </ion-item>

                            </div>
                            <div class="ion-padding">
                                <ion-button type="submit" expand="block" shape="round" :disabled="isLoading">
                                    Enviar
                                </ion-button>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </form>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonCol, IonRow, IonItem, IonButton, IonIcon, IonImg, IonInput } from '@ionic/vue';
import { camera } from "ionicons/icons";
import { onMounted, ref } from 'vue';
import usePhotoGallery from "@/composables/usePhotoGallery";
import useQuoteOrders from "@/modules/patient/composables/useQuoteOrders";
import useUi from '@/composables/useUi';
import useUtilities from '@/composables/useUtilities';
import NoteMaxUploadFileSize from '@/components/NoteMaxUploadFileSize.vue';
import { useRoute } from 'vue-router';
const { takePhoto, photos } = usePhotoGallery()
const { send, isLoading, errors } = useQuoteOrders()
const { alertMessage, toastMessage } = useUi();
const { getCedulaInformation } = useUtilities();
const route = useRoute();

const form = ref<any>({
    tipo_identificacion: '01',
    ide: '',
    name: '',
    phone_number: '',
    photos: [],
    office_id: +route.params.id
});

async function searchPerson() {

    searchHacienda();
      
}

async function searchHacienda() {
    const { nombre, tipoIdentificacion } = await getCedulaInformation(form.value.ide)

    form.value.name = nombre;
    form.value.tipo_identificacion = tipoIdentificacion;
}

async function onSave() {
    form.value.photos.push(...photos.value);


    const { ok, message } = await send(form.value);
    if (!ok) alertMessage("Error", message);
    else {
        toastMessage('Solicitud Enviada. Estaremos contactadolo lo más pronto posible', 'primary');

        photos.value = [];
        form.value.tipo_identificacion = '';
        form.value.ide = '';
        form.value.name = '';
        form.value.phone_number = '';
        form.value.photos = [];
        form.value.office_id = '';
    }

}

function removeTempPhoto(photo: any, index: any) {
    photos.value.splice(index, 1);
}
onMounted(() =>{
    photos.value = [];
});
</script>