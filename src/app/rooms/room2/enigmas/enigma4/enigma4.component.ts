import { Component, signal, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enigma4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enigma4.component.html',
  styleUrl: './enigma4.component.scss',
})
export class Enigma4Component implements OnInit, OnDestroy {
  @Output() solved = new EventEmitter<string>();

  private devSolveListener?: (event: Event) => void;

  puzzleSolved = signal(false);

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
    this.puzzleSolved.set(true);
    setTimeout(() => {
      this.solved.emit('25/10/1881');
    }, 500);
  }
}
