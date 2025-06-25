<template>
    <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
    <!-- <ion-item>
        <ion-select label="Filtrar por:" label-placement="floating" :multiple="true" v-model="filters.status">
            <ion-select-option :value="0">Agendadas</ion-select-option>
            <ion-select-option :value="1">Iniciadas</ion-select-option>
            <ion-select-option :value="2">Canceladas</ion-select-option>
        </ion-select>
    </ion-item> -->
    <ion-list class="">
        <ion-item lines="none" v-if="!teleconsultations.length && !isLoading" class="ion-text-center">
            <ion-label>No hay teleconsultas registradas</ion-label>
        </ion-item>
        <TeleconsultationsItem v-for="item in teleconsultations" :key="item.id" :appointment="item" lines="full" from="history" @onCancel="setOpen(item.id)">
            <!-- <ion-button color="danger" size="small" slot="end" v-if="!item.finished && item.status === 0" @click="setOpen(item.id)">
                Cancelar</ion-button>
            <ion-button color="primary" size="small" slot="end" v-else-if="!item.finished && item.status !== 1" @click="agendarAppointment(item.id)">
                Agendar</ion-button> -->
        </TeleconsultationsItem>
    </ion-list>
    
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonList, IonItem, IonButton, IonLabel, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonSelect, IonSelectOption, IonContent, IonSearchbar, onIonViewDidEnter } from '@ionic/vue';
import useUi from '@/composables/useUi';
import { useMyBroadcastEvents } from '@/composables/useMyBroadcastEvents';
import useTeleconsultations from '../composables/useTeleconsultations';
import TeleconsultationsItem from './TeleconsultationsItem.vue';
const { currentChannel } = useMyBroadcastEvents();
const { alertMessage } = useUi();
const {
    getTeleconsultations,
    teleconsultations,
    isLoading,
    addNotification
} = useTeleconsultations();

const isOpen = ref(false);
const modal = ref();
const form = ref<{ id: null | number, status: number }>({
    id: null,
    status: 2
});

const setOpen = (itemId: number) => {
    isOpen.value = true;
    form.value.id = itemId;


};
const cancel = () => {
    modal.value?.$el.dismiss(null, 'cancel');
    isOpen.value = false;
    form.value.id = null;
    form.value.status = 2;

};


const filters = ref<any>({
    q: "",
    status: [0] //agendadas
});

watch(filters.value, async () => {

    await getTeleconsultations(filters.value);

});
onIonViewDidEnter(async () => {
    currentChannel.value?.listen('AppointmentCreatedEvent', (data: any) => {
        console.log('AppointmentCreatedEvent appointmentList');

        getTeleconsultations(filters.value);
        addNotification(data.appointment);
    });

});
// watch(pusherIsInit, () => {

//         subscribeUsers('AppointmentCreatedEvent', (data: any) => {
//             console.log('AppointmentCreatedEvent appointmentList');

//             getAppointments(filters.value);
//             addNotification(data.appointment);
//         });

// }, { immediate: true });

onMounted(async () => {
    await getTeleconsultations(filters.value);

})



</script>
