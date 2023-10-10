import { Component, Input, OnInit } from '@angular/core';
import { UnitsService } from 'src/app/services/units.service';
import { UnitLocation } from 'src/app/types/unit-location.interface';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit {
  @Input() unitsList: UnitLocation[] = []

 ngOnInit(): void {
  console.log(this.unitsList)
 }
}
