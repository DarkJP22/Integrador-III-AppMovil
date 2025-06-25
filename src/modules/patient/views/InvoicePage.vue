<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Factura</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ">
      <ion-text color="primary">
        <span>{{ invoiceClinic }}</span>
      </ion-text><br />
      <small> Num: {{ invoice.NumeroConsecutivo }}</small><br />
      <small>{{ invoiceDate }}</small>

      <ion-list>
        <ion-list-header>
          <h3>Detalle</h3>
        </ion-list-header>
        <InvoiceLinesItem v-for="line in invoice.lines" :key="line.id" :line="line" :CodigoMoneda="invoice.CodigoMoneda" />
      </ion-list>

      <ion-list>
        <ion-list-header>
          <h3>Resumen Factura</h3>
        </ion-list-header>
        <ion-item>
          <ion-label> SubTotal </ion-label>

          <ion-note slot="end">{{ totalVenta }} </ion-note>
        </ion-item>
        <ion-item>
          <ion-label> Descuento </ion-label>

          <ion-note slot="end">{{ totalDescuentos }} </ion-note>
        </ion-item>
        <ion-item>
          <ion-label> Impuestos </ion-label>

          <ion-note slot="end">{{ totalImpuesto }} </ion-note>
        </ion-item>
        <ion-item>
          <ion-label> Total </ion-label>

          <ion-note slot="end">{{ totalComprobante }} </ion-note>
        </ion-item>
      </ion-list>

      <ion-list v-if="invoice.id && invoice.payments.length">
        <ion-list-header>
          <h3>Abonos</h3>
        </ion-list-header>
        <InvoicePaymentsItem v-for="payment in invoice.payments" :key="payment.id" :payment="payment" :CodigoMoneda="invoice.CodigoMoneda" />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import InvoiceLinesItem from "../components/InvoiceLinesItem.vue";
import InvoicePaymentsItem from "../components/InvoicePaymentsItem.vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonBackButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonText,
} from "@ionic/vue";
import useInvoices from "@/modules/patient/composables/useInvoices";
import { computed, onMounted, ref } from "vue";
import useUtilities from "@/composables/useUtilities";
import { useRoute } from "vue-router";

const route = useRoute();
const { id } = route.params;
const { getInvoice } = useInvoices();
const { parseDatetime, moneyFormat } = useUtilities();
const invoice = ref<any>({});

const invoiceClinic = computed(() => {
  return invoice.value.clinic?.name ?? "";
});

const invoiceDate = computed(() => {
  return parseDatetime(invoice.value.created_at);
});

const totalVenta = computed(() => {
  return moneyFormat(invoice.value.TotalVenta, invoice.value.CodigoMoneda);
});
const totalDescuentos = computed(() => {
  return moneyFormat(
    invoice.value.TotalDescuentos,
    invoice.value.CodigoMoneda
  );
});
const totalImpuesto = computed(() => {
  return moneyFormat(
    invoice.value.TotalImpuesto,
    invoice.value.CodigoMoneda
  );
});
const totalComprobante = computed(() => {
  return moneyFormat(
    invoice.value.TotalComprobante,
    invoice.value.CodigoMoneda
  );
});

onMounted(async () => {
  invoice.value = await getInvoice(parseInt(id.toString()));

});

</script>
