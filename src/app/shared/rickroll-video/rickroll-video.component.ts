import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rickroll-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rickroll-container">
      <video width="560" height="315" autoplay controls loop class="rickroll-video">
        <source src="/assets/videos/rickroll.mp4" type="video/mp4" />
        <source src="/assets/videos/rickroll.webm" type="video/webm" />
        Votre navigateur ne supporte pas la balise vidéo.
      </video>
      <div class="rickroll-caption">🎶 Never gonna give you up... 🎶</div>
    </div>
  `,
  styleUrl: './rickroll-video.component.scss',
})
export class RickrollVideoComponent {}
