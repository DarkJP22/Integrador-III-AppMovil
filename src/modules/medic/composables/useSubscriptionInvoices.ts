import { handleError } from "@/composables/useErrorHandling";
import { SubscriptionInvoice } from "@/interfaces/subscriptionInvoices";
import gpsApi from "@/services/gpsApi";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, watch } from "vue";

const subscriptionInvoices = ref<SubscriptionInvoice[]>([])

export default function useSubscriptionInvoices() {
  const filters = ref<any>({
    q: "",
    status: [] //nuevas y pendientes
  });
  const isLoadingDownload = ref(false);
  const getSubscriptionInvoices = async (page = 1) => {

    const { q, status } = filters.value;

    if (page <= 0) page = 1

    const { data } = await gpsApi.get<SubscriptionInvoice[]>('/medic/subscription/invoices', {
      params: { q, status, page }
    })

    return data;


  }

  const { isPending, data } = useQuery({
    queryKey: ['subscriptionInvoices', 1, filters],
    queryFn: () => getSubscriptionInvoices(1),
    retry: false,

  });

  watch(data, newVal => {
    if (newVal) {
      subscriptionInvoices.value = newVal
    }
  }, { immediate: true });


  const getSubscriptionInvoicePDF = async (id: number) => {
    try {
      isLoadingDownload.value = true;
      const { data } = await gpsApi.get('/medic/subscription/invoices/' + id + '/pdf')
      isLoadingDownload.value = false;

      return data;

    } catch (error) {
      isLoadingDownload.value = false;
      console.log(error);
      // handleError(error)
    }


  }

  return {
    subscriptionInvoices: computed(() => subscriptionInvoices.value),
    isLoading: computed(() => isPending.value),
    filters: computed(() => filters.value),
    getSubscriptionInvoicePDF,
    isLoadingDownload: computed(() => isLoadingDownload.value),
  }
}