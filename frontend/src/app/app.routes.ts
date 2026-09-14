import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { ShopComponent } from './features/shop/shop.component';

// Intentionally blank — used for any route that isn't built yet (Shop,
// Account, Cart, etc.) so those pages show nothing instead of Home's
// content. Defined inline here so no extra file is needed.
@Component({
    selector: 'app-blank',
    standalone: true,
    template: ``,
})
class BlankComponent { }

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'LeeCraft.lk — Handcrafted Cutting Boards' },
    { path: 'about', component: AboutComponent, title: 'About Us — LeeCraft.lk' },
    { path: 'contact', component: ContactComponent, title: 'Contact Us — LeeCraft.lk' },

    // ---------------------------------------------------------------------
    // The routes below belong to other team members. Each one currently
    // falls through to the blank placeholder (see wildcard route below) so
    // Shop/Account/Cart/etc. render nothing instead of Home's content. Once
    // a member adds their own component, add a real entry here ABOVE the
    // wildcard, e.g.:
    //
     { path: 'shop', component: ShopComponent },
     // { path: 'shop/:id', component: ProductDetailComponent },
    //   { path: 'cart', component: CartComponent },
    //   { path: 'checkout', component: CheckoutComponent },
    //   { path: 'account', component: AccountComponent },
    //   { path: 'track', component: TrackOrderComponent },
    //   { path: 'faq', component: FaqComponent },
    //   { path: 'shipping', component: ShippingPolicyComponent },
    //   { path: 'returns', component: ReturnsPolicyComponent },
    //   { path: 'privacy', component: PrivacyPolicyComponent },
    //   { path: 'terms', component: TermsComponent },
    //   { path: 'admin', component: AdminComponent },
    // ---------------------------------------------------------------------

    { path: '**', component: BlankComponent },
];