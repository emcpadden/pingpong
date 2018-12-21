import { Component, OnInit } from '@angular/core';
import { PingPongMessagingService } from './ping-pong-messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pingweb';

  constructor(private pingPongMessagingService: PingPongMessagingService) {
  }

  ngOnInit() {
    this.pingPongMessagingService.getConnection().subscribe(c => {
      let json = JSON.stringify(c);
      console.log(`PINGPONG CONNECTION: ${json}`);
    });

    this.pingPongMessagingService.getMessage().subscribe(m => {
      let json = JSON.stringify(m);
      console.log(`PINGPONG MESSAGE: ${json}`);
    });

    this.pingPongMessagingService.sendMessage('This is a test from Ping Service');
  }

}
