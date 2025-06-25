import { computed, ref } from 'vue'
import gpsApi from '@/services/gpsApi';
import useAuth from '@/modules/auth/composables/useAuth';
import { alertController } from '@ionic/vue';

const notifications = ref<any>([]);
const newNotifications = ref<any>([]);

const useNotifications = () => {

  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const errorMessage = ref()
  const errors = ref<any>([])
  const { auth } = useAuth()

  const addNotification = async (notification: any) => {
    const noti = newNotifications.value.find( (noti:any) => noti.id === notification.id);

    if(!noti){
      newNotifications.value.push(notification);
    }
    
  }
  const clearNotifications = async () => {
    newNotifications.value = [];
  }

  const getNotifications = async (page = 1) => {

    if (page <= 0) page = 1
    try {

      isLoading.value = true

      const { data } = await gpsApi.get('/user/notifications', {
        params: { page }
      })

      if(page === 1){
        notifications.value = [];
      }
      
      if(data.data && data.data.length > 0){
        notifications.value.push(...data.data)
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


  const deleteNotification = async (id: number) => {


    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.delete('/users/' + auth.value.user.id + '/notifications/' + id)

      notifications.value = notifications.value.filter(
        (noti: any) => noti.id !== id
      );

      isLoading.value = false

      return { ok: true, id };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }

    }

  }

  const onConfirmDelete = async (noti: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: 'Eliminar',
      message: 'Eliminar Notificación ',
      buttons: [
        {
          text: 'cancel',
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
         //
          },
        },
        {
          text: 'Eliminar',
          cssClass: "confirm",
          handler: async () => {
            await deleteNotification(noti.id);
          },
        },
      ],
    });
    return alert.present();
  };

  const updateConfigNoti = async (form: any) => {

    const { pharmacy_notifications, clinic_notifications } = form
    const dataToSave = { pharmacy_notifications, clinic_notifications }

    try {
      errors.value = [];
      isLoading.value = true

      await gpsApi.put('/confignotifications', dataToSave)

      isLoading.value = false

      return { ok: true };

    } catch (error: any) {
      isLoading.value = false

      if (error.response.status !== 422) throw error

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message }


    }

  }

  getNotifications()


  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    isLoading: computed(() => isLoading.value),
    notifications: computed(() => notifications.value),
    newNotifications: computed(() => newNotifications.value),
    errorMessage: computed(() => errorMessage.value),
    nextPage: () => getNotifications(currentPage.value + 1),
    prevPage: () => getNotifications(currentPage.value - 1),
    onConfirmDelete,
    getNotifications,
    updateConfigNoti,
    addNotification,
    clearNotifications

  }

}


export default useNotifications