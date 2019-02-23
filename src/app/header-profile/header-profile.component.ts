import { Component, OnInit } from '@angular/core';
import { Account } from '../account';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss']
})
export class HeaderProfileComponent implements OnInit {

  account = new Account('firstname', 'lastname');

  constructor() { }

  ngOnInit() {
  }

}
