import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, filter, map } from 'rxjs/operators';
import { ContentService } from './content.service';
import { ShareableContentResponse } from './shareable-content.dto';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  shareableContent$!: Observable<ShareableContentResponse>;

  constructor(private readonly contentService: ContentService, private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.shareableContent$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      filter(valueIsString),
      map(id => parseInt(id)),
      mergeMap(id => this.contentService.getSharedContent(id))
    )
  }

}


function valueIsString(value: any): value is string {
  return typeof value === 'string';
}
