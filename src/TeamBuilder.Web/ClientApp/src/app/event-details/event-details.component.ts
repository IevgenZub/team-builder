import { Component, OnInit, Inject } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { map} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  id: number;
  userName: string;
  isAuthenticated: boolean;
  teamEvent: any;
  faPlus = faPlus;
  faMinus = faMinus;
  comment = <Comment>{};
  comments = [];
  commentForm = this.formBuilder.group({
    text: new FormControl(this.comment.text, [Validators.required, Validators.minLength(3)])
  });
  connection: signalR.HubConnection;

  constructor(
    private authorizeService: AuthorizeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private eventService: EventService) {

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/teamEventsHub")
      .build();

    this.connection.on("messageReceived", (username: string, message: string) => {
      console.warn(username);
      console.warn(message);
    });

    this.connection.start().catch(err => document.write(err));
  }

  ngOnInit(): void {
    const id: Observable<string> = this.route.params.pipe(map(p => p.id));
    this.authorizeService.isAuthenticated().subscribe(result => this.isAuthenticated = result);
    this.authorizeService.getUser().pipe(map(u => u && u.name)).subscribe(user => {
      id.subscribe(result => {
        this.id = Number(result);
        this.userName = user;
        this.eventService.getTeamEvent(this.id).subscribe(
          data => {
            this.teamEvent = data;
            if (this.teamEvent.comments) {
              this.comments = JSON.parse(this.teamEvent.comments);
            }
          },
          error => console.error(error))
      });
    });
  }

  attend() {
    if (this.isAuthenticated) {
      this.connection.send("newMessage", this.userName, "Hey!");
      this.eventService.attend(this.teamEvent, this.userName).subscribe(
        result => console.warn(result),
        error => console.error(error)
      )
    }
  }

  discard() {
    if (this.isAuthenticated) {
      this.eventService.discard(this.teamEvent, this.userName).subscribe(
        result => console.warn(result),
        error => console.error(error)
      )
    }
  }

  onSubmitComment(eventData) {
    if (this.isAuthenticated) {
      this.eventService.addComment(this.teamEvent, eventData.text, this.userName).subscribe(
        () => this.comments.push({user: this.userName, text: eventData.text, date: new Date()}),
        error => console.error(error)
      )
    }
  }
}

interface Comment {
  text: string
}
