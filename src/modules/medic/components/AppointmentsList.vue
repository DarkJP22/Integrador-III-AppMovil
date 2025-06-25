<template>
    <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
    <ion-item>
        <ion-select label="Filtrar por:" label-placement="floating" :multiple="true" v-model="filters.status">
            <ion-select-option :value="0">Agendadas</ion-select-option>
            <ion-select-option :value="1">Iniciadas</ion-select-option>
            <ion-select-option :value="2">Canceladas</ion-select-option>
        </ion-select>
    </ion-item>
    <ion-list class="">
        <ion-item lines="none" v-if="!nextAppointments.length && !isLoading" class="ion-text-center">
            <ion-label>No hay Citas registradas</ion-label>
        </ion-item>
        <AppointmentsItem v-for="item in nextAppointments" :key="item.id" :appointment="item" lines="full" from="history" @onAgendar="agendarAppointment(item.id)" @onCancel="setOpen(item.id)">
            <!-- <ion-button color="danger" size="small" slot="end" v-if="!item.finished && item.status === 0" @click="setOpen(item.id)">
                Cancelar</ion-button>
            <ion-button color="primary" size="small" slot="end" v-else-if="!item.finished && item.status !== 1" @click="agendarAppointment(item.id)">
                Agendar</ion-button> -->
        </AppointmentsItem>
    </ion-list>
    <ion-modal ref="modal" :is-open="isOpen">
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-button @click="cancel()">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Cancelando Cita</ion-title>

            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item>
                <ion-select label="Motivo" label-placement="floating" v-model="form.status" required>
                    <ion-select-option value="2">No asistió</ion-select-option>
                    <ion-select-option value="2">Otro</ion-select-option>
                    <!-- <ion-select-option value="0">No agendó</ion-select-option> -->

                </ion-select>
            </ion-item>
            <div>
                <ion-button :strong="true" expand="block" shape="round" :disabled="isLoading" @click="cancelAppointment()">Confirmar</ion-button>

            </div>
        </ion-content>
    </ion-modal>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonList, IonItem, IonButton, IonLabel, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonSelect, IonSelectOption, IonContent, IonSearchbar, onIonViewDidEnter } from '@ionic/vue';
import AppointmentsItem from './AppointmentsItem.vue';
import useAppointments from '../composables/useAppointments';
import useUi from '@/composables/useUi';
import { useMyBroadcastEvents } from '@/composables/useMyBroadcastEvents';
const { currentChannel } = useMyBroadcastEvents();
const { alertMessage } = useUi();
const {
    getAppointments,
    updateStatusAppointment,
    nextAppointments,
    isLoading,
    addNotification
} = useAppointments();

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

const agendarAppointment = async (itemId: number) => {
    form.value.id = itemId;
    form.value.status = 0;
    const { ok, message } = await updateStatusAppointment(form.value);
    if (!ok) alertMessage("Error", message);
    else {

        modal.value?.$el.dismiss(null, 'confirm');
        isOpen.value = false;

    }
};
const cancelAppointment = async () => {
    const { ok, message } = await updateStatusAppointment(form.value);
    if (!ok) alertMessage("Error", message);
    else {

        modal.value?.$el.dismiss(null, 'confirm');
        isOpen.value = false;

    }
};

const filters = ref<any>({
    q: "",
    status: [0] //agendadas
});

watch(filters.value, async () => {

    await getAppointments(filters.value);

});
onIonViewDidEnter(async () => {
    currentChannel.value?.listen('AppointmentCreatedEvent', (data: any) => {
        console.log('AppointmentCreatedEvent appointmentList');

        getAppointments(filters.value);
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
    await getAppointments(filters.value);

})



</script>
