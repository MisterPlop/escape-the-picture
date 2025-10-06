import { Routes } from '@angular/router';
import { Room1Component } from './rooms/room1/room1.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/room1',
    pathMatch: 'full',
  },
  {
    path: 'room1',
    component: Room1Component,
  },
  // Room 2 sera ajoutée plus tard
  // {
  //   path: 'room2',
  //   component: Room2Component
  // }
];
