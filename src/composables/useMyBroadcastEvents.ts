import { ref } from "vue";
import Echo from 'laravel-echo';
import useMyStorage from "./useMyStorage";
import authApi from '@/services/authApi';

const laravelEcho = ref<any>(null);
const currentChannel = ref<any>(null);

export function useMyBroadcastEvents() {
    const { getItem } = useMyStorage();


    async function login(auth: any) {

        const token = await getItem("access_token");

        if (token && auth.global?.config.pusher_app_key && auth.global?.config.pusher_app_cluster) {

            laravelEcho.value = new Echo({
                broadcaster: 'pusher',
                key: auth.global?.config.pusher_app_key,
                cluster: auth.global?.config.pusher_app_cluster,
                authEndpoint: `${authApi.defaults.baseURL}/broadcasting/auth`,
                bearerToken: token
            });


        }

        if (laravelEcho.value) {
            subscribeChannel(`App.User.${auth.user.id}`);
        }


    }

    function subscribeChannel(channel: string) {
        //console.log('subscribeChannel', channel);
        currentChannel.value = laravelEcho.value?.private(channel);

    }


    async function logout() {

        console.log('disconnect');

        return laravelEcho.value = null;


    }


    return {
        login,
        logout,
        currentChannel

    }
}