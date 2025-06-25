import axios from "axios";
import { computed, ref } from "vue";
import useMyStorage from "@/composables/useMyStorage";
import authApi from "@/services/authApi";
import gpsApi from "@/services/gpsApi";
import { useMyBroadcastEvents } from "@/composables/useMyBroadcastEvents";


const auth = ref<{
  status: string;
  user: any;
  settings: any;
  access_token: string | null;
  isPatient: boolean;
  isMedic: boolean;
  currentRole: any;
  accumulatedId: any;
  global: any;
  url_intended: string;
  disabled_by_payment: boolean;
}>({
  status: "authenticating", // 'authenticated','not-authenticated', 'authenticating'
  user: null,
  settings: null,
  access_token: null,
  isPatient: false,
  isMedic: false,
  currentRole: null,
  accumulatedId: null,
  global: null,
  url_intended: "",
  disabled_by_payment: false
});
const useAuth = () => {
  const errors = ref<any>([]);
  const isLoading = ref(false);
  const { setItem, getItem, removeItem } = useMyStorage();
  const { login: broadcastLogin } = useMyBroadcastEvents();
  const setUrlIntended = (url: string) => {
    auth.value.url_intended = url;
  }
  const setAuth = async (data: any) => {
    const { access_token, user, accumulated, user_settings } = data;

    if (access_token) {
      await setItem("access_token", access_token);
      auth.value.access_token = access_token;
    }

    auth.value.user = user;
    auth.value.settings = user_settings;
    auth.value.accumulatedId = accumulated?.id ?? null;
    auth.value.status = "authenticated";
    auth.value.isMedic = user.roles.find(
      (role: { id: number; name: string }) => role.name == "medico"
    )
      ? true
      : false;
    auth.value.isPatient = user.roles.find(
      (role: { id: number; name: string }) => role.name == "paciente"
    )
      ? true
      : false;
    auth.value.currentRole = user.roles.find(
      (role: { id: number; name: string }) => role.id == user.current_role_id
    );

    auth.value.disabled_by_payment = user.disabled_by_payment;


  };

  const registerUpdateUser = async (form: any, type = 'user') => {
    const push_token = await getItem("oneSignalId");
    const {
      id,
      tipo_identificacion,
      ide,
      name,
      email,
      password,
      password_confirmation,
      phone_number,
      phone_country_code,
      medic_code,
      authorization_code,
      accumulated_affiliation,
      speciality
    } = form;
    const dataToSave = {
      tipo_identificacion,
      ide,
      name,
      email,
      password,
      password_confirmation,
      phone_number,
      phone_country_code,
      push_token,
      medic_code,
      authorization_code,
      accumulated_affiliation,
      speciality
    };

    try {
      errors.value = [];

      const { data } = await authApi.post(`/${type}/${id}/register`, dataToSave);

      await setAuth(data);

      return { ok: true };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) return { ok: false };
        errors.value = error.response.data.errors; //Object.values(error.response.data.errors).flat();
      }

      return { ok: false };
    }
  };
  const registerUser = async (form: any, type = 'user') => {
    const push_token = await getItem("oneSignalId");
    const {
      type_of_health_professional,
      tipo_identificacion,
      ide,
      name,
      email,
      password,
      password_confirmation,
      phone_number,
      phone_country_code,
      medic_code,
      authorization_code,
      accumulated_affiliation,
      speciality,
      plan_id,
      general_cost_appointment,
      photos
    } = form;
    const dataToSave = {
      type_of_health_professional,
      tipo_identificacion,
      ide,
      name,
      email,
      password,
      password_confirmation,
      phone_number,
      phone_country_code,
      push_token,
      medic_code,
      authorization_code,
      accumulated_affiliation,
      speciality,
      plan_id,
      general_cost_appointment
    };

    try {
      errors.value = [];

      const { data } = await authApi.postForm(`/${type}/register`, {
        ...dataToSave,
        photos: photos?.map((item: any) => item.blobImg) ?? []
      }, {
        timeout: 1000 * 60 * 10,
      });

      if (data.user.active) {
        await setAuth(data);
      }

      return { ok: true };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) return { ok: false };
        errors.value = error.response.data.errors; //Object.values(error.response.data.errors).flat();
      }

      return { ok: false };
    }
  };

  const login = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const push_token = await getItem("oneSignalId");
    try {
      errors.value = [];

      const { data } = await authApi.post("/token", {
        email,
        password,
        push_token,
      });

      await setAuth(data);
      await bootstrap();
      broadcastLogin(auth.value);

      return { ok: true };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) return { ok: false };
        errors.value = error.response.data.errors; //Object.values(error.response.data.errors).flat();
      }

      return { ok: false };
    }
  };

  const logout = async () => {

    auth.value.user = null;
    auth.value.access_token = null;
    auth.value.status = "not-authenticated";
    auth.value.isMedic = false;
    auth.value.isPatient = false;
    auth.value.currentRole = null;
    auth.value.accumulatedId = null;

    await removeItem("access_token");
  };

  const checkAuthentication = async (force = false) => {
    const token = await getItem("access_token");

    if (!token) {
      logout();
      return { ok: false, message: "No hay token" };
    }

    if (auth.value.user && !force) {
      auth.value.access_token = token;
      return { ok: true };
    }

    try {
      const { data } = await gpsApi.get("/user");
      await setAuth(data);
      await bootstrap();
      broadcastLogin(auth.value);

      return { ok: true };
    } catch (error) {
      logout();
      return { ok: false };
    }
  };

  const checkMedicAuthorization = async (code: string) => {

    try {
      await gpsApi.post("/medic/register/authorization", { code });

      return { ok: true, code };

    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const sendResetCode = async (form: any) => {
    try {
      const { ide } = form;

      errors.value = [];
      isLoading.value = true;

      const { data } = await gpsApi.post(`/user/password/ide`, { ide });

      isLoading.value = false;

      return { ok: true, message: data.message };
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const resetPassword = async (form: any) => {
    try {
      const { email, password, password_confirmation, code } = form;

      errors.value = [];
      isLoading.value = true;

      const { data } = await gpsApi.post(`/user/password/reset`, {
        email,
        password,
        password_confirmation,
        code,
      });

      isLoading.value = false;

      setAuth(data);

      return { ok: true };
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const updateOnesignalUserId = async (
    userId: number,
    onesignalUserId: any
  ) => {
    try {
      isLoading.value = true;

      const { data } = await gpsApi.put(`/account/updatepush`, {
        push_token: onesignalUserId,
      });
      auth.value.user = data;

      isLoading.value = false;
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 422) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  };

  const bootstrap = async () => {
    try {
      isLoading.value = true;

      const { data } = await gpsApi.get(`/bootstrap`);
      auth.value.global = data;

      isLoading.value = false;
    } catch (error: any) {
      isLoading.value = false;

      if (error.response.status !== 401) throw error;

      errors.value = error.response.data.errors ?? []; //Object.values(error.response.data.errors).flat();
      return { ok: false, message: error.response.data.message };
    }
  }

  return {
    auth: computed(() => auth.value),
    officesDisableAgenda: computed(() => auth.value.user?.offices_count - auth.value.user?.offices_gps_count),
    enableAgenda: computed(() => auth.value.user?.offices_gps_count),
    enableCommissionLab: computed(() => !!auth.value.user?.commission_affiliation),
    errors: computed(() => errors.value),
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    sendResetCode,
    resetPassword,
    registerUser,
    registerUpdateUser,
    checkAuthentication,
    updateOnesignalUserId,
    checkMedicAuthorization,
    bootstrap,
    setUrlIntended
  };
};

export default useAuth;
