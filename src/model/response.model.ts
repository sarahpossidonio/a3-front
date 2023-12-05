import { Caminhos } from "../app/app.component";

export interface ResponseModel{
    distancia: number;
    combustivel: number;
    alimentacao: number;
    paradas: number;
    tempo: string;
    listaCaminho: Array<Caminhos>
}
