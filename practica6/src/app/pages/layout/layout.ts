import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../shared/header/header';
import { SidebarMenu } from '../../shared/sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MatListModule, MatIconModule, Header, SidebarMenu],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
}
