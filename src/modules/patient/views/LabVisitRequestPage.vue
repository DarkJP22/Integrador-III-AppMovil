<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Solicitar Muestra a domicilio</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <h2>Datos del paciente</h2>
            <form action="#" @submit.prevent="onSave()" novalidate>
                <ion-grid>
                    <ion-row class="ion-justify-content-center" color="primary">
                        <ion-col class="ion-align-self-center" size-md="6" size-lg="8" size-xs="12">
                            <div class="">
                                <ion-item>
                                    <ion-label>
                                    <ion-select label="Tipo identificación" labelPlacement="floating" v-model="form.tipo_identificacion" :class="{ 'ion-invalid ion-touched': errors?.tipo_identificacion }" :errorText="errors?.tipo_identificacion">
                                    <ion-select-option value="01">Cédula Física</ion-select-option>
                                    <ion-select-option value="02">Cédula Jurídica</ion-select-option>
                                    <ion-select-option value="03">DIMEX</ion-select-option>

                                    </ion-select>
                                    <ion-note color="danger" v-if="errors.tipo_identificacion">{{ errors.tipo_identificacion[0] }}</ion-note>
                                    </ion-label>
                                
                                </ion-item>
                                <ion-item>
                                    <ion-input label="Identificación" labelPlacement="floating" type="number" v-model="form.ide" @change="searchHacienda" :class="{ 'ion-invalid ion-touched': errors?.ide }" :errorText="errors?.ide"></ion-input>
                                   
                                </ion-item>
                                <ion-item>
                                    <ion-input label="Nombre completo" labelPlacement="floating" type="text" v-model="form.first_name" :class="{ 'ion-invalid ion-touched': errors?.first_name }" :errorText="errors?.first_name"></ion-input>
                                  
                                </ion-item>
                                <ion-item :button="true" id="open-birthdate-input">
                                    <ion-input label="Fecha de nacimiento" labelPlacement="floating" :value="parseDate(form.birth_date)" :class="{ 'ion-invalid ion-touched': errors?.birth_date }" :errorText="errors?.birth_date" />
                                    <ion-popover trigger="open-birthdate-input" :show-backdrop="true" alignment="center" class="popover-period">
                                        <ion-content>
                                            <ion-datetime v-model="form.birth_date" presentation="date" />
                                        </ion-content>
                                    </ion-popover>
                                  
                                </ion-item>
                                <ion-item>
                                    <ion-label>
                                    <ion-select label="Género" labelPlacement="floating" v-model="form.gender" :class="{ 'ion-invalid ion-touched': errors?.gender }" :errorText="errors?.gender">
                                        <ion-select-option value="f">Femenino</ion-select-option>
                                        <ion-select-option value="m">Másculino</ion-select-option>
                                        <ion-select-option value="o">Otro</ion-select-option>
                                    </ion-select>
                                    <ion-note color="danger" v-if="errors.gender">{{
                                        errors.gender[0]
                                    }}</ion-note>
                                    </ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-input label="Teléfono" labelPlacement="floating" type="number" v-model="form.phone_number" :class="{ 'ion-invalid ion-touched': errors?.phone_number }" :errorText="errors?.phone_number"></ion-input>
                                   
                                </ion-item>


                                <ion-item>
                                    <ion-label>
                                    <ion-select label="Provincia" labelPlacement="floating" v-model="form.province" @ionChange="onChangeProvince($event)" :class="{ 'ion-invalid ion-touched': errors?.province }" :errorText="errors?.province">
                                        <ion-select-option value=""></ion-select-option>
                                        <ion-select-option :value="province.id" v-for="province in filteredProvincias" :key="province.id">
                                            {{ province.title }}</ion-select-option>
                                    </ion-select>
                                    <ion-note color="danger" v-if="errors.province">{{
                                        errors.province[0]
                                    }}</ion-note>
                                    </ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-label>
                                    <ion-select label="Cantón" labelPlacement="floating" v-model="form.canton" @ionChange="onChangeCanton($event)" :class="{ 'ion-invalid ion-touched': errors?.canton }" :errorText="errors?.canton">
                                        <ion-select-option value=""></ion-select-option>
                                        <ion-select-option :value="canton.id" v-for="canton in filteredCantones" :key="canton.id">
                                            {{ canton.title }}</ion-select-option>
                                    </ion-select>
                                    <ion-note color="danger" v-if="errors.canton">{{
                                        errors.canton[0]
                                    }}</ion-note>
                                     </ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-label>
                                    <ion-select label="Distrito" labelPlacement="floating" v-model="form.district" required :class="{ 'ion-invalid ion-touched': errors?.district }" :errorText="errors?.district">
                                        <ion-select-option value=""></ion-select-option>
                                        <ion-select-option :value="district.id" v-for="district in filteredDistritos" :key="district.id">
                                            {{ district.title }}</ion-select-option>
                                    </ion-select>
                                    <ion-note color="danger" v-if="errors.district">{{
                                        errors.district[0]
                                    }}</ion-note>
                                    </ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-input label="Indique las coordenadas de su ubicación" labelPlacement="floating" type="text" v-model="form.coords" :class="{ 'ion-invalid ion-touched': errors?.coords }" :errorText="errors?.coords"></ion-input>


                                </ion-item>
                                <div class="ion-text-center">
                                    <ion-button color="medium" fill="solid" @click="getGeolocation">Obtener ubicación Actual</ion-button>
                                </div>


                            </div>
                            <div class="ion-padding">
                                <ion-button type="submit" expand="block" shape="round" :disabled="isLoading">
                                    Guardar
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
import useMyGeolocation from '@/composables/useMyGeolocation';
import useProvinces from '@/composables/useProvinces';
import useUi from '@/composables/useUi';
import useUtilities from '@/composables/useUtilities';
import useAuth from '@/modules/auth/composables/useAuth';
import useLabVisits from '@/modules/patient/composables/useLabVisits';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonSelect, IonSelectOption, IonNote, IonInput, IonButton, SelectCustomEvent, IonDatetime, IonPopover, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLaboratories from '../composables/useLaboratories';

