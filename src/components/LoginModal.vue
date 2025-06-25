<script setup lang="ts">
import {
    IonButton,
    IonModal,
    IonItem,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonInput
} from "@ionic/vue";
import { computed, ref } from "vue";
import ShowHidePasswordInput from "./ShowHidePasswordInput.vue";
import useAccounts from "@/modules/auth/composables/useAccounts";
import { useRouter } from "vue-router";
import useAuth from "@/modules/auth/composables/useAuth";
import useUi from "@/composables/useUi";
const router = useRouter();
const { getUserByIde, errors } = useAccounts();
const { login, auth, setUrlIntended } = useAuth();
const { alertMessage, loadingMessage, dismissLoading } = useUi();

const emit = defineEmits(["willDismiss",'cancel', 'update:isOpen']);
const props = defineProps({
    isOpen: Boolean,
})
const isOpenModal = computed({
    get() {
        return props.isOpen
    },
    set(value) {
        emit('update:isOpen', value)
    }
})

const form = ref({
    id: '',
    email: '',
    password: ''
});

const hasAccount = computed(() => {
    return !!form.value.id;
});
function goToRegister() {
    isOpenModal.value = false;
    router.push({ name: 'register', query: { ide: form.value.email } })
}
async function searchUser() {
    if(!form.value.email){
        errors.value.email = 'El campo Cédula es requerido';
        return
    }
    errors.value.email = '';

    const { ok, user } = await getUserByIde(form.value.email);

    if (!ok || !user) {
        alertMessage('Usuario no encontrado', 'Seras redirigido a la pantalla de registro para continuar con el proceso', 'OK', goToRegister, 'Despues');

        return;
    }

    form.value.id = user.id;

}

const onLogin = async () => {
    loadingMessage();

    const resp = await login(form.value);

    dismissLoading();

    if (resp.ok) {
        isOpenModal.value = false;
        resetModal()
        if (auth.value.isMedic) {
          

            if (auth.value.url_intended) {
                router.push(auth.value.url_intended);
                setUrlIntended('');
            } else {
                router.push("/medic/home");
            }

        } else {
            if (auth.value.url_intended) {
                router.push(auth.value.url_intended);
                setUrlIntended('');
            } else {
                router.push("/patient/home");
            }
        }
    } else {
        alertMessage("Error", "Usuario y/o contraseña no son correctos o aun no estas registrado");
    }

};

function resetModal() {
    isOpenModal.value = false;
    form.value = {
        id: '',
        email: '',
        password: ''
    };
}

function onWillDismiss() {
    emit('willDismiss')
    resetModal()
}
function cancel() {
    emit('cancel')
    resetModal()
}


</script>
<template>
    <ion-modal ref="login-modal" :is-open="isOpenModal" @willDismiss="onWillDismiss">
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-button @click="cancel()">Cerrar</ion-button>
                </ion-buttons>
                <ion-title>Autenticación</ion-title>

            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <p>Necesitas iniciar sesión para continuar. Si aun no tienes cuenta puedes crear una</p>
            <form action="#" @submit.prevent="onLogin()">
                <ion-item>
                    <ion-input type="text" placeholder="" label="Escribe tu Cédula" labelPlacement="floating" v-model="form.email" required :class="{ 'ion-invalid ion-touched': errors?.email }" :errorText="errors?.email"></ion-input>
                </ion-item>
                <ion-item v-if="hasAccount">
                    <ShowHidePasswordInput v-model="form.password" label="Contraseña" label-placement="floating" :required="true" />
                </ion-item>
                <div class="ion-padding">
                    <ion-button type="submit" expand="block" shape="round" color="primary" v-if="hasAccount">
                        Iniciar
                    </ion-button>
                    <ion-button type="button" expand="block" shape="round" color="primary" @click="searchUser" v-else>
                        Continuar
                    </ion-button>
                </div>
            </form>
        </ion-content>
    </ion-modal>
</template>
