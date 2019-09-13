import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { faCheck, faEdit, faCalendar} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'event-registration',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  faCheck = faCheck;
  faEdit = faEdit;
  faCalendar = faCalendar;
  newEvent = <EventRegistration> {};
  eventForm = this.formBuilder.group({
    name: new FormControl(this.newEvent.name, [Validators.required, Validators.minLength(3)]),
    location: '',
    startDate: '',
    startTime: ''
  });

  get name() { return this.eventForm.get('name'); }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL')
    private baseUrl: string,
    private formBuilder: FormBuilder) {}

  onSubmit(eventData) {
    this.http.post<EventRegistration>(this.baseUrl + 'api/teamevents', eventData).subscribe(
      result => console.warn(result), //this.gridOptions.api.updateRowData({ add: [result] }),
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

