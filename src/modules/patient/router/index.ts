import isAuthenticatedGuard from "@/modules/auth/router/auth-guard";
import isPatientGuard from "@/modules/auth/router/patient-guard";

export default [
    {
        path: '/patient',
        redirect: '/patient/home',
    },
    {
        path: '/patient/home',
        name: 'patient-home',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/HomePage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/expedient',
        name: 'expedient',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/ExpedientPage.vue'),
    },
    {
        path: '/patient/expedient/:id/signs',
        name: 'sings',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/SignsPage.vue'),
    },
    {
        path: '/patient/expedient/:id/signs/pressure',
        name: 'pressure',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/PressurePage.vue'),
    },
    {
        path: '/patient/expedient/:id/signs/glicemia',
        name: 'glicemia',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/GlicemiaPage.vue'),
    },
    {
        path: '/patient/expedient/:id/medicines',
        name: 'medicines',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/MedicinesPage.vue'),
    },
    {
        path: '/patient/expedient/:id/allergies',
        name: 'allergies',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AllergiesPage.vue'),
    },
    {
        path: '/patient/expedient/:id/compras',
        name: 'compras',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/ComprasPage.vue'),
    },
    {
        path: '/patient/expedient/:id/lab-results',
        name: 'labresults',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabresultsPage.vue'),
    },
    {
        path: '/patient/expedient/:patientId/lab-results/:id',
        name: 'patient-lab-result',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabresultPage.vue'),
    },
    {
        path: '/patient/appointments',
        name: 'appointments',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AppointmentsPage.vue'),
    },
    {
        path: '/patient/appointments/:id',
        name: 'appointment',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AppointmentPage.vue'),
    },
    {
        path: '/patient/medic-authorizations',
        name: 'medicAuthorizations',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/MedicAuthorizationsPage.vue'),
    },
    {
        path: '/patient/patients',
        name: 'patients',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/PatientsPage.vue'),
    },
    {
        path: '/patient/patients/:id',
        name: 'patient',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/PatientPage.vue'),
    },
    {
        path: '/patient/account',
        name: 'patient-account',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AccountPage.vue'),
    },
    {
        path: '/patient/search',
        name: 'search',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/SearchTypePage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/search-medics',
        name: 'search-medics',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/SearchMedicsPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/medics/:id',
        name: 'medic-details',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/MedicDetailsPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/medics/:id/profile',
        name: 'patient-medic-profile',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/MedicProfilePage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/medics/:medicId/offices/:officeId/book-appointment',
        name: 'book-appointment',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/BookAppointmentPage.vue'),
    },
    {
        path: '/patient/medics/:medicId/offices/:officeId/book-appointment-request',
        name: 'book-appointment-request',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/BookAppointmentRequestPage.vue'),
    },
    {
        path: '/patient/medics/:medicId/offices/:officeId/book-teleconsultation',
        name: 'book-teleconsultation',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/BookTeleconsultationPage.vue'),
    },
    {
        path: '/patient/balances',
        name: 'balances',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/BalancesPage.vue'),
    },
    {
        path: '/patient/invoices',
        name: 'invoices',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/InvoicesPage.vue'),
    },
    {
        path: '/patient/invoices/:id',
        name: 'invoice',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/InvoicePage.vue'),
    },
    {
        path: '/patient/lab',
        name: 'lab',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id/search-exams',
        name: 'lab-search-exams',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/SearchExamsPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id/search-exams-packages',
        name: 'lab-search-exams-packages',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/SearchExamsPackagesPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id/cart',
        name: 'lab-cart',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/CartPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id/quote',
        name: 'lab-quote',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabQuotePage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id/visit',
        name: 'lab-visit',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabVisitPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id/visit/request',
        name: 'lab-visit-request',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabVisitRequestPage.vue'),
      
    },
    {
        path: '/patient/search-labs',
        name: 'search-labs',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/SearchLaboratoriesPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/lab/:id',
        name: 'lab-details',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/LabPage.vue'),
        meta: { requiresAuth: false }
    },
    //This route is for the affiliate patient
    {
        path: '/patient/affiliation',
        name: 'affiliation',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AffiliationPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/affiliation/terms',
        name: 'affiliation-terms',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AffiliationTermsConditions.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/patient/affiliation/search',
        name: 'affiliation-search',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AffiliationSearchPage.vue'),
        meta: { requiresAuth: false }
    },
    
    {
        path: '/patient/affiliation/register',
        name: 'affiliation-register',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/AffiliationRegister.Page.vue'),
        meta: { requiresAuth: false }
    }
    },{
        path: '/patient/branches',
        name: 'branches',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/BranchesPage.vue'),
        meta: { requiresAuth: false}
    },{
        path: '/patient/drugs/:pharmacyId',
        name: 'drugs-pharmacy',
        beforeEnter: [ isAuthenticatedGuard, isPatientGuard ],
        component: () => import('@/modules/patient/views/DrugsPage.vue'),
        meta: { requiresAuth: false }
    }
   

]