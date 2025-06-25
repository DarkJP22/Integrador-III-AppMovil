<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/" text=""></ion-back-button>
                </ion-buttons>
                <ion-title>Busqueda de examenes</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-searchbar placeholder="Buscar " :debounce="500" v-model="filters.q"></ion-searchbar>

            <ion-list class="">
                <ion-item lines="none" v-if="!exams.length && !isLoading" class="ion-text-center">
                    <ion-label>
                        No hay exámenes disponibles
                        <!-- <p>Amplia el rango de busqueda o utiliza los filtros</p> -->
                    </ion-label>

                </ion-item>
                <exams-item :exam="item" v-for="item in exams" :key="item.id" />
            </ion-list>

            <ion-infinite-scroll @ionInfinite="loadMoreData($event)" id="infinite-scroll" :disabled="isDisabled">
                <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando...">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          
        </ion-content>
        <ion-footer>
            <ion-toolbar color="primary" v-if="cart.total">
                <ion-title :router-link="`/patient/lab/${route.params.id}/cart`"><ion-icon :md="cartSharp" :ios="cartOutline"></ion-icon> <ion-badge color="danger">{{ selectedItems }}</ion-badge>  items</ion-title>
                <ion-buttons slot="end">
                    <ion-button :router-link="`/patient/lab/${route.params.id}/cart`">Ver</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-footer>
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
    IonSearchbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    InfiniteScrollCustomEvent,
    IonFooter,
    IonIcon,
    IonButton,
IonBadge
} from "@ionic/vue";
import { cartSharp, cartOutline} from 'ionicons/icons'
import { computed, onMounted, ref, watch } from "vue";
import useExams from '@/modules/patient/composables/useExams';
import useCartExams from '@/modules/patient/composables/useCartExams';
import ExamsItem from "../components/ExamsItem.vue";
import { useRoute } from "vue-router";
const { getExams, exams, isLoading, currentPage, lastPage, nextPage } = useExams();
const {  cart } = useCartExams();
const route = useRoute();

const filters = ref<{
    q: string;
    office_id: number;
}>({
    q: "",
    office_id: +route.params.id
});
const isDisabled = ref(false);

const selectedItems = computed(()=> cart.value.items.length)

watch(filters.value, async () => {
      
     
      await getExams(filters.value);
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
    getExams(filters.value);
});
</script>