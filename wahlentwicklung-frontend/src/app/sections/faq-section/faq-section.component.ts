import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: []
})
export class FaqSectionComponent {
  faqs = [
    {
      question: 'Wo liegt der unterschied zwischen Erst- und Zweitstimmen',
      answer: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit...',
      open: false
    },
    {
      question: 'Sind die Daten akkurat?',
      answer: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit...',
      open: false
    },
    {
      question: 'Ich habe einen Fehler in den Daten gefunden',
      answer: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit...',
      open: false
    }
  ];

  // @ts-ignore
  toggleFaq(faq) {
    faq.open = !faq.open;
  }
}
