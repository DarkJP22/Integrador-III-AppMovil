import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';

const invoices = ref<any[]>([]);

const useInvoices = () => {


  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])


  const getInvoices = async (patientIde: any, page = 1) => {

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get('/patients/'+ patientIde + '/invoices', {
        params: { page }
      })

      if(page === 1){
        invoices.value = [];
      }
      
      if(data.data && data.data.length > 0){
        invoices.value.push(...data.data)
        currentPage.value = data.current_page;
        lastPage.value =  data.last_page
        errorMessage.value = null
      }
      


      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  const getInvoice = async (id: number) => {

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/invoices/' + id)

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  
  return {
    currentPage,
    lastPage,
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    invoices: computed( () => invoices.value ),
    errors: computed( () => errors.value ),
    nextPage: (patientIde: any) => getInvoices(patientIde, currentPage.value + 1),
    prevPage: (patientIde: any) => getInvoices(patientIde, currentPage.value - 1),
    getInvoice,
    getInvoices
  }

}


export default useInvoices