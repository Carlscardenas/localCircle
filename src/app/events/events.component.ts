import { Component, OnInit } from '@angular/core';
import {Event } from '../event';
import {EventService} from '../event.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {startWith, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface States {
  letter: string;
  names: string[];
}
export const filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {

  events: Event[];
  stateGroupOptions: Observable<States[]>;
  stateForm: FormGroup = this.formBuilder.group({
    states: '',
  });
  stateGroups: States[] = [{
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  }, {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  }, {
    letter: 'D',
    names: ['Delaware']
  }, {
    letter: 'F',
    names: ['Florida']
  }, {
    letter: 'G',
    names: ['Georgia']
  }, {
    letter: 'H',
    names: ['Hawaii']
  }, {
    letter: 'I',
    names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
  }, {
    letter: 'K',
    names: ['Kansas', 'Kentucky']
  }, {
    letter: 'L',
    names: ['Louisiana']
  }, {
    letter: 'M',
    names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana']
  }, {
    letter: 'N',
    names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota']
  }, {
    letter: 'O',
    names: ['Ohio', 'Oklahoma', 'Oregon']
  }, {
    letter: 'P',
    names: ['Pennsylvania']
  }, {
    letter: 'R',
    names: ['Rhode Island']
  }, {
    letter: 'S',
    names: ['South Carolina', 'South Dakota']
  }, {
    letter: 'T',
    names: ['Tennessee', 'Texas']
  }, {
    letter: 'U',
    names: ['Utah']
  }, {
    letter: 'V',
    names: ['Vermont', 'Virginia']
  }, {
    letter: 'W',
    names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  }];

  constructor(
    private eventService: EventService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getevents();
    this.stateGroupOptions = this.stateForm.get('states')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value))
    );
  }
  getevents(): void {
    this.eventService.getEvents().subscribe(events => this.events = events);
  }
  add(id: number,
      firstName: string,
      lastName: string,
      email: string,
      address: string,
      city: string,
      state: string,
      zip: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    address = address.trim();
    city = city.trim();
    state = state.trim();
    zip = zip.trim();

/*    if (!firstName) { return; }
    this.eventService.addEvent({ firstName, lastName, email, address, city, state, zip } as Event)
      .subscribe(event => {
        this.events.push(event);
      });*/
  }
  delete(event: Event): void {
    this.events = this.events.filter(h => h !== event);
    this.eventService.deleteEvent(event).subscribe();
  }
  private _filterGroup(value: string): States[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: filter(group.names,
            value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }
}
