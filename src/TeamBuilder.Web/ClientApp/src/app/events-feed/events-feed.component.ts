import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'events-feed',
  templateUrl: './events-feed.component.html',
  styleUrls: ['./events-feed.component.css']
})
export class EventsFeedComponent implements OnInit{
  userName: string;
  isAuthenticated: boolean;
  teamEvents: any;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private authorizeService: AuthorizeService) {}

  ngOnInit(): void {
    this.authorizeService.isAuthenticated().subscribe(result => this.isAuthenticated = result);
    this.authorizeService.getUser().pipe(map(u => u && u.name)).subscribe(user => {
      this.userName = user
      this.http.get(this.baseUrl + 'api/teamevents').subscribe(
        data => this.teamEvents = data,
        error => console.error(error));
    });
  }

  attend(id: number) {
    if (this.isAuthenticated) {
      let teamEvent = this.teamEvents.find(te => te.id == id);
      let attendees = [];
      if (teamEvent.attendees) {
        attendees = JSON.parse(teamEvent.attendees);
      }

      if (attendees.filter(a => a.email == this.userName).length == 0) {
        attendees.push({ email: this.userName });
        var updateRequest = {
          name: teamEvent.name,
          location: teamEvent.location,
          startDate: new Date(teamEvent.startDate),
          startTime: {
            hour: new Date(teamEvent.startDate).getHours(),
            minute: new Date(teamEvent.startDate).getMinutes()
          },
          minAttendees: teamEvent.minAttendees,
          maxAttendees: teamEvent.maxAttendees,
          locationImageUrl: teamEvent.locationImageUrl,
          logoImageUrl: teamEvent.logoImageUrl,
          attendees: JSON.stringify(attendees)
        }

        this.http.put(this.baseUrl + 'api/teamevents/' + id, updateRequest).subscribe(
          () => teamEvent.attendees = JSON.stringify(attendees),
          error => console.error(error)
        );
      }
    }
  }

  discard(id: number) {
    if (this.isAuthenticated) {
      let teamEvent = this.teamEvents.find(te => te.id == id);
      let attendees = [];
      if (teamEvent.attendees) {
        attendees = JSON.parse(teamEvent.attendees);
        const index: number = attendees.findIndex(a => a.email == this.userName);
        if (index !== -1) {
          attendees.splice(index, 1);
        }
      }

      var updateRequest = {
        name: teamEvent.name,
        location: teamEvent.location,
        startDate: new Date(teamEvent.startDate),
        startTime: {
          hour: new Date(teamEvent.startDate).getHours(),
          minute: new Date(teamEvent.startDate).getMinutes()
        },
        minAttendees: teamEvent.minAttendees,
        maxAttendees: teamEvent.maxAttendees,
        locationImageUrl: teamEvent.locationImageUrl,
        logoImageUrl: teamEvent.logoImageUrl,
        attendees: JSON.stringify(attendees)
      }

      this.http.put(this.baseUrl + 'api/teamevents/' + id, updateRequest).subscribe(
        () => teamEvent.attendees = JSON.stringify(attendees),
        error => console.error(error)
      );
    }
  }
}


