import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import { actionSheetController } from '@ionic/vue';
import { trash, close, create } from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { Medics } from '@/interfaces/medics';

const medics = ref<any[]>([]);

const useMedics = () => {

  const specialities = ref<any[]>([]);
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const router = useRouter()
  const errors = ref<any>([])


  const getMedics = async (filters: any, page = 1) => {

    const { q, speciality, lat, lon, radius, date, province, canton, district, accumulated_affiliation, type_of_health_professional } = filters;

    if (page <= 0) page = 1;

    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data }  = await gpsApi.get<Medics>('/medics', {
        params: { q, page, speciality, lat, lon, radius, date, province, canton, district, accumulated_affiliation, type_of_health_professional }
      })

      if(page === 1){
        medics.value = [];
      }
      
      if(data.data && data.data.length > 0){
        medics.value.push(...data.data)
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

  const getMedic = async (id: number, filters:any = null) => {
    let params = {};

    if(filters){
      const { lat, lon, date } = filters;
      params = {
        lat, lon, date
      }
    }
   
    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/medics/' + id,  {
        params: params
      })

      isLoading.value = false
      return data;

    } catch (error) {
      isLoading.value = false
      //throw error
      return {}


    }

  }

  const getSpecialities = async () => {


    try {
      isLoading.value = true

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get('/medics/specialities')

      if (data.length > 0) {
        specialities.value = data
        errorMessage.value = null
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error

    }

  }

  

  const presentOptions = async (patient: any) => {
    const actionSheet = await actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar',
          icon: create,
          handler: () => {
            router.push({ name: 'patient', params: { id: patient.id } })

          },
        },
        {
          text: 'Eliminar',
          role: "destructive",
          icon: trash,
          handler: () => {
            
        //
          },
        },
        {
          text: 'Cerrar',
          icon: close,
          role: "cancel",
          handler: () => {
          //
          },
        },
      ],
    });
    return actionSheet.present();
  };

  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed( () => errorMessage.value ),
    isLoading: computed( () => isLoading.value ),
    medics: computed( () => medics.value ),
    specialities: computed( () => specialities.value ),
    errors: computed( () => errors.value ),
    nextPage: (filters: any) => getMedics(filters, currentPage.value + 1),
    prevPage: (filters: any) => getMedics(filters, currentPage.value - 1),
    presentOptions,
    getMedic,
    getMedics,
    getSpecialities
  }

}


export default useMedics