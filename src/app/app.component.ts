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
  constructor(mapDirectionsService: MapDirectionsService, httpClient: HttpClient) {
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

  public tracarRota(retorno:JSON){
    const request: google.maps.DirectionsRequest = {
      destination: {lat: -30.981847, lng: -54.921744},
      origin: {lat: -28.194889, lng: -55.639278},
      waypoints:[
        {location:{lat: -28.194889, lng: -55.639278}, stopover: false},
        {location:{lat: -28.680582, lng: -55.9780875}, stopover: false},
        {location:{lat: -29.1482364, lng: -56.0640154}, stopover: false},
        {location:{lat: -29.5938305, lng: -55.4811322}, stopover: false},
        {location:{lat: -29.7848016, lng: -55.775657}, stopover: false},
        {location:{lat: -30.244349, lng: -54.921744}, stopover: false}
      ],
      travelMode: google.maps.TravelMode.DRIVING,
    };
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSubmit(){
    this.calcOk = true;
    console.log(this.formulario);
  }
}
export interface MapDirectionsResponse {
  status: google.maps.DirectionsStatus;
  result?: google.maps.DirectionsResult;
}
