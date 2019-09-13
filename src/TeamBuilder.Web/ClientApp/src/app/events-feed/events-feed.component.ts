import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'events-feed',
  templateUrl: './events-feed.component.html',
  styleUrls: ['./events-feed.component.css']
})
export class EventsFeedComponent{
  teamEvents;
  faPlus = faPlus;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.http.get(this.baseUrl + 'api/teamevents').subscribe(
      result => this.teamEvents = result,
      error => console.error(error)
    );
  }
}

