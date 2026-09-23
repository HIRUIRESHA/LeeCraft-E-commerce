import { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
    title: 'Admin Login — LeeCraft.lk',
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Dashboard — LeeCraft Admin',
  },
  {
    path: 'categories',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    title: 'Categories — LeeCraft Admin',
  },
  {
    path: 'categories/new',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/categories/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
    title: 'New Category — LeeCraft Admin',
  },
  {
    path: 'categories/:id/edit',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/categories/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
    title: 'Edit Category — LeeCraft Admin',
  },
  {
    path: 'products',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/products/products.component').then(
        (m) => m.ProductsComponent
      ),
    title: 'Products — LeeCraft Admin',
  },
  {
    path: 'products/new',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/products/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
    title: 'New Product — LeeCraft Admin',
  },
  {
    path: 'products/:id/edit',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/products/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
    title: 'Edit Product — LeeCraft Admin',
  },
  {
    path: 'promotions',
    loadComponent: () => import('./features/promotions/promotions.component').then((m) => m.PromotionsComponent),
  },
  {
    path: 'promotions/new',
    loadComponent: () => import('./features/promotions/promotion-form.component').then((m) => m.PromotionFormComponent),
  },
  {
    path: 'promotions/:id/edit',
    loadComponent: () => import('./features/promotions/promotion-form.component').then((m) => m.PromotionFormComponent),
  },
  {
    path: 'inventory',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/inventory/inventory.component').then(
        (m) => m.InventoryComponent
      ),
    title: 'Inventory — LeeCraft Admin',
  },
  {
    path: 'customers',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/customers/customers.component').then(
        (m) => m.CustomersComponent
      ),
    title: 'Customers — LeeCraft Admin',
  },
  {
    path: 'inquiries',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/inquiries/inquiries.component').then(
        (m) => m.InquiriesComponent
      ),
    title: 'Inquiries — LeeCraft Admin',
  },
  {
    path: 'banners',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/banners/banners.component').then(
        (m) => m.BannersComponent
      ),
    title: 'Banners — LeeCraft Admin',
  },
  {
    path: 'banners/new',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/banners/banner-form.component').then(
        (m) => m.BannerFormComponent
      ),
    title: 'New Banner — LeeCraft Admin',
  },
  {
    path: 'banners/:id/edit',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/banners/banner-form.component').then(
        (m) => m.BannerFormComponent
      ),
    title: 'Edit Banner — LeeCraft Admin',
  },
  {
    path: 'content',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/content/content.component').then(
        (m) => m.ContentComponent
      ),
    title: 'Site Content — LeeCraft Admin',
  },
  {
    path: 'promotions',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/promotions/promotions.component').then(
        (m) => m.PromotionsComponent
      ),
    title: 'Promotions — LeeCraft Admin',
  },
  {
    path: 'promotions/new',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/promotions/promotion-form.component').then(
        (m) => m.PromotionFormComponent
      ),
    title: 'New Promotion — LeeCraft Admin',
  },
  {
    path: 'promotions/:id/edit',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/promotions/promotion-form.component').then(
        (m) => m.PromotionFormComponent
      ),
    title: 'Edit Promotion — LeeCraft Admin',
  },
  { path: '**', redirectTo: '' },
];
