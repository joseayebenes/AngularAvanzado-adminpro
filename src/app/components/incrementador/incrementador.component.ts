import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [],
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input()
  leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onChanges(newValue: number) {

    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue < 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(n) {
    if (this.progreso + n >= 100) {
      this.progreso = 100;
      return;
    }
    if (this.progreso + n < 0) {
      this.progreso = 0;
      return;
    }

    this.progreso += n;

    this.cambioValor.emit(this.progreso);

    this.txtProgress.nativeElement.focus();
  }
}
