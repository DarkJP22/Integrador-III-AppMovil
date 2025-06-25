
import useAuth from "@/modules/auth/composables/useAuth";
const { checkAuthentication } = useAuth();

const isAuthenticatedGuard = async( to: any, from: any, next: any ) => {

    const { ok } = await checkAuthentication()

    if ( ok || to.meta.requiresAuth === false) next()
    else next({ name: 'login' })
}

export default isAuthenticatedGuard