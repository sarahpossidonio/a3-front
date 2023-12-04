import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
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
import {Observable, map, startWith} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatCardModule, FlexLayoutModule,
    MatSliderModule, MatToolbarModule, FormsModule, IMaskModule,
    ReactiveFormsModule, MatAutocompleteModule,
  MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  formulario:FormGroup = new FormGroup({
    saida: new FormControl(''),
    destino: new FormControl(''),
    veiculo: new FormControl(''),
    valCombustivel: new FormControl(''),
    qtdParadas: new FormControl (0),
    qtdPessoas: new FormControl (1),
    valAlimentacao: new FormControl ('')
  })

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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSubmit(){
    console.log(this.formulario);
  }
}
