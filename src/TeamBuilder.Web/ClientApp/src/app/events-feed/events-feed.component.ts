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

}


