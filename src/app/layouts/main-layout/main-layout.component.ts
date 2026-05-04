import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterOutlet } from "../../../../node_modules/@angular/router/types/_router_module-chunk";
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  imports: [NavbarComponent, RouterOutlet]',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {

}
