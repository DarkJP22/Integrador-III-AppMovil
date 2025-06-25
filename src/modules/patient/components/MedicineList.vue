<script setup lang="ts">
import {
  IonList,
  IonLabel,
  IonItem,
  IonIcon,
  IonAccordionGroup,
  IonAccordion,
  IonButton,
} from "@ionic/vue";
import { notificationsSharp, notificationsOutline, trashOutline, trashSharp } from "ionicons/icons";
import { PropType } from "vue";
const emit = defineEmits(["onConfirmDelete", "disableEnableDosesReminder"]);
defineProps({
  medicines: {
    type: Array as PropType<any[]>,
    required: true,
  },

});
</script>
<template>
    <ion-item lines="none" v-if="!medicines.length" class="ion-text-center">
        <ion-label>No hay elementos que mostrar</ion-label>
      </ion-item>
      <ion-accordion-group v-else>
        <ion-accordion :value="item.name" v-for="item in medicines" :key="item.id">
          <ion-item slot="header">
            <ion-label color="primary">{{ item.name }}</ion-label>
            <ion-icon :md="notificationsSharp" :ios="notificationsOutline" slot="end" v-if="item.dosesreminder"></ion-icon>
          </ion-item>

          <ion-list slot="content">
           
            <ion-item lines="none" v-if="!item.dosesreminder" class="ion-text-center">
              <ion-label>No hay esquema de dosis</ion-label>
            </ion-item>
            <ion-item v-else>
              <ion-label class="ion-text-wrap">
                <h2>Esquema de dosis</h2>
                <h3>
                  {{
                    item.dosesreminder ? item.dosesreminder.schema : ""
                  }}
                  Vez(es) al día por
                  {{ item.dosesreminder ? item.dosesreminder.days : "" }} días
                </h3>
                <p>
                  Horas:
                  <span v-for="hour in item.dosesreminder.hours" :key="hour">{{ hour }} |
                  </span>
                </p>
                <p>
                  <ion-button @click="emit('disableEnableDosesReminder', item.dosesreminder)" :color="item.dosesreminder.active ? 'danger' : 'primary'"><small>{{
                    item.dosesreminder.active ? "Desactivar" : "Activar"
                  }}
                      Notificación</small>
                  </ion-button>
                </p>
              </ion-label>
             
            </ion-item>
            <ion-button v-if="item.canDelete" color="danger" slot="end" fill="solid" @click="emit('onConfirmDelete', item)">
                <ion-icon :ios="trashOutline" :md="trashSharp"></ion-icon>
              </ion-button>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

      
</template>    