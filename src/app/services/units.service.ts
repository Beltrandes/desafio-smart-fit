import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first } from 'rxjs';
import { UnitsResponse } from '../types/units-response.interface';
import { UnitLocation } from '../types/unit-location.interface';

const opening_hours = {
  morning: {
    first: '06',
    last: '12'
  },
  afternoon: {
    first: '12',
    last: '18'
  },
  night: {
    first: '18',
    last: '23'
  }
}

type hour_indexes = 'morning' | 'afternoon' | 'night'

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  readonly apiUrl = "https://test-frontend-developer.s3.amazonaws.com/data/locations.json"

  private allUnitsSubject: BehaviorSubject<UnitLocation[]> = new BehaviorSubject<UnitLocation[]>([])
  private allUnits$: Observable<UnitLocation[]> = this.allUnitsSubject.asObservable()
  private filteredUnits$: UnitLocation[] = []

  constructor(private http: HttpClient) {
    this.http.get<UnitsResponse>(this.apiUrl).subscribe(units => {
      this.allUnitsSubject.next(units.locations)
      this.filteredUnits$ = units.locations
    })
  }

  getAllUnits(): Observable<UnitLocation[]> {
    return this.allUnits$
  }

  getFilteredUnits() {
    return this.filteredUnits$
  }

  setFilteredUnits(value: UnitLocation[]) {
    this.filteredUnits$ = value
  }

  transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.'
      case 6:
        return 'Sab.'
      default:
        return 'Seg. à Sex.'
    }
  }

  filterUnits(open_hour: string, close_hour: string, unit: UnitLocation) {
    if (!unit.schedules) return true
    let open_hour_filter = parseInt(open_hour, 10)
    let close_hour_filter = parseInt(close_hour, 10)

    let todays_weekday = this.transformWeekday(new Date().getDay())


    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hour = unit.schedules[i].hour
      let schedule_weekday = unit.schedules[i].weekdays

      if (todays_weekday === schedule_weekday) {
        if (schedule_hour !== 'Fechada') {
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ')
          let unit_open_hour_int = parseInt(unit_open_hour.replace('h', ''), 10)
          let unit_close_hour_int = parseInt(unit_close_hour.replace('h', ''), 10)

          if (unit_open_hour_int <= open_hour_filter && unit_close_hour_int >= close_hour_filter) return true
          else return false
        }
      }
    }

    return false
  }

  filter(unitsResults: UnitLocation[], showClosed: boolean, hour: string) {
    let intermediateUnitsResults$ = unitsResults


    if (!showClosed) {
      intermediateUnitsResults$ = unitsResults.filter(location => location.opened === true)
    }
    if (hour) {
      const open_hour = opening_hours[hour as hour_indexes].first
      const close_hour = opening_hours[hour as hour_indexes].last
      return unitsResults.filter(location => this.filterUnits(open_hour, close_hour, location))
    } else {
      return intermediateUnitsResults$
    }
  }
}
