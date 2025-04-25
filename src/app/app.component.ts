import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconsModule } from './shared/icons/icons.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, IconsModule],
  standalone: true,
})
export class AppComponent {
  title = 'tms-frontend';
}
