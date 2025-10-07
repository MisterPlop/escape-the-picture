import { Component, signal, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enigma1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enigma1.component.html',
  styleUrl: './enigma1.component.scss',
})
export class Enigma1Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<void>();

  private devSolveListener?: (event: Event) => void;

  mouseX = signal(0);
  mouseY = signal(0);
  revealed = signal(false);
  showHint = signal(false);

  imagePosition = {
    top: Math.random() * 300 + 50, // Entre 50px et 350px
    left: Math.random() * 300 + 50,
  };

  private revealRadius = 10; // Rayon de révélation

  ngOnInit(): void {
    this.devSolveListener = () => this.devSolve();
    window.addEventListener('dev-solve-enigma', this.devSolveListener);
  }

  ngOnDestroy(): void {
    if (this.devSolveListener) {
      window.removeEventListener('dev-solve-enigma', this.devSolveListener);
    }
  }

  devSolve(): void {
    this.revealed.set(true);
    setTimeout(() => {
      this.solved.emit();
    }, 500);
  }

  onMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.mouseX.set(mouseX);
    this.mouseY.set(mouseY);
  }

  getImageCenterX(): number {
    return this.imagePosition.left + 100; // Centre de l'image 200px de large
  }

  getImageCenterY(): number {
    return this.imagePosition.top + 100; // Centre de l'image 200px de haut
  }

  // Coordonnées de la souris relatives à l'image N&B
  getRelativeMouseX(): number {
    return this.mouseX() - this.imagePosition.left;
  }

  getRelativeMouseY(): number {
    return this.mouseY() - this.imagePosition.top;
  }

  getRevealRadius(): number {
    return this.revealRadius;
  }

  onImageClick(event: MouseEvent): void {
    if (this.revealed()) return;

    // Le clic est directement sur l'image N&B, donc c'est toujours valide
    this.revealed.set(true);
    setTimeout(() => {
      this.solved.emit();
    }, 5000);
  }

  toggleHint(): void {
    this.showHint.set(!this.showHint());
  }
}
