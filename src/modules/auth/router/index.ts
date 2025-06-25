import useAuth from '../composables/useAuth';

const { auth, checkAuthentication } = useAuth();

export default [
    {
        path: '/auth',
        redirect: '/auth/login',
    },
    {
        path: '/penging-payment',
        name: 'pendingPayment',
        component: () => import('@/views/PendingPaymentPage.vue'),
        beforeEnter: async (to: any, from: any, next: any) => {
            const { ok } = await checkAuthentication()

            if (auth.value.disabled_by_payment) next();
            else if (ok && auth.value.isMedic) next({ name: 'medic-home' })
            else if (ok && auth.value.isPatient) next({ name: 'patient-home' })


        },

    },
    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/modules/auth/views/LoginPage.vue'),
        beforeEnter: async (to: any, from: any, next: any) => {
            const { ok } = await checkAuthentication()

            if (ok && auth.value.isMedic) next({ name: 'medic-home' })
            else if (ok && auth.value.isPatient) next({ name: 'patient-home' })
            else next()

        },

    },
    {
        path: '/auth/register',
        name: 'register',
        component: () => import('@/modules/auth/views/RegisterPage.vue'),
        beforeEnter: async (to: any, from: any, next: any) => {
            const { ok } = await checkAuthentication()

            if (ok && auth.value.isMedic) next({ name: 'medic-home' })
            else if (ok && auth.value.isPatient) next({ name: 'patient-home' })
            else next()

        },
        props: { ide: null }
    },
    // {
    //     path: '/auth/register-medic/:code',
    //     name: 'registerMedic',
    //     component: () => import('@/modules/auth/views/RegisterMedicPage.vue'),
    //     beforeEnter: async (to: any, from: any, next: any) => {
    //         const { ok } = await checkAuthentication()

    //         if (ok && auth.value.isMedic) next({ name: 'medic-home' })
    //         else if (ok && auth.value.isPatient) next({ name: 'patient-home' })
    //         else next()

    //     }
    // },
    {
        path: '/auth/register-medic',
        name: 'registerMedic',
        component: () => import('@/modules/auth/views/RegisterMedicPage.vue'),
        beforeEnter: async (to: any, from: any, next: any) => {
            const { ok } = await checkAuthentication()

            if (ok && auth.value.isMedic) next({ name: 'medic-home' })
            else if (ok && auth.value.isPatient) next({ name: 'patient-home' })
            else next()

        }
    },
    {
        path: "/auth/forgot-password",
        name: "forgot-password",
        component: () => import("@/modules/auth/views/PasswordResetPage.vue"),
        beforeEnter: async (to: any, from: any, next: any) => {
            const { ok } = await checkAuthentication()

            if (ok && auth.value.isMedic) next({ name: 'medic-home' })
            else if (ok && auth.value.isPatient) next({ name: 'patient-home' })
            else next()

        }

    },
    {
        path: "/auth/new-password/:ide",
        name: "new-password",
        component: () => import("@/modules/auth/views/NewPasswordPage.vue"),
        beforeEnter: async (to: any, from: any, next: any) => {
            const { ok } = await checkAuthentication()

            if (ok && auth.value.isMedic) next({ name: 'medic-home' })
            else if (ok && auth.value.isPatient) next({ name: 'patient-home' })
            else next()

        }

    },

]