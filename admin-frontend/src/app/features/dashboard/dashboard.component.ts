import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from './dashboard.model';

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


      <!-- DASHBOARD -->
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
          <!-- DASHBOARD CONTENT                         -->
          <!-- ========================================= -->

          <div
            class="grid"
            style="
              grid-template-columns:1fr 1fr;
              gap:24px;
            "
          >


            <!-- ======================================= -->
            <!-- BEST SELLING PRODUCTS                  -->
            <!-- ======================================= -->

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


            <!-- ======================================= -->
            <!-- TOP CHATBOT QUESTIONS                  -->
            <!-- ======================================= -->

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


            <!-- ======================================= -->
            <!-- LOW STOCK PRODUCTS                     -->
            <!-- ======================================= -->

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


            <!-- ======================================= -->
            <!-- OUT OF STOCK PRODUCTS                  -->
            <!-- ======================================= -->

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


            <!-- ======================================= -->
            <!-- RECENT ORDERS                          -->
            <!-- ======================================= -->

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

  loading = true;

  errorMessage = '';


  ngOnInit(): void {
    this.loadDashboard();
  }


  loadDashboard(): void {

    this.loading = true;

    this.errorMessage = '';


    this.dashboardService.getDashboard().subscribe({

      next: (data: DashboardData) => {

        this.dashboard = data;

        this.loading = false;

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

}