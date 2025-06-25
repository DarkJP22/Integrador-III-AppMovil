
import mapboxApi from '@/services/mapboxApi';

const useMapboxDirections = () => {
    const URL = 'directions/v5/mapbox/driving'
    const access_token = 'pk.eyJ1IjoiZ3BzbWVkaWNhIiwiYSI6ImNsZzc2anZwMTAzbHEzbWs2Z2FjMTlqYXIifQ.vBCt12rwc2pCMtbTONVfYw'
      
      const getDrivingDistance = async (coords: any) => {

        const { data }  = await mapboxApi.get(`${URL}/${coords[0]},${coords[1]};${coords[2]},${coords[3]}`, {
          params: { access_token }
        })

        let resp = 0;

        if(data.routes[0]){
          resp = Math.round(data.routes[0].distance / 1000);
        }
      
        return resp;
      };
      
    

   
    return {
      getDrivingDistance,
     
    }

}


export default useMapboxDirections