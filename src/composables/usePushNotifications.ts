import { Preferences } from "@capacitor/preferences";
import OneSignal from "onesignal-cordova-plugin";
import useAuth from "@/modules/auth/composables/useAuth";
import { AlertButton, alertController, isPlatform, useIonRouter } from "@ionic/vue";
import useMedicineReminders from "@/modules/patient/composables/useMedicineReminders";
import useNotifications from "./useNotifications";
import NotificationReceivedEvent from "onesignal-cordova-plugin/dist/NotificationReceivedEvent";
import { OpenedEvent } from "onesignal-cordova-plugin/dist/models/NotificationOpened";
import useAppointments from "@/modules/medic/composables/useAppointments";
import useAppointmentRequests from "@/modules/medic/composables/useAppointmentRequests";
import useCommissions from "@/modules/medic/composables/useCommissions";
import useLabresults from "@/modules/medic/composables/useLabresults";
import useLabresultspatient from "@/modules/patient/composables/useLabresults";
//import { NotificationReceivedEvent } from "onesignal-cordova-plugin/types/Notification";
const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID;

const usePushNotifications = () => {
  const { auth, updateOnesignalUserId } = useAuth();
  const { updateStatus } = useMedicineReminders();
  const { addNotification } = useNotifications();
  const { addNotification: addNotificationLabresult } = useLabresults();
  const { addNotification: addNotificationLabresultPatient } = useLabresultspatient();
  const { addNotification: addNotificationCommission } = useCommissions();
  const { addNotification: addNotificationAppointmentRequest } = useAppointmentRequests();
  const { addNotification: addNotificationAppointment } = useAppointments();
  const router = useIonRouter();
  const presentAlertNotification = async (
    title: string,
    message: string,
    type = "normal",
    buttons: AlertButton[] = [],
    allowClose = false,

  ) => {

    if (allowClose) {
      buttons.push({
        text: "Cerrar",
        role: "cancel",
      });
    }
    const alert = await alertController.create({
      cssClass: `alert-notification alert-${type}`,
      header: title,
      message: message,
      buttons: buttons,
      backdropDismiss: allowClose,
    });

    return alert.present();
  };

  const notificacionRecibida = (noti: any) => {

    if (noti) {

      const notification = {
        ...noti,
        id: noti.additionalData?.resource_id ?? noti.notificationId
      }

      const alertType =
        notification.additionalData.type == "emergency"
          ? "danger"
          : "normal";
      let url = "";
      let allowClose = false;
      let buttons: AlertButton[] = [{
        text: "OK",
        role: "confirm",
        handler: () => { },

      }];
      if (notification.additionalData?.url) {
        url = notification.additionalData?.url;
        buttons = [{
          text: "Ver más",
          role: "confirm",
          handler: () => {
            if (url) {
              router.push(url);
            }
          },

        }];
        allowClose = true;
      }

      if (notification.additionalData?.type === "medicineReminder") {

        buttons = [];

        buttons.push({
          text: 'No, gracias',
          role: 'cancel',
          handler: () => {
            updateStatus({ id: notification.additionalData?.resource_id, status: 4 })
          },
        }, {
          text: 'Si lo quiero',
          role: 'confirm',
          handler: () => {
            updateStatus({ id: notification.additionalData?.resource_id, status: 3 })
          },

        });
        allowClose = false;
      }



      if (notification.additionalData?.type == 'labresult') {
        addNotificationLabresult(notification);
        addNotificationLabresultPatient(notification);
      }

      if (notification.additionalData?.type == 'commission') {
        addNotificationCommission(notification);
      }

      if (notification.additionalData?.type == 'appointment') {
        addNotificationAppointment(notification);
      }

      if (notification.additionalData?.type == 'appointment-request') {
        addNotificationAppointmentRequest(notification);
      }

      if (notification.additionalData?.type != 'appointment' &&
        notification.additionalData?.type != 'appointment-request' &&
        notification.additionalData?.type != 'labresult' &&
        notification.additionalData?.type != 'commission') {
        addNotification(notification);
      }


      presentAlertNotification(
        notification.title,
        notification.body,
        alertType,
        buttons,
        allowClose
      );
    }
  };
  const saveOneSignalUserId = async (userId: string) => {
    if (auth.value.user) {
      await updateOnesignalUserId(auth.value.user.id, userId);
    }
  };

  const configIni = () => {
    if (!isPlatform("hybrid")) {
      console.log("Solo en dispositivo movil");
      return;
    }

    OneSignal.setAppId(ONESIGNAL_APP_ID);

    const interval = setInterval(() => {
      OneSignal.getDeviceState(async (stateChanges: any) => {

        if (stateChanges.userId) {
          clearInterval(interval);

          await Preferences.set({
            key: "oneSignalId",
            value: stateChanges.userId,
          });
          await saveOneSignalUserId(stateChanges.userId);
        }
      });
    }, 60000);

    OneSignal.setNotificationWillShowInForegroundHandler(
      async (noti: NotificationReceivedEvent) => {
        // do something when notification is received
        //console.log('NotificationReceivedEvent', JSON.stringify(noti));
        //para no mostrar la notificacion push si ya se mostró en el home de la app
        noti.complete();
        notificacionRecibida(noti.getNotification());

      }
    );

    OneSignal.setNotificationOpenedHandler(async (noti: OpenedEvent) => {
      notificacionRecibida(noti.notification);
    });


    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(function (
      accepted: any
    ) {
      console.log("User accepted notifications: " + accepted);
    });
  };

  return {
    configIni,
  };
};

export default usePushNotifications;
