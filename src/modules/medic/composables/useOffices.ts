import { computed, ref } from "vue";
import gpsApi from "@/services/gpsApi";
//import useAuth from '@/modules/auth/composables/useAuth';
import { actionSheetController, alertController } from "@ionic/vue";
import { trash, close, create } from "ionicons/icons";
import { useRouter } from "vue-router";
import useUi from "@/composables/useUi";
import { handleError } from "@/composables/useErrorHandling";

const offices = ref<any[]>([]);

const useOffices = () => {
  const isLoading = ref(false);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const errorMessage = ref();
  //const { auth } = useAuth()
  const { alertMessage } = useUi();
  const router = useRouter();
  const errors = ref<any>([]);

  const getOffices = async (page = 1) => {
    if (page <= 0) page = 1;

    try {
      isLoading.value = true;

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get("/medic/offices", {
        params: { page },
      });

      if (page === 1) {
        offices.value = [];
      }

      if (data.data && data.data.length > 0) {
        offices.value.push(...data.data);
        currentPage.value = data.current_page;
        lastPage.value = data.last_page;
        errorMessage.value = null;
      }

      isLoading.value = false;
    } catch (error) {
      isLoading.value = false;
      throw error;
    }
  };

  const getOffice = async (id: number) => {
    try {
      isLoading.value = true;

      // const userId = auth.value.user ? auth.value.user.id : null
      const { data } = await gpsApi.get("/medic/offices/" + id);

      isLoading.value = false;

      return data;
    } catch (error) {
      isLoading.value = false;
      //throw error
      return {};
    }
  };
  const activateAppointmentRequestsToday = async (officeId: any, activate = true) => {
    try {
      errors.value = [];
      isLoading.value = true;

      const { data } = await gpsApi.post(
        "/medic/offices/" + officeId + "/activate-appointment-requests-today",
        { activate }
      );
      isLoading.value = false;

      return { ok: true, schedule: data };
    } catch (error: any) {
      isLoading.value = false;
      errors.value = handleError(error);
      return { ok: false, message: 'error' };
    }
  };
  const activateTeleconsultationsToday = async (officeId: any, hours: string[], fee: number = 0) => {
    try {
      errors.value = [];
      isLoading.value = true;

      const { data } = await gpsApi.post(
        "/medic/offices/" + officeId + "/activate-teleconsultations-today",
        { hours, fee }
      );
      isLoading.value = false;

      return { ok: true, schedule: data };
    } catch (error: any) {
      isLoading.value = false;
      errors.value = handleError(error);
      return { ok: false, message: 'error' };
    }
  };

  const createOffice = async (form: any) => {
    const { name, province, canton, district, address, phone, type, lat, lon, whatsapp_number, utiliza_agenda_gps } =
      form;
    const dataToSave = {
      name,
      province,
      canton,
      district,
      address,
      phone,
      type,
      lat,
      lon,
      whatsapp_number,
      utiliza_agenda_gps
    };

    try {
      errors.value = [];
      isLoading.value = true;

      const { data } = await gpsApi.post("/medic/offices", dataToSave);

      offices.value = [data, ...offices.value];

      isLoading.value = false;

      return { ok: true, office: data };
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const updateOffice = async (form: any) => {
    const {
      id,
      name,
      province,
      canton,
      district,
      address,
      phone,
      type,
      lat,
      lon,
      whatsapp_number,
      utiliza_agenda_gps
    } = form;
    const dataToSave = {
      id,
      name,
      province,
      canton,
      district,
      address,
      phone,
      type,
      lat,
      lon,
      whatsapp_number,
      utiliza_agenda_gps
    };

    try {
      errors.value = [];
      isLoading.value = true;

      const { data } = await gpsApi.put(
        "/medic/offices/" + form.id,
        dataToSave
      );

      const idx = offices.value.map((off) => off.id).indexOf(form.id);
      offices.value[idx] = data;

      isLoading.value = false;

      return { ok: true, office: data };
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const deleteOffice = async (id: number) => {
    try {
      errors.value = [];
      isLoading.value = true;

      // const userId = auth.value.user ? auth.value.user.id : null
      await gpsApi.delete("/medic/offices/" + id);

      offices.value = offices.value.filter((off) => off.id !== id);

      isLoading.value = false;

      return { ok: true, id };
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const onConfirmDelete = async (office: any) => {
    const alert = await alertController.create({
      cssClass: "confirm-delete-alert",
      header: "Eliminar",
      message: "Eliminar Consultorio " + office.name,
      buttons: [
        {
          text: "cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //
          },
        },
        {
          text: "Eliminar",
          cssClass: "confirm",
          handler: async () => {
            const { ok, message } = await deleteOffice(office.id);
            if (!ok) alertMessage("Error", message);
            else {
              offices.value = offices.value.filter((of) => of.id !== office.id);
            }
          },
        },
      ],
    });
    return alert.present();
  };

  const presentOptions = async (office: any) => {
    const actionSheet = await actionSheetController.create({
      header: "Opciones",
      buttons: [
        {
          text: "Editar",
          icon: create,
          handler: () => {
            router.push({ name: "office", params: { id: office.id } });
          },
        },
        {
          text: "Eliminar",
          role: "destructive",
          icon: trash,
          handler: () => {
            onConfirmDelete(office);

          },
        },
        {
          text: "Cerrar",
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

  //getOffices();

  return {
    currentPage: computed(() => currentPage.value),
    lastPage: computed(() => lastPage.value),
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => isLoading.value),
    offices: computed(() => offices.value),
    errors: computed(() => errors.value),
    nextPage: () => getOffices(currentPage.value + 1),
    prevPage: () => getOffices(currentPage.value - 1),
    presentOptions,
    getOffice,
    getOffices,
    createOffice,
    updateOffice,
    activateAppointmentRequestsToday,
    activateTeleconsultationsToday
  };
};

export default useOffices;
