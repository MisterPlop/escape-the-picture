import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-story-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-intro.component.html',
  styleUrl: './story-intro.component.scss',
})
export class StoryIntroComponent {
  @Input() text: string = '';
}
