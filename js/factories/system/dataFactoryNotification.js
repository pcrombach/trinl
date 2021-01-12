/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryNotification', ['$rootScope', '$state', '$timeout', '$interval', 'dataFactoryInstellingen',
  function ($rootScope, $state, $timeout, $interval, dataFactoryInstellingen) {

    var dataFactoryNotification = {};

    var sound;
    var soundFile;

    var ceoProfielId = localStorage.getItem('authentication_profielId');

    Howl.autoUnlock = true;
    Howl.mobileAutoEnable = true;

    $rootScope.$emit('touchend');
    $rootScope.$emit('click');

    if (+ceoProfielId === 5) {
      soundFile = 'sound/push-notify.mp3';
    } else {
      soundFile = 'sound/data-notify.mp3';
    }

    sound = new Howl({
      src: [soundFile],
      volume: dataFactoryInstellingen.notifyVolume / 100
    });

    //
    //  Initialize listeners voor mobiel notification clicks 
    //
    function initLocalNotification() {

      //console.log('initLocalNotification');

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

        document.addEventListener('deviceready', function () {

          cordova.plugins.notification.local.on('click', function (result) {
            //console.log('Local Notification click Mobiel => result: ', result);
            if (result.data === 'update') {
              codePush.restartApplication();
            } else {
              //console.log('Local Notification click Mobiel => goto Beheer Filter nieuw: ', result.data);
              if (result.data) {

                //$rootScope.$emit('navigatie', {
                  //from: ''
                //});
                $rootScope.$emit('openSnelMenu');

                $state.go(result.data);

                $timeout(function () {
                  if (result.data === 'berichten.berichten') {
                    //console.log('Local Notification click Mobiel => filter Berichten Beheer Nieuw');
                    $rootScope.$emit('berichtFilterNotification');
                  }
                  if (result.data === 'fotos.fotos') {
                    //console.log('Local Notification click Mobiel => filter Fotos Beheer Nieuw');
                    $rootScope.$emit('fotoFilterNotification');
                  }
                  if (result.data === 'pois.pois') {
                    //console.log('Local Notification click Mobiel => filter Locaties Beheer Nieuw');
                    $rootScope.$emit('poiFilterNotification');
                  }
                  if (result.data === 'tracks.tracks') {
                    //console.log('Local Notification click Mobiel => filter Sporen Beheer Nieuw');
                    $rootScope.$emit('trackFilterNotification');
                  }
                }, 800);
              } else {
                $state.go('app.kaart');
              }
            }
          });
        });
      }
    }

    if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

      document.addEventListener('deviceready', function () {
        cordova.plugins.notification.local.requestPermission();
        cordova.plugins.notification.local.hasPermission(function (result) {
          if (!result) {
            cordova.plugins.notification.local.requestPermission();
          }
        });
        cordova.plugins.notification.local.requestPermission();
      });
      // Initialize the channel by sending
      // the port to the Service Worker (this also
      // transfers the ownership of the port)
      //console.log('messageChannel init');

      const messageChannel = new MessageChannel();

      navigator.serviceWorker.controller.postMessage({
        type: 'INIT_PORT',
      }, [messageChannel.port2]);
      //
      //  Initialize listeners for click notificaton via messagechannel
      //
      messageChannel.port1.onmessage = (event) => {

        //console.log('messageChannel [ServiceWorker] notification Desktop/PWA=> goto Beheer filter Nieuw: ', event);

        if (event.data.payload) {

          //$rootScope.$emit('navigatie', {
            //from: ''
          //});
          $rootScope.$emit('openSnelMenu');

          $state.go(event.data.payload);

          $timeout(function () {
            if (event.data.payload === 'berichten.berichten') {
              //console.log('messageChannel [ServiceWorker] notification Desktop/PWA=> filter Berichten Beheer Nieuw');
              $rootScope.$emit('berichtFilterNotification');
            }
            if (event.data.payload === 'fotos.fotos') {
              //console.log('messageChannel [ServiceWorker] notification Desktop/PWA=> filter Fotos Beheer Nieuw');
              $rootScope.$emit('fotoFilterNotification');
            }
            if (event.data.payload === 'pois.pois') {
              //console.log('messageChannel [ServiceWorker] notification Desktop/PWA=> filter Locaties Beheer Nieuw');
              $rootScope.$emit('poiFilterNotification');
            }
            if (event.data.payload === 'tracks.tracks') {
              //console.log('messageChannel [ServiceWorker] notification Desktop/PWA=> filter Sporen Beheer Nieuw');
              $rootScope.$emit('trackFilterNotification');
            }
          }, 100);
        }
      };
    } else {
      document.addEventListener('deviceready', function () {
        initLocalNotification();
      });
    }
    //
    //  Componeer een notificatie.
    //  Wordt gebruikt in de dataFactoryFoto/Pio/Track tijdens verrijking
    //  Indien tijdens verrijking een nieuwe ItemSupModel of ItemReactieSupModel wordt aangemaakt (nieuwe)
    //
    dataFactoryNotification.composeTitleBodyNotification = function (nieuweItems, nieuweReacties, group) {

      //console.warn('dataFactoryNotification composeTitleBodyNotification nieuweItems: ', nieuweItems);
      //console.warn('dataFactoryNotification composeTitleBodyNotification nieuweReacties: ', nieuweReacties);
      //console.warn('dataFactoryNotification composeTitleBodyNotification group: ', group);

      var type, types;
      if (group === 'bericht') {
        type = ' nieuw Bericht';
        types = ' Berichten';
      }
      if (group === 'foto') {
        type = ' nieuwe Foto';
        types = ' Foto\'s';
      }
      if (group === 'poi') {
        type = ' nieuwe Locatie';
        types = ' Locaties';
      }
      if (group === 'track') {
        type = ' nieuw Spoor';
        types = ' Sporen';
      }

      if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

        if ('serviceWorker' in navigator) {
          //console.warn('dataFactoryNotification watchUpdate serviceWorker OK');
          navigator.serviceWorker.register('./sw.js').then(function (registration) {
            //console.warn('dataFactoryNotification watchUpdate serviceWorker registration: ', registration);
            //var titel = 'Groep: ' + __dataItem__Model.xData.groep;
            var titel = 'Tijdreizen in Limburg';
            var body = 'Je hebt ';
            //if (items > 0) {
            if (nieuweItems > 0) {
              if (nieuweItems === 1) {
                body = body + ' 1' + type;
              }
              if (nieuweItems > 1) {
                body = nieuweItems + ' nieuwe' + types;
              }
            }
            if (nieuweReacties > 0) {
              if (nieuweReacties === 1) {
                if (nieuweItems > 0) {
                  body = body + ' en ';
                }
                body = '1 nieuwe Reactie in' + types;
              }
              if (nieuweReacties > 1) {
                if (nieuweItems > 0) {
                  body = body + ' en ';
                }
                body = nieuweReacties + ' nieuwe Reacties in' + types;
              }
            }
            //body = body + ' ontvangen';
            if (nieuweItems + nieuweReacties > 0) {
              doNotificationBrowser(registration, titel, body, group);
            }
          });
        }
      } else {
        //var titel = 'TRINL Groep: ' + __dataItem__Model.xData.groep;
        var titel = 'Tijdreizen in Limburg';
        var body = 'Je hebt ';
        if (nieuweItems > 0) {
          if (nieuweItems === 1) {
            body = body + ' 1' + type;
          }
          if (nieuweItems > 1) {
            body = nieuweItems + ' nieuwe' + types;
          }
        }
        if (nieuweReacties > 0) {
          if (nieuweReacties === 1) {
            if (nieuweItems > 0) {
              body = body + ' en ';
            }
            body = '1 nieuwe Reactie in' + types;
          }
          if (nieuweReacties > 1) {
            if (nieuweItems > 0) {
              body = body + ' en ';
            }
            body = nieuweReacties + ' nieuwe Reacties in' + types;
          }
        }
        //body = body + ' ontvangen';
        if (nieuweItems + nieuweReacties > 0) {
          dataFactoryNotification.doNotificationMobiel(titel, body, group);
        }
      }
    };
    //
    //  Notification for Browser and PWA
    //
    function newLocalNotificationBrowser(registration, titel, body, group) {

      if (registration.active) {

        var items, beheer, Id;
        if (group === 'update') {
          Id = '0';
        }
        if (group === 'bericht') {
          beheer = 'berichten.berichten';
          items = 'Berichten Beheren';
          Id = '1';
        }
        if (group === 'foto') {
          beheer = 'fotos.fotos';
          items = 'Foto\'s Beheren';
          Id = '2';
        }
        if (group === 'poi') {
          beheer = 'pois.pois';
          items = 'Locaties Beheren';
          Id = '3';
        }
        if (group === 'track') {
          beheer = 'tracks.tracks';
          items = 'Sporen Beheren';
          Id = '4';
        }

        //var possible = '0123456789';
        //var Id = possible.charAt(Math.floor(Math.random() * possible.length));
        //for (var i = 0; i < 12; i++) {
        //Id += possible.charAt(Math.floor(Math.random() * possible.length));
        //}

        //console.log('dataFactoryNotification newLocalNotificationBrowser Id: ', Id);
        //console.log('dataFactoryNotification newLocalNotificationBrowser titel : ', titel);
        //console.log('dataFactoryNotification newLocalNotificationBrowser body: ', body);
        //console.log('dataFactoryNotification newLocalNotificationBrowser group: ', group);
        //console.log('dataFactoryNotification newLocalNotificationBrowser beheer: ', beheer);
        //console.log('dataFactoryNotification newLocalNotificationBrowser items: ', items);

        if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

          document.addEventListener('deviceready', function () {

            if (Id === '0') {
              cordova.plugins.notification.local.cancelAll();
            } else {
              cordova.plugins.notification.local.cancel(Id);
            }
          });
        }

        if (items) {
          registration.showNotification(titel, {
            id: Id,
            body: body,
            actions: [{
              action: 'Bekijken',
              type: 'button',
              title: 'Bekijk in TRINL ' + items,
            }],
            group: group,
            tag: group,
            foreground: true,
            ongoing: true,
            sticky: true,
            data: beheer,
            image: 'assets/screenshots/screenshot-512.png',
            icon: 'assets/icons/apple-icon-72.png'
          });
        } else {
          registration.showNotification(titel, {
            id: Id,
            body: body,
            group: group,
            tag: group,
            foreground: true,
            ongoing: true,
            sticky: true,
            data: beheer,
            image: 'assets/screenshots/screenshot-512.png',
            icon: 'assets/icons/apple-icon-72.png'
          });
        }
      } else {
        //console.log('newLocalNotificationBrowser NOT ACTIVE');
      }
    }

    function doNotificationBrowser(registration, titel, body, group) {

      //console.log('dataFactoryNotification doNotificationBrowser registration: ', registration);
      //console.log('dataFactoryNotification doNotificationBrowser titel: ', titel);
      //console.log('dataFactoryNotification doNotificationBrowser body: ', body);
      //console.log('dataFactoryNotification doNotificationBrowser group: ', group);

      if (registration && body) {
        newLocalNotificationBrowser(registration, titel, body, group);
      }

      if (dataFactoryInstellingen.notifySound) {
        if (getOS() !== 'Windows') {
          //console.log('dataFactoryNotification doNotification sound: ', getOS());
          sound.play();
        }
      } else {
        //console.log('dataFactoryNotification doNotification sound SKIPPED: ', getOS());
      }
    }

    //
    // Some stuff for notifications IOS and Android
    //
    function newLocalNotificationMobiel(titel, body, group) {

      var data, items, Id;
      if (group === 'update') {
        data = 'update',
        Id = '0';
      }
      if (group === 'bericht') {
        data = 'berichten.berichten';
        items = 'Berichten Beheren';
        Id = '1';
      }
      if (group === 'foto') {
        data = 'fotos.fotos';
        items = 'Foto\'s Beheren';
        Id = '2';
      }
      if (group === 'poi') {
        data = 'pois.pois';
        items = 'Locaties Beheren';
        Id = '3';
      }
      if (group === 'track') {
        data = 'tracks.tracks';
        items = 'Sporen Beheren';
        Id = '4';
      }

      //var possible = '0123456789';
      //var Id = possible.charAt(Math.floor(Math.random() * possible.length));
      //for (var i = 0; i < 12; i++) {
      //Id += possible.charAt(Math.floor(Math.random() * possible.length));
      //}

      //console.log('dataFactoryNotification newLocalNotificationBrowser Id: ', Id);
      //console.log('dataFactoryNotification newLocalNotificationBrowser titel : ', titel);
      //console.log('dataFactoryNotification newLocalNotificationBrowser body: ', body);
      //console.log('dataFactoryNotification newLocalNotificationBrowser group: ', group);
      //console.log('dataFactoryNotification newLocalNotificationBrowser data : ', data);
      //console.log('dataFactoryNotification newLocalNotificationBrowser items: ', items);

      if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {

        document.addEventListener('deviceready', function () {
          if (Id === '0') {
            cordova.plugins.notification.local.cancelAll();
          } else {
            cordova.plugins.notification.local.cancel(Id);
          }
        });
      }

      if (ionic.Platform.isAndroid()) {

        if (items) {
          cordova.plugins.notification.local.schedule({
            id: Id,
            title: titel,
            text: body,
            data: data,
            group: group,
            led: '00ff00',
            foreground: true,
            actions: [{
              id: data,
              title: 'Bekijk in TRINL ' + items,
              type: 'button'
            }],
            //attachment: 'assets/screenshots/screenshot-512.png',
            //sticky: true,
            //badge: 'assets/icons/apple-icon-192.png',
            //image: 'assets/screenshots/screenshot-512.png',
            icon: 'assets/icons/apple-icon-72.png'
            //icon: 'res://ic_notification.png',
            //smallIcon: 'res://ic_notification_small.png',
            //sound: 'sound/push-notify.mp3'
            //sound: false
          });
          //console.log('notification scheduled for Android');
        } else {
          cordova.plugins.notification.local.schedule({
            id: Id,
            title: titel,
            text: body,
            data: data,
            group: group,
            led: '00ff00',
            foreground: true,
            actions: [{
              id: 'update',
              title: 'Update NU',
              type: 'button'
            }],
            //attachment: 'assets/screenshots/screenshot-512.png',
            //sticky: true,
            //badge: 'assets/icons/apple-icon-192.png',
            //image: 'assets/screenshots/screenshot-512.png',
            icon: 'assets/icons/apple-icon-72.png'
            //icon: 'res://ic_notification.png',
            //smallIcon: 'res://ic_notification_small.png',
            //sound: 'sound/push-notify.mp3'
            //sound: false
          });
          //console.log('notification scheduled for Android');

        }
      }

      if (ionic.Platform.isIOS()) {

        if (items) {
          cordova.plugins.notification.local.schedule({
            id: Id,
            title: titel,
            text: body,
            data: data,
            group: group,
            foreground: true,
            actions: [{
              id: data,
              title: 'Bekijk in TRINL ' + items,
              type: 'button'
            }],
            icon: 'assets/icons/apple-icon-72.png',
            sound: false
          });
          //console.log('notofication scheduled for IOS');
        } else {
          cordova.plugins.notification.local.schedule({
            id: Id,
            title: titel,
            text: body,
            data: data,
            group: group,
            led: '00ff00',
            foreground: true,
            actions: [{
              id: 'update',
              title: 'Update NU ',
              type: 'button'
            }],
            //attachment: 'assets/screenshots/screenshot-512.png',
            //sticky: true,
            //badge: 'assets/icons/apple-icon-192.png',
            //image: 'assets/screenshots/screenshot-512.png',
            icon: 'assets/icons/apple-icon-72.png',
            //icon: 'res://ic_notification.png',
            //smallIcon: 'res://ic_notification_small.png',
            //sound: 'sound/push-notify.mp3'
            sound: false
          });
          //console.log('notification scheduled for Android');

        }
      }
    }
    //
    //  Notification for IOS and Android
    //  handeld by dataFactoryNotification
    //
    dataFactoryNotification.doNotificationMobiel = function (titel, body, group) {

      //console.log('dataFactoryNotification doNotificationMobiel titel, body: ', titel, body, group);

      newLocalNotificationMobiel(titel, body, group);

      //console.log('dataFactoryNotification doNotificationMobiel sound en trillen');

      if (dataFactoryInstellingen.notifyVibrate) {
        //if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        navigator.vibrate([300, 50, 150, 50, 300]);
        //}
      }
      if (dataFactoryInstellingen.notifySound) {
        //if (getOS() === 'Android' || getOS() === 'iOS') {
        sound.play();
        //}
      }
    };

    function getOS() {
      var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'MacOS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
      } else if (/Android/.test(userAgent)) {
        os = 'Android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
      }

      return os;
    }

    return dataFactoryNotification;
  }]);
