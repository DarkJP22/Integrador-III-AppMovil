import { handleError } from "@/composables/useErrorHandling";
import gpsApi from "@/services/gpsApi";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed, ref } from "vue";



export default function useUploadVoucherSubscriptionInvoice(invoiceId:number) {
   
  const queryClient = useQueryClient();
  const errors = ref<any>({});

  const uploadVoucher = async ( form: any ) => {

    const { voucher } = form
    const dataToSave = { voucher }

    
    const { data } = await gpsApi.postForm('/medic/subscription/invoices/' + invoiceId+ '/upload-voucher', dataToSave)
     return  data ;

    

  }

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: uploadVoucher,
    onSuccess: () => {
      // refetch the articles list
      queryClient.invalidateQueries({ queryKey: ['subscriptionInvoices'] });
    },
    onError: (error: any) => {
      errors.value = handleError(error)

    }
  
})


  return {
      isLoading: computed(() => isPending.value),
      isError: computed(() => isError.value),
      isSuccess: computed(() => isSuccess.value),
      errors: errors.value,
      uploadVoucher: mutate
  }
}