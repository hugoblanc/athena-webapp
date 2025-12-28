// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  firebase: {
    apiKey: 'AIzaSyCTiCI6shOiqMCPnPWhP65SK_HXi0iJWs8',
    authDomain: 'open-athena.firebaseapp.com',
    databaseURL: 'https://open-athena.firebaseio.com',
    projectId: 'open-athena',
    storageBucket: 'open-athena.firebasestorage.app',
    messagingSenderId: '468962553465',
    appId: '1:468962553465:web:35a11769c90823cc4aaea8',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
