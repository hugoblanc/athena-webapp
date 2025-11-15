import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { MetaMediaService } from '../services/meta-media.service';

/**
 * Ce guard s'assure que la navigation vers une page qui nécessite un currentMetaMedia en ait bien un
 * Il récupère le paramètre 'key' de l'URL et initialise le currentMetaMedia correspondant
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentMetaMediaGuard implements CanActivate {

  constructor(
    private metaMediaService: MetaMediaService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {

    const key = route.paramMap.get('key');

    if (!key) {
      console.warn('CurrentMetaMediaGuard: No key parameter found in route');
      return this.router.createUrlTree(['/home']);
    }

    try {
      const metaMedia = this.metaMediaService.findAndSetMediaByKey(key);
      return metaMedia != null;
    } catch (error) {
      console.error('CurrentMetaMediaGuard: Error finding media by key', error);
      return this.router.createUrlTree(['/home']);
    }
  }
}
