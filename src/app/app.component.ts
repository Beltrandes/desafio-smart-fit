import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { UnitLocation } from './types/unit-location.interface';
import { UnitsService } from './services/units.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showList = new BehaviorSubject(false)
  unitsList: UnitLocation[] = []

  constructor(private unitService: UnitsService) {}

  onSubmit() {
    this.unitsList = this.unitService.getFilteredUnits()
    this.showList.next(true)
  }
}