const { errors, createVisitRequest, isLoading, currentVisitLocation } = useLabVisits();
const { provincias, cantones, distritos, loadCantones, loadDistricts } =
    useProvinces();
const router = useRouter();
const { parseDate, getCedulaInformation } = useUtilities();
const { alertMessage, toastMessage } = useUi();
const { coords, getUserLocation } = useMyGeolocation();
const { auth } = useAuth();
const {
    currentLab,
} = useLaboratories();
const route = useRoute();
const form = ref({
    tipo_identificacion: "",
    ide: "",
    first_name: "",
    birth_date: undefined,
    gender: "",
    phone_country_code: "+506",
    phone_number: "",
    province: "",
    canton: "",
    district: "",
    coords: "",
    visit_location: currentVisitLocation.value,
    office_id: +route.params.id
})

watch(() => form.value.district, (val) => {
    if (!form.value.visit_location) {
        form.value.visit_location = val;
    }
});

const filteredProvincias = computed(() => {
    const availableProvincias = currentLab.value?.settings.availableProvincias ?? [];
    if (availableProvincias.length) {
        return provincias.value.filter(c => availableProvincias.includes(c.title)).map(item => { return { id: item.id, title: item.title }; });
    }
    return provincias.value.map(item => { return { id: item.id, title: item.title }; });
});
const filteredCantones = computed(() => {
    const availableCantones = currentLab.value?.settings.availableCantones ?? [];
    if (availableCantones.length) {
        return cantones.value.filter(c => availableCantones.includes(c.title)).map(item => { return { id: item.title, title: item.title }; });
    }
    return cantones.value.map(item => { return { id: item.title, title: item.title }; });
})
const filteredDistritos = computed(() => {
    const availableDistritos = currentLab.value?.settings.availableDistritos ?? [];
    if (availableDistritos.length) {
        return distritos.value.filter(d => availableDistritos.includes(d.title)).map(item => { return { id: item.title, title: item.title }; });
    }
    return distritos.value.map(item => { return { id: item.title, title: item.title }; });
})

const onChangeProvince = (evt: SelectCustomEvent) => {

    form.value.canton = "";
    form.value.district = "";



    loadCantones(evt.detail.value);
};
const onChangeCanton = (evt: SelectCustomEvent) => {

    form.value.district = "";


    loadDistricts(evt.detail.value, 'title');
};

async function searchHacienda() {
    const { nombre, tipoIdentificacion } = await getCedulaInformation(form.value.ide)

    form.value.first_name = nombre;
    form.value.tipo_identificacion = tipoIdentificacion;

}
const onSave = async () => {

    const { ok, message } = await createVisitRequest(form.value);
    if (!ok) alertMessage("Error", message);
    else {

        form.value = {
            tipo_identificacion: "",
            ide: "",
            first_name: "",
            birth_date: undefined,
            gender: "",
            phone_country_code: "+506",
            phone_number: "",
            province: "",
            canton: "",
            district: "",
            coords: "",
            visit_location: "",
            office_id: +route.params.id
        }
        toastMessage("Tu cita ha sido reservada. Lo estaremos contactando para más detalles", "primary", 5000);
        router.push({ name: 'patient-home' });
    }

};

async function getGeolocation() {
    await getUserLocation(60 * 10); // 10 min
    form.value.coords = coords.value.lat + ',' + coords.value.lng;

}

onMounted(() => {
    loadCantones(form.value.province);
    loadDistricts(form.value.canton);
})
</script>