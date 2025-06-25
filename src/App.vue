<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Doctor Blue</ion-list-header>
            <ion-note>Version {{ versionApp }}</ion-note>

            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }" :disabled="currentUser ? false : true">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label :color="currentUser ? '' : 'medium'">{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="onHelp()" lines="none" :detail="false" class="hydrated">
                <ion-icon slot="start" :ios="helpOutline" :md="helpSharp"></ion-icon>
                <ion-label :color="currentUser ? '' : ''">Soporte</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="onLogout()" lines="none" :detail="false" class="hydrated">
                <ion-icon slot="start" :ios="logOutOutline" :md="logOutSharp"></ion-icon>
                <ion-label>{{ currentUser ? 'Cerrar Sesión' : 'Iniciar Sesión' }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

          </ion-list>
          <ion-note class="username" color="primary">Usuario: {{ currentUser }}</ion-note>
          <ion-note class="username" color="primary">Plan: {{ currentPlan }}</ion-note>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
  <VueQueryDevtools buttonPosition="bottom-left" />
</template>

<script lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  homeOutline,
  homeSharp,
  peopleOutline,
  peopleSharp,
  listOutline,
  listSharp,
  helpOutline,
  helpSharp,
  documentTextOutline,
  documentTextSharp,
  notificationsOutline,
  notificationsSharp,
  personCircleOutline,
  personCircleSharp,
  logOutOutline,
  logOutSharp,
  cashSharp,
  cashOutline,
  lockClosedOutline,
  lockClosedSharp,
  shareSocialOutline,
  shareSocialSharp,

} from "ionicons/icons";
import useAuth from "@/modules/auth/composables/useAuth";
import useAppUpdater from "@/composables/useAppUpdater";
import usePushNotifications from "./composables/usePushNotifications";
import useUtilities from "./composables/useUtilities";
//import { useMyBroadcastEvents } from "./composables/useMyBroadcastEvents";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRouterOutlet,
    IonSplitPane,
    VueQueryDevtools
  },
  setup() {
    const { auth, logout, bootstrap } = useAuth();
    const { versionApp, checkForUpdate } = useAppUpdater();
    const { configIni } = usePushNotifications();
    //const { logout: broadcastLogout } = useMyBroadcastEvents();
    const { supportLink } = useUtilities();
    const selectedIndex = ref(0);

    const pagesPatient = [
      {
        title: "Inicio",
        url: "/patient/home",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
      {
        title: "Mi Expediente",
        url: "/patient/expedient",
        iosIcon: documentTextOutline,
        mdIcon: documentTextSharp,
      },
      {
        title: "Citas",
        url: "/patient/appointments",
        iosIcon: listOutline,
        mdIcon: listSharp,
      },
      {
        title: "Pacientes",
        url: "/patient/patients",
        iosIcon: peopleOutline,
        mdIcon: peopleSharp,
      },
      {
        title: "Autorizaciones Médicos",
        url: "/patient/medic-authorizations",
        iosIcon: lockClosedOutline,
        mdIcon: lockClosedSharp,
      },
      {
        title: "Facturación",
        url: "/patient/invoices",
        iosIcon: cashOutline,
        mdIcon: cashSharp,
      },
      {
        title: "Notificaciones",
        url: "/notifications",
        iosIcon: notificationsOutline,
        mdIcon: notificationsSharp,
      },
      {
        title: "Cuenta",
        url: "/patient/account",
        iosIcon: personCircleOutline,
        mdIcon: personCircleSharp,
      },
    ];

    const pagesMedic = [
      {
        title: "Inicio",
        url: "/medic/home",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
      // {
      //   title: "Citas",
      //   url: enableAgenda.value
      //     ? "/medic/appointments"
      //     : "/medic/appointment-requests",
      //   iosIcon: listOutline,
      //   mdIcon: listSharp,
      // },
      {
        title: "Pacientes",
        url: "/medic/patients",
        iosIcon: peopleOutline,
        mdIcon: peopleSharp,
      },
      {
        title: "Consultorios",
        url: "/medic/offices",
        iosIcon: homeOutline,
        mdIcon: homeSharp,
      },
      {
        title: "Notificaciones",
        url: "/notifications",
        iosIcon: notificationsOutline,
        mdIcon: notificationsSharp,
      },
      {
        title: "Perfil Social",
        url: "/medic/profile",
        iosIcon: shareSocialOutline,
        mdIcon: shareSocialSharp,
      },
      {
        title: "Cuenta",
        url: "/medic/account",
        iosIcon: personCircleOutline,
        mdIcon: personCircleSharp,
      },
      {
        title: "Tu Facturas",
        url: "/medic/subscription/invoices",
        iosIcon: cashOutline,
        mdIcon: cashSharp,
      },
    ];

    const appPages = computed(() => {
      if (auth.value.isMedic) {
        return pagesMedic;
      }
      return pagesPatient;
    });

    const path = window.location.pathname.split("/")[1];
    if (path !== undefined) {
      selectedIndex.value = appPages.value.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }

    function onHelp() {
      window.open(supportLink, '_blank')
    }

    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
      configIni();
      checkForUpdate();
      bootstrap();
    });

    return {
      selectedIndex,
      appPages,
      peopleOutline,
      peopleSharp,
      listOutline,
      listSharp,
      documentTextOutline,
      documentTextSharp,
      notificationsOutline,
      notificationsSharp,
      personCircleOutline,
      personCircleSharp,
      logOutOutline,
      logOutSharp,
      helpOutline,
      helpSharp,
      isSelected: (url: string) => (url === route.path ? "selected" : ""),
      versionApp,
      currentUser: computed(() => auth.value.user?.name),
      currentPlan: computed(() => auth.value.user?.subscription?.plan?.title),
      onHelp,
      onLogout: async() => {
        router.push({ name: "login" });
       // const result = await broadcastLogout(`App.User.${auth.value.user.id}`);
        //console.log(result);
        logout();
      },
    };
  },
});
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;
  /*/ --color: var(--ion-color-medium-shade);*/
}

ion-item.selected {
  --color: var(--ion-color-primary);
}

.username {
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0 !important;
}
</style>
