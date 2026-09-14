import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="wrap section page-narrow">
      <div class="eyebrow">About Us</div>
      <h1 class="serif">Naturally Crafted</h1>
      <p>
        LeeCraft.lk began with a simple idea: kitchen tools should last a lifetime, not a season.
        Every board starts as reclaimed and responsibly sourced timber from across Sri Lanka —
        teak, mahogany, rosewood — before it passes through the hands of local artisans who shape,
        sand and oil each piece by hand.
      </p>
      <p>
        No two boards are identical. We finish everything with food-safe oils, so what arrives at
        your door is ready for a lifetime in your kitchen.
      </p>
    </section>
  `,
    styles: [`
    .page-narrow{max-width:760px;}
    h1.serif{font-size:32px;font-weight:500;margin:10px 0 20px;}
    p{font-size:15px;line-height:1.85;color:var(--wood-700);}
  `],
})
export class AboutComponent { }