import { first } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnitsService } from 'src/app/services/units.service';
import { UnitLocation } from 'src/app/types/unit-location.interface';
import { UnitsResponse } from 'src/app/types/units-response.interface';




@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  @Output() submitEvent = new EventEmitter()
  unitsResults$: UnitLocation[] = []
  filteredUnitsResults$: UnitLocation[] = []
  form!: FormGroup



  constructor(private formBuilder: FormBuilder, private unitsService: UnitsService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hour: '',
      showClosed: true
    })
    this.unitsService.getAllUnits().subscribe({
      next: (units) => {
        this.unitsResults$ = units
        this.filteredUnitsResults$ = units
      }
    })
  }

  onSubmit(): void {
    let { showClosed, hour } = this.form.value
    this.filteredUnitsResults$ = this.unitsService.filter(this.unitsResults$, showClosed, hour)
    this.unitsService.setFilteredUnits(this.filteredUnitsResults$)

    this.submitEvent.emit()
  }

  onClean(): void {
    this.form.reset()
  }
}
