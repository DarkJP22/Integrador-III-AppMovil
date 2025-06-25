import { ref, computed } from 'vue';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { isPlatform } from '@ionic/core';
const versionApp = ref('');

const useAppUpdater = () => {
  const checkForUpdate = async () => {
    if (!isPlatform("hybrid")) {
        console.log("Solo en dispositivo movil");
        versionApp.value = '2.3.0 (PWA)';
        return;
    }

    const info = await App.getInfo();
    const { version } = info;
    
    versionApp.value = version;

    const deviceInfo = await Device.getInfo();        

    const appUpdateInfo = await AppUpdate.getAppUpdateInfo();

    if (appUpdateInfo.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
        return;
    }
    
 

    if (deviceInfo.platform == 'android') {
        if (appUpdateInfo.immediateUpdateAllowed) {
            await AppUpdate.performImmediateUpdate();
            return;
        }

        if (appUpdateInfo.flexibleUpdateAllowed) {
            await AppUpdate.startFlexibleUpdate();
            return;
        }
        return;
    }

    if (deviceInfo.platform == 'ios') {
        await AppUpdate.openAppStore();
        return;
    }
   

  };

  return {
    checkForUpdate,
    versionApp: computed(() => versionApp.value),
  };
};

export default useAppUpdater;
