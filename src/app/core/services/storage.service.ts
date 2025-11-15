import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AthenaDB extends DBSchema {
  'athena-store': {
    key: string;
    value: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public static COUNT_KEY = 'COUNT_KEY';
  public static INSTALLATION_DATE = 'INSTALLATION_DATE';
  public static CLAPPED_ISSUE = 'CLAPPED_ISSUE';
  private static FIRST_LAUNCH = 'FIRST_LAUNCH';

  private dbPromise: Promise<IDBPDatabase<AthenaDB>>;
  private readonly DB_NAME = 'athena-db';
  private readonly STORE_NAME = 'athena-store';
  private readonly DB_VERSION = 1;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<AthenaDB>> {
    return openDB<AthenaDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('athena-store')) {
          db.createObjectStore('athena-store');
        }
      },
    });
  }

  initFirstLaunch(): void {
    this.set(StorageService.FIRST_LAUNCH, true);
  }

  isFirstLaunch(): Observable<boolean> {
    return this.get(StorageService.FIRST_LAUNCH)
      .pipe(map((isFirst) => (isFirst == null)));
  }

  /**
   * Cette methode se charge de changer une propriété d'objet en storage:  key.objectKey = value
   * @param key le nom en storage de l'objet
   * @param objectKey La clé de la propriété de l'objet
   * @param value la valeur que l'on veut doner à l'objet
   */
  public editObject(key: string, objectKey: string, value: any): Observable<any> {
    return this.get<any>(key).pipe(tap((object: any) => {
      if (object == null) {
        object = {};
      }
      object[objectKey] = value;
      this.set(key, object);
    }));
  }

  /**
   * Cette methode ajoute un element dans un tableau contenu dans le storage
   * @param key la clé qui définie le tableau dans le localstorage
   * @param value la valeur a inserrer au tableau
   */
  public addToArray(key: string, value: any): Observable<any> {
    return this.get<any[]>(key).pipe(tap((array: any[]) => {
      if (array == null) {
        array = [];
      }
      if (!Array.isArray(array)) {
        throw new Error('l\'objet n\'est pas un tableau ');
      }
      array.push(value);
      this.set(key, array);
    }));
  }

  /**
   * Cette methode se charge de save l'objet dans le storage
   * @param key La clé de l'objet
   * @param value La valeur string ou json a poster
   */
  public async set(key: string, value: any): Promise<void> {
    const db = await this.dbPromise;
    let stringValue: string;

    if (!(typeof value === 'string')) {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = value;
    }

    await db.put(this.STORE_NAME, stringValue, key);
  }

  /**
   * Cette metode se charge de récupérer un objet en local storage et de le parser
   * @param key La clé a récupérer dans le localstorage
   */
  public get<T>(key: string): Observable<T> {
    return from(this.dbPromise.then(async (db) => {
      const data = await db.get(this.STORE_NAME, key);
      return JSON.parse(data || 'null');
    }));
  }

  /**
   * Remove an item from storage
   * @param key The key to remove
   */
  public async remove(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(this.STORE_NAME, key);
  }

  /**
   * Clear all items from storage
   */
  public async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(this.STORE_NAME);
  }

  /**
   * Get all keys from storage
   */
  public async keys(): Promise<string[]> {
    const db = await this.dbPromise;
    return db.getAllKeys(this.STORE_NAME) as Promise<string[]>;
  }
}
