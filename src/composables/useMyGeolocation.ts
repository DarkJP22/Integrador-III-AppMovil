import { Geolocation } from "@capacitor/geolocation";
import { computed, ref } from "vue";
import useUi from "@/composables/useUi";
const { loadingMessage, dismissLoading, alertMessage } = useUi();
const coords = ref<{ lat: number | null; lng: number | null; expiresIn: number;}>({
  lat: null,
  lng: null,
  expiresIn: 0
});
const useMyGeolocation = () => {
  const isLoading = ref(false);

  function showLocation(position:any) {
    coords.value.lat = position.coords.latitude;
    coords.value.lng = position.coords.longitude;
    isLoading.value = false;
    dismissLoading();
 }

 function errorHandler(err:any) {
    if(err.code == 1) {
       alertMessage(
        "Geolocalización",
        "No se pudo obtener la geolocalización: Access is denied!"
      );
    } else if( err.code == 2) {
       alertMessage(
        "Geolocalización",
        "No se pudo obtener la geolocalización: Position is unavailable!"
      );
    }else{
      alertMessage(
        "Geolocalización",
        "No se pudo obtener la geolocalización: Error code " + err.code
      );
    }
    isLoading.value = false;
    dismissLoading();
 }
 const backupGeolocalization = () =>{
    loadingMessage("Reintentando ubicación");
    isLoading.value = true
    const options = {enableHighAccuracy:true, timeout:5000};
    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options );
 }
 const clearUserLocation = () =>{
    coords.value.lat = null;
    coords.value.lng = null;
    coords.value.expiresIn = 0;
 }
 const cacheCoords = (cacheInSeconds?: number) =>{

  if (cacheInSeconds===undefined || cacheInSeconds===null) {
    cacheInSeconds = 0;  // default: seconds for 1 day
  } else {
    cacheInSeconds = Math.abs(cacheInSeconds); //make sure it's positive
  }

  const now = Date.now();  //millisecs since epoch time, lets deal only with integer

  coords.value.expiresIn = now + cacheInSeconds*1000; 

 }
  const getUserLocation = async (cacheInSeconds?: number) => {
    try {

      const now = Date.now();
      if (coords.value.expiresIn > now) {// Expired
        return;
      }

      isLoading.value = true;

      loadingMessage("Buscando ubicación");

      coords.value.lat = null;
      coords.value.lng = null;

      const { coords: geoCoords } = await Geolocation.getCurrentPosition();

      coords.value.lat = geoCoords.latitude;
      coords.value.lng = geoCoords.longitude;

      cacheCoords(cacheInSeconds);
      

      isLoading.value = false
      dismissLoading();
    } catch (error: any) {
      isLoading.value = false
      await dismissLoading();
      backupGeolocalization()
      // alertMessage(
      //   "Geolocalización",
      //   "No se pudo obtener la geolocalización: " + error.message
      // );
    }

 
  };

  return {
    isLoading: computed(() => isLoading.value),
    coords: computed(() => coords.value),
    getUserLocation,
    clearUserLocation,
  };
};

export default useMyGeolocation;
