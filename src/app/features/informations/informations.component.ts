import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  openLink(url: string): void {
    window.open(url, '_blank');
  }
}
