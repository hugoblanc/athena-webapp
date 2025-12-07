import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type Platform = 'ios' | 'android' | 'desktop';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  platform: Platform = 'desktop';
  articleUrl: string | null = null;

  readonly playStoreUrl = 'https://play.google.com/store/apps/details?id=com.open.athena';
  readonly appStoreUrl = 'https://apps.apple.com/us/app/athena/id1472567223?l=fr&ls=1';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.platform = this.detectPlatform();
    this.articleUrl = this.route.snapshot.queryParamMap.get('articleUrl');
  }

  private detectPlatform(): Platform {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    }

    if (/android/.test(userAgent)) {
      return 'android';
    }

    return 'desktop';
  }

  get primaryStoreUrl(): string {
    return this.platform === 'ios' ? this.appStoreUrl : this.playStoreUrl;
  }

  get secondaryStoreUrl(): string {
    return this.platform === 'ios' ? this.playStoreUrl : this.appStoreUrl;
  }

  get primaryStoreName(): string {
    return this.platform === 'ios' ? 'App Store' : 'Google Play';
  }

  get secondaryStoreName(): string {
    return this.platform === 'ios' ? 'Google Play' : 'App Store';
  }

  get primaryStoreIcon(): string {
    return this.platform === 'ios' ? 'assets/appstore.svg' : 'assets/playstore.svg';
  }

  get secondaryStoreIcon(): string {
    return this.platform === 'ios' ? 'assets/playstore.svg' : 'assets/appstore.svg';
  }
}
