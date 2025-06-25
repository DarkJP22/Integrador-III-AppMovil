
import useAuth from "@/modules/auth/composables/useAuth";
const { auth } = useAuth();

const isPatientGuard = async( to: any, from: any, next: any ) => {
    if ( auth.value.isMedic) next({ name: 'medic-home' })
    else if ( auth.value.isPatient || to.meta.requiresAuth === false ) next()
    else next({ name: 'login' })
}

export default isPatientGuard