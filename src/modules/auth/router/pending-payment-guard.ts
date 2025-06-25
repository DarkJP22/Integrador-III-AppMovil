
import useAuth from "@/modules/auth/composables/useAuth";
const { auth } = useAuth();

const isPendingPaymentGuard = async( to: any, from: any, next: any ) => {

   
   if ( !auth.value.disabled_by_payment ) next()
    else next({ name: 'pendingPayment' })
}

export default isPendingPaymentGuard