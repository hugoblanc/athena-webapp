import { Injector } from '@angular/core';
import { MetaMediaType } from '../../../models/meta-media/meta-media-type.enum';
import { MetaMediaService } from '../meta-media.service';
import { ContentService } from './content.service';
import { WordpressService } from './wordpress.service';
import { YoutubeService } from './youtube.service';

/**
 * Cette classe permet de gérer l'injection du ContentService
 * Elle nous permet d'injecter une interface au lieu d'une implémentation
 * La résolution du service se fera pendant l'execution et dépendra du contexte
 * Le contexte est ici récupérer via metaMediaService
 * On évalue le type du currentMetaMedia
 * @param metaMediaService le service qui comporte notre contexte
 * @param injector l'élément qui permet l'injection manuelle de service(@Injectable)
 */
const contentServiceFactory = (metaMediaService: MetaMediaService, injector: Injector) => {
  // Comme on peut le voir en fonction du type de currentMetaMedia, on va charger un service ou bien l'autre
  if (metaMediaService.currentMetaMedia.type === MetaMediaType.WORDPRESS) {
    return injector.get(WordpressService);
  } else {
    return injector.get(YoutubeService);
  }
};

// Finalement on export le bon objet pour être gérable par les annotation angular de composant
export let contentServiceProvider = {
  provide: ContentService,
  useFactory: contentServiceFactory,
  deps: [MetaMediaService, Injector]
};
