
import useAuth from "@/modules/auth/composables/useAuth";
const { auth } = useAuth();

const isMedicGuard = async (to: any, from: any, next: any) => {

    if (auth.value.isMedic) next()
    else next({ name: 'login' })
}

export default isMedicGuard