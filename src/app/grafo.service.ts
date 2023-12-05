import { RequestModel } from './../model/request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { config } from './app.config.server';
import { ResponseModel } from '../model/response.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class GrafoService {

  http: HttpClient
  constructor(http: HttpClient) {
    this.http = http
  }



  calcular(form:FormGroup){

    const dados: RequestModel = {
      saida: form.get("saida")!.value,
      destino: form.get("destino")!.value,
      veiculo: form.get("veiculo")!.value,
      valCombustivel: form.get("valCombustivel")!.value,
      qtdParadas: form.get("qtdParadas")!.value,
      qtdPessoas: form.get("qtdPessoas")!.value,
      valAlimentacao: form.get("valAlimentacao")!.value,
    } as RequestModel;

    return this.http.post<ResponseModel>("http://localhost:8080/api/calcular", dados, httpOptions)
  }


  ola(): Observable<any>{
    return this.http.get("http://localhost:8080/api/teste");
  }
}
