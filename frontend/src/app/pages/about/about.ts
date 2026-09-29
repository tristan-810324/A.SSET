import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  protected readonly features = [
    { icon: '◈', title: 'One source of truth', description: 'Know where equipment is, who has it, and what condition it is in without chasing paper forms.' },
    { icon: '⌁', title: 'Faster maintenance', description: 'Turn broken-device reports into organized tickets, scheduled preventive work, and visible repair histories.' },
    { icon: '✓', title: 'Audit-ready operations', description: 'Use room-level scans and exportable records to make inventory checks clear, quick, and accountable.' },
  ];
}
