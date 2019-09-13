import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { faCheck, faEdit, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'event-registration',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent implements OnInit {
  faCheck = faCheck;
  faEdit = faEdit;
  faCalendar = faCalendar;
  teamEvent = <EventRegistration> {};
  eventForm = this.formBuilder.group({
    name: new FormControl(this.teamEvent.name, [Validators.required, Validators.minLength(3)]),
    location: '',
    startDate: '',
    startTime: '',
    logoImageUrl: '',
    locationImageUrl: '',
    minAttendees: '',
    maxAttendees: ''
  });

  get name() { return this.eventForm.get('name'); }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL')
    private baseUrl: string,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params => {
      if (params['id']) {
        this.http.get<EventRegistration>("api/teamevents/" + params['id']).subscribe(result => this.teamEvent = result)
      }
    });
  }

  onSubmit(eventData) {
    this.http.post<EventRegistration>(this.baseUrl + 'api/teamevents', eventData).subscribe(
      result => this.router.navigate(['/events-grid']),
      error => console.error(error)
    );

    this.eventForm.reset();
  }
}

interface EventRegistration {
  id: number;
  name: string;
  location: string;
  startDate: Date;
}

