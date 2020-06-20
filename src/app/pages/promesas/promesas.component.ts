import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() {

      this.contar3().then(
        () => console.log('termino'),
        () => console.error('error')
      )
   }

  ngOnInit(): void {
  }

  contar3(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador += 1;
        if (contador === 3) {
          resolve();
          clearInterval(intervalo);
        }
      }, 1000);
    });;
  }

}
