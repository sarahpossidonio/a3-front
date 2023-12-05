import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSliderModule} from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IMaskModule} from 'angular-imask';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Observable, catchError, map, of, startWith} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import { MapDirectionsService, GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GrafoService } from './grafo.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatCardModule, FlexLayoutModule,
    MatSliderModule, MatToolbarModule, FormsModule, IMaskModule,
    ReactiveFormsModule, MatAutocompleteModule,
  MatIconModule, MatButtonModule, GoogleMapsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  calcOk = false;
  duracao = "";
  combustivel = "";
  paradas = "";
  totalKm = "";
  alimentacao = "";
  caminho = "";
  way:any = []

  formulario:FormGroup = new FormGroup({
    saida: new FormControl(''),
    destino: new FormControl(''),
    veiculo: new FormControl(''),
    valCombustivel: new FormControl(''),
    qtdParadas: new FormControl (0),
    qtdPessoas: new FormControl (1),
    valAlimentacao: new FormControl ('')
  })
  optionsMap: google.maps.MapOptions = {
    center: {lat:-28.194889, lng: -55.639278},
    zoom: 7
  };

  directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;
  mapDirectionsService: MapDirectionsService
  grafoServ: GrafoService
  constructor(
    mapDirectionsService: MapDirectionsService,
    httpClient: HttpClient,
    grafoServ: GrafoService) {

    this.grafoServ = grafoServ;
    this.mapDirectionsService = mapDirectionsService;
  }

  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;
  options: string[] = ["Alegrete","Barra do Quaraí","Garruchos",
  "Itaqui","Maçambará","Manoel Viana","Quaraí","São Borja",
  "São Francisco de Assis","Uruguaiana","Rosário do Sul",
  "Santa Margarida do Sul","Sant'Ana do Livramento","São Gabriel",
  "Aceguá","Bagé","Dom Pedrito","Hulha Negra","Lavras do Sul"];
  title = 'a3-front';

  valorCombustivel: string = "";

  mask = {
    mask: Number,  // enable number mask

    // other options are optional with defaults below
    scale: 2,  // digits after point, 0 for integers
    thousandsSeparator: '.',  // any single char
    padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
    normalizeZeros: false,  // appends or removes zeros at ends
    radix: ',',  // fractional delimiter
    mapToRadix: ['.'],  // symbols to process as radix

    // additional number interval options (e.g.)
    min: 0,
    max: 100000
  }

  ngOnInit(): void {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );


  }

  public tracarRota(caminhos:Array<Caminhos>){
    let origem: any;
    let destino: any;
    this.way=[]
    this.caminho="";

    caminhos.forEach((element:Caminhos) => {
      if(caminhos.lastIndexOf(element)==caminhos.length-1){
        destino = new google.maps.LatLng(element.latitude,element.longitude);
        this.caminho += element.nome;
      }else if(caminhos.indexOf(element)==0){
        origem = new google.maps.LatLng(element.latitude,element.longitude);
        this.caminho += element.nome+" -> ";
      } else{
        let obj = {location:{lat: element.latitude, lng: element.longitude}, stopover: true};
        this.way.push(obj)
        this.caminho += element.nome+" -> ";
      }
    });
    let request: google.maps.DirectionsRequest = {
      destination: destino,
      origin: origem,
      waypoints:this.way,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    destino=null;
    origem=null;
    this.way=null
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSubmit(){
    this.calcOk = true;
    console.log(this.formulario);
    this.efetuaCalculo();
    // this.grafoServ.ola().subscribe(
    //   success =>{
    //     console.log(success)
    //   }
    // )
  }


  efetuaCalculo(){
    this.grafoServ.calcular(this.formulario).subscribe(
      success=>{
        this.duracao = success.tempo
        this.combustivel = "R$ "+success.combustivel.toLocaleString('pt-br', {style: 'decimal', minimumIntegerDigits: 1});
        this.paradas = success.paradas.toLocaleString('pt-br', {style: 'decimal', minimumIntegerDigits: 1});
        this.totalKm = success.distancia.toLocaleString('pt-br', {style: 'decimal', minimumIntegerDigits: 1})+" Km";
        this.alimentacao = "R$ "+success.alimentacao.toLocaleString('pt-br', {style: 'decimal', minimumIntegerDigits: 1});

        console.log(success.listaCaminho)

        this.tracarRota(success.listaCaminho)


        console.log(success)
      }
    );
  }
}
export interface MapDirectionsResponse {
  status: google.maps.DirectionsStatus;
  result?: google.maps.DirectionsResult;
}

export interface Caminhos{
  nome:string;
  latitude: number;
  longitude: number;
}
