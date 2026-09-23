import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from './dashboard.model';
import { AnalyticsData } from './analytics.model';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],

  template: `
    <main class="wrap section">

      <!-- PAGE HEADER -->
      <div class="eyebrow">
        Admin
      </div>

      <h1
        class="serif"
        style="
          font-size:30px;
          font-weight:500;
          margin:10px 0 16px;
        "
      >
        Store Dashboard
      </h1>


      <!-- LOADING -->
      @if (loading) {

        <div
          class="card"
          style="
            padding:30px;
            text-align:center;
            margin-bottom:30px;
          "
        >
          Loading dashboard...
        </div>

      }


      <!-- ERROR -->
      @if (errorMessage) {

        <div
          class="card"
          style="
            padding:20px;
            margin-bottom:30px;
            color:#9b2c2c;
          "
        >
          {{ errorMessage }}

          <button
            type="button"
            (click)="loadDashboard()"
            style="
              margin-left:15px;
              padding:7px 14px;
              border:1px solid var(--line);
              background:white;
              cursor:pointer;
            "
          >
            Retry
          </button>
        </div>

      }


      @if (dashboard && !loading) {

        <section>

          <!-- ========================================= -->
          <!-- STATISTICS CARDS                         -->
          <!-- ========================================= -->

          <div
            class="grid admin-grid"
            style="margin-bottom:40px;"
          >

            <!-- TOTAL SALES -->
            <div class="card stat-card">

              <div class="num">
                Rs.
                {{ dashboard.totalSales | number:'1.0-0' }}
              </div>

              <div class="lbl">
                Total Sales (30d)
              </div>

            </div>


            <!-- PRODUCTS -->
            <div class="card stat-card">

              <div class="num">
                {{ dashboard.productCount }}
              </div>

              <div class="lbl">
                Products
              </div>

            </div>


            <!-- ORDERS -->
            <div class="card stat-card">

              <div class="num">
                {{ dashboard.orderCount }}
              </div>

              <div class="lbl">
                Orders
              </div>

            </div>


            <!-- ABANDONED CARTS -->
            <div class="card stat-card">

              <div class="num">
                {{ dashboard.abandonedCartCount }}
              </div>

              <div class="lbl">
                Abandoned Carts
              </div>

            </div>

          </div>


          <!-- ========================================= -->
          <!-- SALES & REVENUE ANALYTICS                -->
          <!-- ========================================= -->

          @if (analytics) {

            <div
              class="card"
              style="
                padding:22px;
                margin-bottom:24px;
              "
            >

              <h3
                style="
                  margin-top:0;
                  font-size:15px;
                "
              >
                Sales & Revenue Analytics
              </h3>

              <p
                style="
                  font-size:13px;
                  color:var(--wood-700);
                  margin-bottom:20px;
                "
              >
                Revenue and order volume
              </p>

              <div
                style="
                  position:relative;
                  height:350px;
                  width:100%;
                "
              >
                <canvas id="revenueChart"></canvas>
              </div>

            </div>


            <!-- TOP SELLING PRODUCTS + CATEGORIES -->

            <div
              class="grid"
              style="
                grid-template-columns:1fr 1fr;
                gap:24px;
                margin-bottom:24px;
              "
            >

              <!-- TOP PRODUCTS -->

              <div
                class="card"
                style="padding:22px;"
              >

                <h3
                  style="
                    margin-top:0;
                    font-size:15px;
                  "
                >
                  Top-Selling Products
                </h3>

                <div
                  style="
                    position:relative;
                    height:300px;
                  "
                >
                  <canvas id="productChart"></canvas>
                </div>

              </div>


              <!-- TOP CATEGORIES -->

              <div
                class="card"
                style="padding:22px;"
              >

                <h3
                  style="
                    margin-top:0;
                    font-size:15px;
                  "
                >
                  Top-Selling Categories
                </h3>

                <div
                  style="
                    position:relative;
                    height:300px;
                  "
                >
                  <canvas id="categoryChart"></canvas>
                </div>

              </div>

            </div>

          }


          <!-- ========================================= -->
          <!-- DASHBOARD CONTENT                         -->
          <!-- ========================================= -->

          <div
            class="grid"
            style="
              grid-template-columns:1fr 1fr;
              gap:24px;
            "
          >


            <!-- BEST SELLING PRODUCTS -->

            <div
              class="card"
              style="padding:22px;"
            >

              <h3
                style="
                  margin-top:0;
                  font-size:15px;
                "
              >
                Best-Selling Boards
              </h3>

              @if (
                dashboard.bestSellingProducts.length === 0
              ) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                  "
                >
                  No sales data available.
                </p>

              } @else {

                @for (
                  product of dashboard.bestSellingProducts;
                  track product.id
                ) {

                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      font-size:13.5px;
                      padding:10px 0;
                      border-bottom:1px solid var(--line);
                    "
                  >

                    <span>
                      {{ product.name }}
                    </span>

                    <span
                      style="
                        color:var(--wood-400);
                      "
                    >
                      {{ product.soldQuantity }} sold
                    </span>

                  </div>

                }

              }

            </div>


            <!-- TOP CHATBOT QUESTIONS -->

            <div
              class="card"
              style="padding:22px;"
            >

              <h3
                style="
                  margin-top:0;
                  font-size:15px;
                "
              >
                Top Chatbot Questions
              </h3>

              @if (
                dashboard.topChatbotQuestions.length === 0
              ) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                  "
                >
                  No chatbot questions available.
                </p>

              } @else {

                @for (
                  question of dashboard.topChatbotQuestions;
                  track question
                ) {

                  <div
                    style="
                      font-size:13.5px;
                      padding:10px 0;
                      border-bottom:1px solid var(--line);
                      color:var(--wood-700);
                    "
                  >
                    "{{ question }}"
                  </div>

                }

              }

            </div>


            <!-- LOW STOCK PRODUCTS -->

            <div
              class="card"
              style="padding:22px;"
            >

              <h3
                style="
                  margin-top:0;
                  font-size:15px;
                "
              >
                Low Stock Products
              </h3>

              @if (
                dashboard.lowStockProducts.length === 0
              ) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                  "
                >
                  No low-stock products.
                </p>

              } @else {

                @for (
                  product of dashboard.lowStockProducts;
                  track product.id
                ) {

                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      font-size:13.5px;
                      padding:10px 0;
                      border-bottom:1px solid var(--line);
                    "
                  >

                    <span>
                      {{ product.name }}
                    </span>

                    <span
                      style="
                        color:var(--wood-400);
                      "
                    >
                      {{ product.stock }} left
                    </span>

                  </div>

                }

              }

            </div>


            <!-- OUT OF STOCK PRODUCTS -->

            <div
              class="card"
              style="padding:22px;"
            >

              <h3
                style="
                  margin-top:0;
                  font-size:15px;
                "
              >
                Out of Stock Products
              </h3>

              @if (
                dashboard.outOfStockProducts.length === 0
              ) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                  "
                >
                  No out-of-stock products.
                </p>

              } @else {

                @for (
                  product of dashboard.outOfStockProducts;
                  track product.id
                ) {

                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      font-size:13.5px;
                      padding:10px 0;
                      border-bottom:1px solid var(--line);
                    "
                  >

                    <span>
                      {{ product.name }}
                    </span>

                    <span
                      style="
                        color:#9b2c2c;
                      "
                    >
                      Out of stock
                    </span>

                  </div>

                }

              }

            </div>


            <!-- RECENT ORDERS -->

            <div
              class="card"
              style="padding:22px;"
            >

              <h3
                style="
                  margin-top:0;
                  font-size:15px;
                "
              >
                Recent Orders
              </h3>

              @if (
                dashboard.recentOrders.length === 0
              ) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                  "
                >
                  No recent orders.
                </p>

              } @else {

                @for (
                  order of dashboard.recentOrders;
                  track order.id
                ) {

                  <div
                    style="
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      gap:15px;
                      font-size:13.5px;
                      padding:10px 0;
                      border-bottom:1px solid var(--line);
                    "
                  >

                    <div>

                      <div>
                        #{{ order.id }}
                        {{ order.customerName }}
                      </div>

                      <small
                        style="
                          color:var(--wood-400);
                        "
                      >
                        {{ order.status }}
                      </small>

                    </div>

                    <span>
                      Rs.
                      {{ order.total | number:'1.0-0' }}
                    </span>

                  </div>

                }

              }

            </div>

          </div>

        </section>

      }

    </main>
  `
})
export class DashboardComponent implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  dashboard: DashboardData | null = null;

  analytics: AnalyticsData | null = null;

  loading = true;

  errorMessage = '';

  revenueChart: Chart | null = null;

  productChart: Chart | null = null;

  categoryChart: Chart | null = null;


  ngOnInit(): void {
    this.loadDashboard();
  }


  loadDashboard(): void {

    this.loading = true;

    this.errorMessage = '';


    this.dashboardService.getDashboard().subscribe({

      next: (data: DashboardData) => {

        this.dashboard = data;

        this.loadAnalytics();

      },

      error: (error) => {

        console.error(
          'Failed to load dashboard:',
          error
        );

        this.errorMessage =
          'Unable to load dashboard data. Please make sure the backend is running.';

        this.loading = false;

      }

    });

  }


  loadAnalytics(): void {

    this.dashboardService.getAnalytics().subscribe({

      next: (data: AnalyticsData) => {

        console.log('Analytics data:', data);

        this.analytics = data;

        this.loading = false;

        setTimeout(() => {
          this.createCharts();
        });

      },

      error: (error) => {

        console.error(
          'Failed to load analytics:',
          error
        );

        this.errorMessage =
          'Dashboard loaded, but analytics could not be loaded.';

        this.loading = false;

      }

    });

  }


  createCharts(): void {

    if (!this.analytics) {
      return;
    }

    this.createRevenueChart();

    this.createProductChart();

    this.createCategoryChart();

  }


  createRevenueChart(): void {

    const canvas =
      document.getElementById(
        'revenueChart'
      ) as HTMLCanvasElement | null;

    if (!canvas || !this.analytics) {
      return;
    }


    if (this.revenueChart) {
      this.revenueChart.destroy();
    }


    this.revenueChart = new Chart(canvas, {

      type: 'line',

      data: {

        labels: this.analytics.revenue.map(
          item => item.period
        ),

        datasets: [

          {
            label: 'Revenue',

            data: this.analytics.revenue.map(
              item => item.revenue
            ),

            tension: 0.3,

            fill: false
          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: true
          },

          tooltip: {
            enabled: true
          }

        },

        scales: {

          y: {
            beginAtZero: true
          }

        }

      }

    });

  }


  createProductChart(): void {

    const canvas =
      document.getElementById(
        'productChart'
      ) as HTMLCanvasElement | null;

    if (!canvas || !this.analytics) {
      return;
    }


    if (this.productChart) {
      this.productChart.destroy();
    }


    this.productChart = new Chart(canvas, {

      type: 'bar',

      data: {

        labels: this.analytics.topSellingProducts.map(
          item => item.productName
        ),

        datasets: [

          {
            label: 'Units Sold',

            data: this.analytics.topSellingProducts.map(
              item => item.quantity
            )

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: true
          }

        },

        scales: {

          y: {
            beginAtZero: true
          }

        }

      }

    });

  }


  createCategoryChart(): void {

    const canvas =
      document.getElementById(
        'categoryChart'
      ) as HTMLCanvasElement | null;

    if (!canvas || !this.analytics) {
      return;
    }


    if (this.categoryChart) {
      this.categoryChart.destroy();
    }


    this.categoryChart = new Chart(canvas, {

      type: 'bar',

      data: {

        labels: this.analytics.topSellingCategories.map(
          item => item.categoryName
        ),

        datasets: [

          {
            label: 'Units Sold',

            data: this.analytics.topSellingCategories.map(
              item => item.quantity
            )

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: true
          }

        },

        scales: {

          y: {
            beginAtZero: true
          }

        }

      }

    });

  }

}