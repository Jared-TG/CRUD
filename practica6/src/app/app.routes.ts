import { Routes } from '@angular/router';
import { authGuard,  guesthGuard } from './guard/auth.guard';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/layout/layout').then(m => m.Layout),
        children: [
            {
                path : 'home',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/home/home').then( m => m.Home )
            },
            {
                path : 'alumnos',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/alumnos/alumnos').then(m => m.Alumnos)
            },
            {
                path : 'maestros',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/maestros/maestros').then(m => m.Maestros)
            },
            {
                path : 'calificaciones',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/calificaciones/calificaciones').then(m => m.Calificaciones)
            },
            {
                path : 'usuarios',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.Usuarios)
            },
            {
                path : '',
                pathMatch: 'full',
                redirectTo: 'login'
            },
        ]
    },
    {
        path : 'login',
        canActivate: [guesthGuard],
        loadComponent: () => import('./pages/login/login').then( m => m.Login )
    },
    {
        path : '**',
        redirectTo: 'login'
    }
]

// export const routes: Routes = [

    // {
    //     path : '',
    //     pathMatch: 'full',
    //     redirectTo: 'login'
    // },
//     {
//         path : 'login',
//         canActivate: [guesthGuard],
//         loadComponent: () => import('./pages/login/login').then( m => m.Login )
//     },
//     {
//         path : 'home',
//         canActivate: [authGuard],
//         loadComponent: () => import('./pages/home/home').then( m => m.Home )
//     },
//     {
//         path : 'layout',
//         canActivate: [authGuard],
//         loadComponent: () => import('./pages/layout/layout').then((m) => m.Layout)
//     },
//     {
//         path : '**',
//         redirectTo: 'login'
//     }
// ];
