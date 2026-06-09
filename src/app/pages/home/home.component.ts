import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeroSectionComponent } from './sections/hero-section.component';
import { ProblemSectionComponent } from './sections/problem-section.component';
import { SolutionSectionComponent } from './sections/solution-section.component';
import { ExamplesSectionComponent } from './sections/examples-section.component';
import { FeaturesSectionComponent } from './sections/features-section.component';
import { TestimonialsSectionComponent } from './sections/testimonials-section.component';
import { PricingSectionComponent } from './sections/pricing-section.component';
import { ContactSectionComponent } from './sections/contact-section.component';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    FooterComponent,
    HeroSectionComponent,
    ProblemSectionComponent,
    SolutionSectionComponent,
    ExamplesSectionComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent,
    PricingSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-navbar />
    <main>
      <app-hero-section />
      <app-problem-section />
      <app-solution-section />
      <app-examples-section />
      <app-features-section />
      <app-testimonials-section />
      <app-pricing-section />
      <app-contact-section />
    </main>
    <app-footer />
  `,
})
export class HomeComponent {}
