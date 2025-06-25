
import { Preferences  } from '@capacitor/preferences';

const useMyStorage = () => {

    const setItem = async (key: string, value: any) => {
        await Preferences.set({
          key,
          value
        });
      };
      
      const getItem = async (key: string) => {
        const { value } = await Preferences.get({ key });
      
        return value;
      };
      
      const removeItem = async (key: string) => {
        await Preferences.remove({ key });
      };

   
    return {
        setItem,
        getItem,
        removeItem
    }

}


export default useMyStorage