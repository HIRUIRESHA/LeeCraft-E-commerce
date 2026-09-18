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
  { path: '**', redirectTo: '' },
];
