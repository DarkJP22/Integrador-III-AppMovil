import isMedicGuard from "@/modules/auth/router/medic-guard";
import isAuthenticatedGuard from "@/modules/auth/router/auth-guard";
import isPendingPaymentGuard from "@/modules/auth/router/pending-payment-guard";
export default [
    {
        path: '/medic',
        redirect: '/medic/home',
    },
    {
        path: '/medic/home',
        name: 'medic-home',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/HomePage.vue'),

    },
    {
        path: '/medic/appointment-requests',
        name: 'medic-appointment-requests',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AppointmentRequestsPage.vue'),
    },
    {
        path: '/medic/appointment-requests/:id',
        name: 'medic-appointment-request',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AppointmentRequestPage.vue'),
    },
    {
        path: '/medic/teleconsultations/:id',
        name: 'medic-teleconsultation',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/TeleconsultationPage.vue'),
    },
    {
        path: '/medic/appointment-requests/:id/agendar/:medicId/:officeId',
        name: 'medic-appointment-request-agendar',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AppointmentRequestAgendarPage.vue'),
    },
    {
        path: '/medic/appointments',
        name: 'medic-appointments',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AppointmentsPage.vue'),
    },
    {
        path: '/medic/appointments/:id',
        name: 'medic-appointment',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AppointmentPage.vue'),
    },
    {
        path: '/medic/patients',
        name: 'medic-patients',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/PatientsPage.vue'),
    },
    {
        path: '/medic/patients/:id',
        name: 'medic-patient',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/PatientPage.vue'),
    },
    {
        path: '/medic/patients/:id/appointments',
        name: 'medic-patient-appointments',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/PatientAppointmentsPage.vue'),
    },
    {
        path: '/medic/lab-results',
        name: 'medic-lab-results',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/LabresultsPage.vue'),
    },
    {
        path: '/medic/patients/:id/lab-results',
        name: 'medic-patient-lab-results',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/PatientLabresultsPage.vue'),
    },
    {
        path: '/medic/patients/:patientId/lab-results/:id',
        name: 'medic-patient-lab-result',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/LabresultPage.vue'),
    },
    {
        path: '/medic/commissions',
        name: 'medic-commissions',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/CommissionsPage.vue'),
    },
    {
        path: '/medic/commission-transactions',
        name: 'medic-commission-transactions',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/CommissionTransactionsPage.vue'),
    },
    {
        path: '/medic/offices',
        name: 'offices',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/OfficesPage.vue'),
    },
    {
        path: '/medic/offices/:id',
        name: 'office',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/OfficePage.vue'),
    },
    {
        path: '/medic/account',
        name: 'medic-account',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AccountPage.vue'),
    },
    {
        path: '/medic/profile',
        name: 'medic-profile',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/ProfilePage.vue'),
    },
    {
        path: '/medic/agenda',
        name: 'medic-agenda',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard, isPendingPaymentGuard ],
        component: () => import('@/modules/medic/views/AgendaPage.vue'),
    },
    {
        path: '/medic/subscription/invoices',
        name: 'medic-subscription-invoices',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard ],
        component: () => import('@/modules/medic/views/SubscriptionInvoicesPage.vue'),
    },
    {
        path: '/medic/subscription/invoices/:id',
        name: 'medic-subscription-invoice-details',
        beforeEnter: [ isAuthenticatedGuard, isMedicGuard ],
        component: () => import('@/modules/medic/views/SubscriptionInvoiceDetailsPage.vue'),
    },
   
]