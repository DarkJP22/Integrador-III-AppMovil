import { provinces } from "@/services/provinces";
import { computed, ref } from "vue";

const useProvinces = () => {

    const provincias = ref<any[]>([]);
    const cantones = ref<any[]>([]);
    const distritos = ref<any[]>([]);

    const loadProvinces = () => {
        provincias.value = [];
        provincias.value = [...provinces]
    };

    const loadCantones = (provinceId: string, key = 'id') => {
       
        cantones.value = [];
        cantones.value = provinces.filter((provincia:any) => provincia[key] == provinceId)[0]?.cantones ?? []

    };
    const loadDistricts = (cantonId: string, key = 'id') => {
       
        distritos.value = [];
        distritos.value = cantones.value.filter((canton:any) => canton[key] == cantonId)[0]?.distritos ?? []

    };

    const getProvinceName = (provinceId:string) => {
      
        return provincias.value.find(provincia => provincia.id == provinceId)?.title

    };
    const getCantonName = (provinceId:string, cantonId: string) => {
        loadCantones(provinceId);
   

        return cantones.value.find(canton => canton.id == cantonId)?.title

    };

    const getDistrictName = (provinceId:string, cantonId: string, districtId: string) => {
        loadCantones(provinceId);
        loadDistricts(cantonId);

        return distritos.value.find(district => district.id == districtId)?.title

    };

    loadProvinces();

    return {
        provincias: computed(() => provincias.value),
        cantones: computed(() => cantones.value),
        distritos: computed(() => distritos.value),
        loadProvinces,
        loadCantones,
        loadDistricts,
        getDistrictName,
        getCantonName,
        getProvinceName
    }
}

export default useProvinces
