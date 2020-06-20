import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MetadataFactory } from '@angular/compiler/src/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string;
  constructor( private router: Router,
    private title: Title,
    private meta: Meta
    ) {
    
      this.getDataRouter().subscribe((data) => {
        this.titulo = data.titulo;
        this.title.setTitle(this.titulo);

        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.titulo
        }
        meta.addTag(metaTag);
      });
   }

  ngOnInit(): void {
  }


  getDataRouter(){
    return this.router.events
      .pipe(
        filter((evento) => evento instanceof ActivationEnd),
        filter((evento: ActivationEnd) => evento.snapshot.firstChild==null),
        map((evento: ActivationEnd) => evento.snapshot.data  )
      )
  }

}
