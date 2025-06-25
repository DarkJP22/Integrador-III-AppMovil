<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Paquetes de examenes</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
           

            <ion-list class="">
                <ion-item lines="none" v-if="!examsPackages.length && !isLoading" class="ion-text-center">
                    <ion-label>
                        No hay paquetes disponibles
                        <!-- <p>Amplia el rango de busqueda o utiliza los filtros</p> -->
                    </ion-label>

                </ion-item>
                <exams-packages-item :package="item" v-for="item in examsPackages" :key="item.id" />
            </ion-list>

            <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
                <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>
            
        </ion-content>
        
    </ion-page>
</template>
<script setup lang="ts">
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonBackButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonItem,
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    InfiniteScrollCustomEvent,
  
} from "@ionic/vue";
import { onMounted, ref, watch } from "vue";
import useExamsPackages from '@/modules/patient/composables/useExamsPackages';
import ExamsPackagesItem from "../components/ExamsPackagesItem.vue";
import { useRoute } from "vue-router";
import useLaboratories from "../composables/useLaboratories";
const route = useRoute();
const { getExamsPackages, examsPackages, isLoading, currentPage, lastPage, nextPage } = useExamsPackages();
const {
    getLaboratory,
    currentLab,
    //isLoading,
} = useLaboratories();
const filters = ref<{
    q: string;
    office_id: number;
}>({
    q: "",
    office_id: +route.params.id
});
const isDisabled = ref(false);


watch(filters.value, async () => {
      
     
      await getExamsPackages(filters.value);
      isDisabled.value = false;


});

const loadMoreData = async (ev: InfiniteScrollCustomEvent) => {
    try {
        if (currentPage.value == lastPage.value) {
            ev.target.disabled = true;
            isDisabled.value = true;
            return;
        }

        await nextPage(filters.value);

        ev.target.complete();
    } catch (error: any) {
        console.error(error);
    }
};

onMounted(async () => {
    getExamsPackages(filters.value);
    if(!currentLab.value?.id){
        getLaboratory(+route.params.id);
    }
});
</script>