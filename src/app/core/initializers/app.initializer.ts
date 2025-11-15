import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetaMediaService } from '../services/meta-media.service';

/**
 * Initializer function to load meta media list before app starts
 */
export function initializeApp(metaMediaService: MetaMediaService): () => Observable<any> {
  return () => {
    console.log('Initializing app: loading meta media list...');
    return metaMediaService.init().pipe(
      tap(() => console.log('Meta media list loaded successfully'))
    );
  };
}
