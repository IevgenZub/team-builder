import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'event-registration-component',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  eventForm;
    
  constructor(private formBuilder: FormBuilder) {
      this.eventForm = formBuilder.group({
        name: '',
        location: ''
      });
  }

  public onSubmit(eventData) {
    console.warn('Your event has been submitted', eventData);
    this.eventForm.reset();
  }
}

interface EventRegistration {
  name: string;
  location: string;
}

