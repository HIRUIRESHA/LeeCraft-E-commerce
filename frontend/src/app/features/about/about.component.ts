import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SiteContentStore } from '../../core/services/site-content.store';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="wrap section page-narrow">
      <div class="eyebrow">About Us</div>
      <h1 class="serif">{{ content.aboutHeading() || 'Naturally Crafted' }}</h1>
      @for (paragraph of aboutParagraphs(); track paragraph) {
        <p>{{ paragraph }}</p>
      }
    </section>
  `,
    styles: [`
    .page-narrow{max-width:760px;}
    h1.serif{font-size:32px;font-weight:500;margin:10px 0 20px;}
    p{font-size:15px;line-height:1.85;color:var(--wood-700);}
  `],
})
export class AboutComponent implements OnInit {
  readonly content = inject(SiteContentStore);

  ngOnInit(): void {
    this.content.load();
  }

  aboutParagraphs(): string[] {
    const body = this.content.aboutBody();
    if (!body) {
      return [
        'LeeCraft.lk began with a simple idea: kitchen tools should last a lifetime, not a season. Every board starts as reclaimed and responsibly sourced timber from across Sri Lanka — teak, mahogany, rosewood — before it passes through the hands of local artisans who shape, sand and oil each piece by hand.',
        'No two boards are identical. We finish everything with food-safe oils, so what arrives at your door is ready for a lifetime in your kitchen.',
      ];
    }
    return body.split(/\n+/).filter((p) => p.trim().length > 0);
  }
}
