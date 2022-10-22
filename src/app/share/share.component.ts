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
      map(paramMap => ({ key: paramMap.get('key'), contentId: paramMap.get('contentId') })),
      mergeMap(({ key, contentId }) => this.contentService.getSharedContent(key as string, contentId as string))
    )
  }
}
