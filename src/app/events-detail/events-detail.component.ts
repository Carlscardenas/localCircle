import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event } from '../event';
import { EventService } from '../event.service';

@Component({
  selector: 'app-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: [ './events-detail.component.css' ]
})
export class EventsDetailComponent implements OnInit {
  @Input() event: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getevent();
  }

  getevent(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.eventService.getEvent(id)
      .subscribe(event => this.event = event);
  }

  getTexasevent(): void {
    const state = +this.route.snapshot.paramMap.get('state');
    this.eventService.getEvent(state)
      .subscribe(event => this.event = event);
  }

  save(): void {
    this.eventService.updateEvent(this.event)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
