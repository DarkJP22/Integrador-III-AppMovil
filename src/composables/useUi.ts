import { alertController, loadingController, toastController } from "@ionic/vue";
//import { useRouter } from "vue-router";
const useUi = () => {
  //const router = useRouter();
    let isLoading = false;

    const toastMessage = async (message: string, color = 'primary', duration = 3000) => {
        const toast = await toastController
          .create({
            message: message,
            color: color,
            duration: duration,
          })
        return toast.present();
      };
      const alertMessage = async (header: string, message: string, buttonText = 'OK', callback: any = null, allowClose: boolean | string = false) => {
        const buttons = [];
       
        if(allowClose){
            buttons.push({
                text: allowClose === true ? 'Cerrar' : allowClose,
                role: 'cancel'
            })
        }

        if(buttonText != ''){
          buttons.push({
              cssClass: 'secondary',
              text: buttonText,
              role: 'confirm',
              handler: callback,
          })
      }
          const alert = await alertController
            .create({
              header,
              message,
              buttons,
            });
  
            alert.present();

         return await alert.onDidDismiss();
  
        };
  
        const loadingMessage = async (message?: string) => {
          isLoading = true;
  
          return await loadingController
            .create({
             
              message: message || 'Espere por favor...',
      
            }).then( a => {
                a.present().then( () => {
                    if (!isLoading){
                        a.dismiss().then( () => console.log('Abort present loader'))
                    }
                })
            });
    
          
        };
  
        const dismissLoading = async() => {
            isLoading = false;
            return await loadingController.dismiss().then( () => console.log('dismissed') )
        }
  
  
      
  
      return {
  
          // functions
          toastMessage,
          alertMessage,
          loadingMessage,
          dismissLoading
  
        
      }

}


export default useUi