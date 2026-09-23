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

   // PRODUCT DETAIL PAGE
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent),
    title: 'Product Details — LeeCraft.lk'
  },

  // LIVE ORDER TRACKING
  {
    path: 'track-order',
    loadComponent: () =>
      import('./features/track-order/track-order.component')
        .then(m => m.TrackOrderComponent),
    title: 'Track Order — LeeCraft.lk'
  },

  {
    path: 'cart',
    canActivate: [authGuard],
    component: CartComponent,
    title: 'Cart — LeeCraft.lk'
  },

  {
    path: 'wishlist',
    canActivate: [authGuard],
    component: WishlistComponent,
    title: 'Wishlist — LeeCraft.lk'
  },

  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component')
        .then(m => m.CheckoutComponent),
    title: 'Checkout — LeeCraft.lk'
  },

  {
    path: 'order-confirmation/:id',
    canActivate: [authGuard],
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

  // VERIFY EMAIL PAGE
{
  path: 'account/verify',
  loadComponent: () =>
    import('./features/auth/verify/verify.component')
      .then(m => m.VerifyComponent),
  title: 'Verify Email — LeeCraft.lk'
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

  {
  path: 'account/forgot-password',
  loadComponent: () =>
    import('./features/auth/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent),
  title: 'Forgot Password — LeeCraft.lk'
},

{
  path: 'account/reset-password',
  loadComponent: () =>
    import('./features/auth/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent),
  title: 'Reset Password — LeeCraft.lk'
},

];