<template>
  <ion-searchbar placeholder="Buscar por nombre" :debounce="500" v-model="filters.q"></ion-searchbar>
  <ion-item>
    <ion-select label="Filtrar por:" label-placement="floating" :multiple="true" v-model="filters.status">
      <ion-select-option :value="0">Nuevas</ion-select-option>
      <ion-select-option :value="1">Agendadas</ion-select-option>
      <ion-select-option :value="2">Pendientes</ion-select-option>
      <ion-select-option :value="3">Canceladas</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-list class="">
    <ion-item lines="none" v-if="!nextAppointmentRequests.length && !isLoading" class="ion-text-center">
      <ion-label>No hay Solicitudes registradas</ion-label>
    </ion-item>
    <AppointmentRequestsItem v-for="item in nextAppointmentRequests" :key="item.id" lines="full" :appointment="item" from="next"></AppointmentRequestsItem>
  </ion-list>
</template>
<script setup lang="ts">

import { IonList, IonItem, IonLabel, IonSearchbar, IonSelect, IonSelectOption, onIonViewDidEnter } from '@ionic/vue';
import AppointmentRequestsItem from './AppointmentRequestsItem.vue';
import useAppointmentRequests from '../composables/useAppointmentRequests';
import { useMyBroadcastEvents } from '@/composables/useMyBroadcastEvents';
const { currentChannel } = useMyBroadcastEvents();
const {
  //getAppointmentRequests,
  nextAppointmentRequests,
  isLoading,
  filters,
  addNotification,
  refetchAppointmentRequests
} = useAppointmentRequests();

onIonViewDidEnter(async () => {
    currentChannel.value?.listen('AppointmentRequestCreatedEvent', (data: any) => {
      console.log('AppointmentRequestCreatedEvent AppointmentRequestlist');
      
            refetchAppointmentRequests();
            addNotification(data.appointmentRequest);
    });

});
// watch(pusherIsInit, () => {

//     subscribeUsers('AppointmentRequestCreatedEvent', (data: any) => {
//       console.log('AppointmentRequestCreatedEvent AppointmentRequestlist');
      
//       refetchAppointmentRequests();
//       addNotification(data.appointmentRequest);
//     });
  
// }, { immediate: true });


</script>
