import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { CrearProductoDTO, GetProductoDTO, Producto } from '../models/product.model';
import { CrearClienteDTO, GetClienteDTO, NuevoClienteDTO } from '../models/cliente.model';
import { catchError, throwError } from 'rxjs';
import { CrearFacturaDTO, GetFacturaDTO } from '../models/factura.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  TraerProductos() {
    return this.http.get<GetProductoDTO>(`${this.baseUrl}/productos`);
  }

  crearProducto(producto: CrearProductoDTO) {
    const nuevoProducto = this.http.post<GetProductoDTO>(`${this.baseUrl}/productos`, producto)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.InternalServerError) {
          return throwError( () => new Error('Algo esta fallando en el servidor'));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError( () => new Error('El cliente no existe'));
        }
        if (error.status === HttpStatusCode.Forbidden) {
          return throwError( () => new Error('Campo de identificacion Vacio'));
        }
        return throwError( () => new Error('Ups algo salio mal'));
      })
    );

    return nuevoProducto
  }

  traerCLientePorCedula(cedula: string) {
    const cliente = this.http.get<GetClienteDTO>(`${this.baseUrl}/clientes?cedula=${cedula}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError( () => new Error('Algo esta fallando en el servidor'));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError( () => new Error('El cliente no existe'));
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError( () => new Error('No estas permitido'));
        }
        if (error.status === HttpStatusCode.Forbidden) {
          return throwError( () => new Error('Campo de identificacion Vacio'));
        }
        return throwError( () => new Error('Ups algo salio mal'));
      })
    );

    return cliente
  }

  crearCliente(cliente: CrearClienteDTO) {
    const nuevoCliente = this.http.post<NuevoClienteDTO>(`${this.baseUrl}/clientes`, cliente)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.InternalServerError) {
          return throwError( () => new Error('Algo esta fallando en el servidor'));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError( () => new Error('El cliente no existe'));
        }
        if (error.status === HttpStatusCode.Forbidden) {
          return throwError( () => new Error('Campo/s de cliente invalido/s'));
        }
        return throwError( () => new Error('Ups algo salio mal'));
      })
    );

    return nuevoCliente
  }

  crearFactura(clienteId: number, productos: Producto[]) {
    const objFactura: CrearFacturaDTO = {
      clienteId,
      productos: [],
      cantidad: []
    };
    for(let producto of productos) {
      objFactura['productos'].push(producto.id);
      objFactura['cantidad'].push(producto.cantidad);
    }
    const nuevaFactura = this.http.post<GetFacturaDTO>(`${this.baseUrl}/facturas`, objFactura)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.InternalServerError) {
          return throwError( () => new Error('Algo esta fallando en el servidor'));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError( () => new Error('Uno o mas productos no existen'));
        }
        if (error.status === HttpStatusCode.Forbidden) {
          return throwError( () => new Error('Campo/s de factura invalido/s'));
        }
        return throwError( () => new Error('Ups algo salio mal'));
      })
    );

    return nuevaFactura
  }

  async imprimirFactura(id: number) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.baseUrl}/facturas/${id}/imprimir`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.InternalServerError) {
            return throwError( () => new Error('Algo esta fallando en el servidor'));
          }
          if (error.status === HttpStatusCode.NotFound) {
            return throwError( () => new Error('Uno o mas productos no existen'));
          }
          if (error.status === HttpStatusCode.Forbidden) {
            return throwError( () => new Error('Campo/s de factura invalido/s'));
          }
          return throwError( () => new Error('Ups algo salio mal'));
        })
      )
      .subscribe(
        (data) => resolve(data),
        (error) => reject(error)
      );

    })
  }

}
