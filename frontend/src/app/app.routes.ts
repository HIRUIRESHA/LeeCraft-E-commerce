import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { ShopComponent } from './features/shop/shop.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    title: 'LeeCraft.lk — Handcrafted Cutting Boards'
  },

  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us — LeeCraft.lk'
  },

  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact Us — LeeCraft.lk'
  },

  {
    path: 'shop',
    component: ShopComponent,
    title: 'Shop — LeeCraft.lk'
  },

  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent),
    title: 'Product Details — LeeCraft.lk'
  },

  {
    path: 'cart',
    component: CartComponent,
    title: 'Cart — LeeCraft.lk'
  },

  {
    path: 'wishlist',
    component: WishlistComponent,
    title: 'Wishlist — LeeCraft.lk'
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component')
        .then(m => m.CheckoutComponent),
    title: 'Checkout — LeeCraft.lk'
  },

  {
    path: 'order-confirmation/:id',
    loadComponent: () =>
      import('./features/order-confirmation/order-confirmation.component')
        .then(m => m.OrderConfirmationComponent),
    title: 'Order Confirmed — LeeCraft.lk'
  },

  // LOGIN PAGE
  {
    path: 'account/login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent),
    title: 'Login — LeeCraft.lk'
  },

  // REGISTER PAGE
  {
    path: 'account/register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent),
    title: 'Register — LeeCraft.lk'
  },

  // LOGGED-IN ACCOUNT PAGE
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/account/account.component')
        .then(m => m.AccountComponent),
    title: 'My Account — LeeCraft.lk'
  },

];