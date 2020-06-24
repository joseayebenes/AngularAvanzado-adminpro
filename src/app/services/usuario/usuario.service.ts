import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { SurbirArchivoService } from '../subir-archivo/surbir-archivo.service';



@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SurbirArchivoService
    ) {
    this.cargarStorage();
  }

  isLogged(){
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return resp.usuario;
      })
    );
  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token: token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  creaUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        //swal('Usuario creado', 'Usuario creado satisfactoramiente', 'success');
        return resp.usuario;
      })
    );
  }

  actualizarUsuario(usuario: Usuario){
    let url = URL_SERVICIOS + '/usuario/'+usuario._id;
    url += '?token='+this.token;
    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        if(usuario._id === this.usuario._id){
          this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
        }
        
        //swal('Usuario actualizado', 'Usuario actualizado satisfactoramiente', 'success');
        return true;
      })
    );
  }

  cambiarImagen(file: File, id: string){
      this._subirArchivoService
        .subirArchivo(file, 'usuarios', id)
        .then((resp:any) => {
          this.usuario.img = resp.usuario.img;
            this.guardarStorage(
              id,
              this.token,
              this.usuario
            );

        })
        .catch((resp) => {console.log(resp);});
  }


  cargarUsuarios(desde: number = 0){
    let url = URL_SERVICIOS+'/usuario?desde='+desde;

    return this.http.get(url);
  }

  buscarUsuarios(termino:string){
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url);
  }

  borrarUsuario(id:string){
    let url = URL_SERVICIOS + '/usuario/' + id+"?token="+this.token;
    return this.http.delete(url);
  }


}
