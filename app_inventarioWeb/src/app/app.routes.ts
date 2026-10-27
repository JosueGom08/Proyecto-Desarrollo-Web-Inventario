import { Routes } from '@angular/router';
import { Login } from './domains/page/login/login';
import { NotFound } from './domains/page/not-found/not-found';
import { Register } from './domains/page/register/register';
import { Home } from './domains/page/home/home';
import { Element } from './domains/page/element/element';
import { InsertElement } from './domains/page/insert-element/insert-element';
import { History } from './domains/page/history/history';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'insert-element',
    component: InsertElement,
  },
  {
    path: 'element/:id',
    component: Element,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'history',
    component: History,
  },
  {
    path: '**',
    component: NotFound,
  },
];
