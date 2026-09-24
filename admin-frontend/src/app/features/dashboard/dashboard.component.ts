import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';

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

      <!-- ================================================= -->
      <!-- LOADING -->
      <!-- ================================================= -->

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


      <!-- ================================================= -->
      <!-- ERROR -->
      <!-- ================================================= -->

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


      <!-- ================================================= -->
      <!-- DASHBOARD -->
      <!-- ================================================= -->

      @if (dashboard && !loading) {

        <section>


          <!-- ================================================= -->
          <!-- STATISTICS -->
          <!-- ================================================= -->

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


          <!-- ================================================= -->
          <!-- ANALYTICS -->
          <!-- ================================================= -->

          @if (analytics) {


            <!-- ================================================= -->
            <!-- REVENUE CHART -->
            <!-- ================================================= -->

            <div
              class="card"
              style="
                padding:24px;
                margin-bottom:24px;
                border-radius:12px;
              "
            >

              <!-- HEADER -->

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  align-items:flex-start;
                  gap:20px;
                  margin-bottom:20px;
                "
              >

                <div>

                  <h3
                    style="
                      margin:0;
                      font-size:16px;
                      font-weight:600;
                      color:var(--wood-900);
                    "
                  >
                    Sales & Revenue
                  </h3>

                  <p
                    style="
                      margin:5px 0 0;
                      font-size:12.5px;
                      color:var(--wood-700);
                    "
                  >
                    Revenue performance over the last 30 days
                  </p>

                </div>


                <!-- PERIOD -->

                <span
                  style="
                    flex-shrink:0;
                    font-size:11px;
                    padding:5px 10px;
                    border:1px solid var(--line);
                    border-radius:20px;
                    color:var(--wood-700);
                    background:#faf8f5;
                    white-space:nowrap;
                  "
                >
                  Last 30 days
                </span>

              </div>


              <!-- REVENUE DATA -->

              @if (analytics.revenue.length === 0) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                    margin:20px 0 0;
                  "
                >
                  No revenue data available.
                </p>

              } @else {

                <div
                  style="
                    position:relative;
                    height:350px;
                    width:100%;
                  "
                >

                  <canvas #revenueChart></canvas>

                </div>

              }

            </div>


            <!-- ================================================= -->
            <!-- TOP-SELLING PRODUCTS -->
            <!-- ================================================= -->

            <div
              class="card"
              style="
                padding:24px;
                margin-bottom:24px;
                border-radius:12px;
                max-width:700px;
              "
            >

              <!-- HEADER -->

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  align-items:flex-start;
                  gap:20px;
                  margin-bottom:16px;
                "
              >

                <div>

                  <h3
                    style="
                      margin:0;
                      font-size:16px;
                      font-weight:600;
                      color:var(--wood-900);
                    "
                  >
                    Top-Selling Products
                  </h3>

                  <p
                    style="
                      margin:5px 0 0;
                      font-size:12.5px;
                      color:var(--wood-700);
                    "
                  >
                    Products ranked by units sold
                  </p>

                </div>


                <!-- TOP 10 -->

                <span
                  style="
                    flex-shrink:0;
                    font-size:11px;
                    padding:5px 10px;
                    border:1px solid var(--line);
                    border-radius:20px;
                    color:var(--wood-700);
                    background:#faf8f5;
                    white-space:nowrap;
                  "
                >
                  Top 10
                </span>

              </div>


              <!-- PRODUCT DATA -->

              @if (
                analytics.topSellingProducts.length === 0
              ) {

                <p
                  style="
                    font-size:13.5px;
                    color:var(--wood-700);
                    margin:20px 0 0;
                  "
                >
                  No product sales data available.
                </p>

              } @else {

                <div
                  style="
                    position:relative;
                    height:300px;
                    width:100%;
                  "
                >

                  <canvas #productChart></canvas>

                </div>

              }

            </div>

          }


          <!-- ================================================= -->
          <!-- EXISTING DASHBOARD CONTENT -->
          <!-- ================================================= -->

          <div
            class="grid"
            style="
              grid-template-columns:1fr 1fr;
              gap:24px;
            "
          >


            <!-- ================================================= -->
            <!-- BEST SELLING BOARDS -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- TOP CHATBOT QUESTIONS -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- LOW STOCK -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- OUT OF STOCK -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- RECENT ORDERS -->
            <!-- ================================================= -->

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
export class DashboardComponent
  implements OnInit, OnDestroy {

  private readonly dashboardService =
    inject(DashboardService);

  private readonly changeDetectorRef =
    inject(ChangeDetectorRef);


  // =====================================================
  // CANVAS REFERENCES
  // =====================================================

  @ViewChild('revenueChart')
  revenueCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('productChart')
  productCanvas?: ElementRef<HTMLCanvasElement>;


  // =====================================================
  // DATA
  // =====================================================

  dashboard: DashboardData | null = null;

  analytics: AnalyticsData | null = null;

  loading = true;

  errorMessage = '';


  // =====================================================
  // CHART INSTANCES
  // =====================================================

  revenueChart: Chart | null = null;

  productChart: Chart | null = null;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadDashboard();
  }


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {

    this.destroyCharts();

    this.loading = true;

    this.errorMessage = '';

    this.dashboardService
      .getDashboard()
      .subscribe({

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


  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  loadAnalytics(): void {

    this.dashboardService
      .getAnalytics()
      .subscribe({

        next: (data: AnalyticsData) => {

          console.log(
            'Analytics data:',
            data
          );

          this.analytics = data;

          this.loading = false;

          this.changeDetectorRef.detectChanges();

          this.createCharts();

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


  // =====================================================
  // CREATE CHARTS
  // =====================================================

  createCharts(): void {

    if (!this.analytics) {
      return;
    }

    this.destroyCharts();

    if (
      this.analytics.revenue.length > 0
    ) {

      this.createRevenueChart();

    }

    if (
      this.analytics.topSellingProducts.length > 0
    ) {

      this.createProductChart();

    }

  }


  // =====================================================
  // REVENUE CHART
  // =====================================================

  createRevenueChart(): void {

    if (
      !this.revenueCanvas ||
      !this.analytics
    ) {

      console.warn(
        'Revenue canvas not available'
      );

      return;
    }

    const canvas =
      this.revenueCanvas.nativeElement;

    const revenue =
      this.analytics.revenue;

    this.revenueChart =
      new Chart(canvas, {

        type: 'line',

        data: {

          labels: revenue.map(item => {

            const date =
              new Date(item.period);

            return date.toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short'
              }
            );

          }),

          datasets: [

            {

              label: 'Revenue',

              data: revenue.map(
                item => item.revenue
              ),

              tension: 0.4,

              fill: true,

              borderWidth: 2.5,

              borderColor:
                '#8b5e3c',

              backgroundColor:
                'rgba(139, 94, 60, 0.10)',

              pointRadius: 3,

              pointHoverRadius: 6,

              pointBackgroundColor:
                '#8b5e3c',

              pointBorderColor:
                '#ffffff',

              pointBorderWidth: 2

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          interaction: {

            mode: 'index',

            intersect: false

          },

          plugins: {

            legend: {

              display: false

            },

            tooltip: {

              backgroundColor:
                '#2f241d',

              titleColor:
                '#ffffff',

              bodyColor:
                '#ffffff',

              padding: 12,

              cornerRadius: 8,

              displayColors: false,

              callbacks: {

                label: (context) => {

                  const value =
                    Number(
                      context.raw ?? 0
                    );

                  return `Revenue: Rs. ${
                    value.toLocaleString(
                      'en-LK'
                    )
                  }`;

                }

              }

            }

          },

          scales: {

            x: {

              border: {

                display: false

              },

              grid: {

                display: false

              },

              ticks: {

                color:
                  '#806f63',

                maxRotation: 0,

                autoSkip: true,

                maxTicksLimit: 8,

                font: {

                  size: 11

                }

              }

            },

            y: {

              beginAtZero: true,

              border: {

                display: false

              },

              grid: {

                color:
                  'rgba(90, 70, 50, 0.08)'

              },

              ticks: {

                color:
                  '#806f63',

                padding: 8,

                font: {

                  size: 11

                },

                callback: (value) => {

                  const number =
                    Number(value);

                  if (
                    number >= 1000000
                  ) {

                    return `Rs. ${
                      (
                        number / 1000000
                      ).toFixed(1)
                    }M`;

                  }

                  if (
                    number >= 1000
                  ) {

                    return `Rs. ${
                      (
                        number / 1000
                      ).toFixed(0)
                    }K`;

                  }

                  return `Rs. ${number}`;

                }

              }

            }

          }

        }

      });

  }


  // =====================================================
  // TOP-SELLING PRODUCT CHART
  // =====================================================

  createProductChart(): void {

    if (
      !this.productCanvas ||
      !this.analytics
    ) {

      console.warn(
        'Product canvas not available'
      );

      return;
    }

    const canvas =
      this.productCanvas.nativeElement;

    const products =
      this.analytics.topSellingProducts;

    this.productChart =
      new Chart(canvas, {

        type: 'bar',

        data: {

          labels: products.map(
            item => item.productName
          ),

          datasets: [

            {

              label: 'Units Sold',

              data: products.map(
                item => item.quantity
              ),

              backgroundColor:
                '#8b5e3c',

              borderRadius: 6,

              borderSkipped: false,

              barThickness: 18,

              maxBarThickness: 20

            }

          ]

        },

        options: {

          indexAxis: 'y',

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {

              display: false

            },

            tooltip: {

              backgroundColor:
                '#2f241d',

              titleColor:
                '#ffffff',

              bodyColor:
                '#ffffff',

              padding: 12,

              cornerRadius: 8,

              displayColors: false,

              callbacks: {

                label: (context) => {

                  const value =
                    Number(
                      context.raw ?? 0
                    );

                  return `Units sold: ${value}`;

                }

              }

            }

          },

          scales: {

            x: {

              beginAtZero: true,

              border: {

                display: false

              },

              grid: {

                color:
                  'rgba(90, 70, 50, 0.08)'

              },

              ticks: {

                color:
                  '#806f63',

                padding: 8,

                precision: 0,

                font: {

                  size: 11

                }

              }

            },

            y: {

              border: {

                display: false

              },

              grid: {

                display: false

              },

              ticks: {

                color:
                  '#4f4036',

                padding: 8,

                font: {

                  size: 12

                }

              }

            }

          }

        }

      });

  }


  // =====================================================
  // DESTROY CHARTS
  // =====================================================

  private destroyCharts(): void {

    if (this.revenueChart) {

      this.revenueChart.destroy();

      this.revenueChart = null;

    }

    if (this.productChart) {

      this.productChart.destroy();

      this.productChart = null;

    }

  }


  // =====================================================
  // DESTROY COMPONENT
  // =====================================================

  ngOnDestroy(): void {

    this.destroyCharts();

  }

}