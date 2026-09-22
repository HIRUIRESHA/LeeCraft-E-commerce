import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

    {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
  },
  {
    path: 'categories/new',
    loadComponent: () => import('./features/categories/category-form.component').then((m) => m.CategoryFormComponent),
  },
  {
    path: 'categories/:id/edit',
    loadComponent: () => import('./features/categories/category-form.component').then((m) => m.CategoryFormComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/products/product-form.component').then((m) => m.ProductFormComponent),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./features/products/product-form.component').then((m) => m.ProductFormComponent),
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
    loadComponent: () => import('./features/inventory/inventory.component').then((m) => m.InventoryComponent),
  },
  { path: '**', redirectTo: '' },
];
