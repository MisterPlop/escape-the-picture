import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Room1Component } from './rooms/room1/room1.component';
import { Room2Component } from './rooms/room2/room2.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'room1',
    component: Room1Component,
  },
  {
    path: 'room2',
    component: Room2Component,
  },
];
