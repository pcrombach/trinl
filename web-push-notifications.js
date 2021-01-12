/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

(function (trinl) {
  'use strict';

  var WEB_PUSH_URL;
  var PRIVATE_KEY;

  getSubscription()
    .then(function (subscription) {
      if (subscription) {
        activeNotification();
      } else {
        //console.log('Initial starting subscription');
        unsubscribe();
        subscribe();
        activeNotification();
      }
    })
    .catch(err => {
      //console.error('Inital starting ERROR: ', err);
    });
  /*
  function urlBase64ToUint8Array(base64String) {
    var result;
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      // eslint-disable-next-line no-useless-escape
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
 
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
 
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    result = outputArray;
 
    return result;
  }
  */
  /**
   * Client subscription
   */
  function subscribe() {

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(serviceWorkerRegistration => {

        fetch('webpush.json', {
          method: 'GET',
          contentType: 'text/html'
        }).then(response => {
          response.json().then(data => {
            WEB_PUSH_URL = data.WEB_PUSH_URL;
            PRIVATE_KEY = data.PRIVATE_KEY;
            //console.log('web-push-notifications STARTING using.............: ', WEB_PUSH_URL, PRIVATE_KEY);

            var base64String = PRIVATE_KEY;
            var result;
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
              // eslint-disable-next-line no-useless-escape
              .replace(/\-/g, '+')
              .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            //console.log('subscribe serviceWorkerRegistration: ', serviceWorkerRegistration);
            //console.log('subscribe serverKey: ', outputArray);
            serviceWorkerRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: outputArray
            }).then(pushSubscription => {
              //console.log('subscribe endpoint: ', pushSubscription, pushSubscription.endpoint);
              var finalPushSubscription = JSON.stringify(pushSubscription);
              finalPushSubscription = JSON.parse(finalPushSubscription);
              finalPushSubscription.p256dh = finalPushSubscription.keys.p256dh;
              finalPushSubscription.auth = finalPushSubscription.keys.auth;
              finalPushSubscription.userId = localStorage.getItem('authentication_id');
              finalPushSubscription.profielId = localStorage.getItem('authentication_profielId');
              finalPushSubscription.platform = ionic.Platform.platform();
              finalPushSubscription.platformVersion = ionic.Platform.version();
              //console.log('push finalPushSubscription: ', finalPushSubscription, WEB_PUSH_URL + '/push');
              fetch(WEB_PUSH_URL + '/push', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(finalPushSubscription)
              }).then(result => {
                //console.log('subscribe push subscription POST SUCCESS: ', result);
              }).catch(err => {
                //console.error('subscribe push subscription POST ERROR: ', err);
              });
            }).catch(err => {
              //console.error('subscribe push subscription ERROR: ', err);
            });
          });
        }).catch(err => {
          //console.error('getKey fetch ERROR: ', err);
        });
      }).catch(err => {
        //console.error('subscribe service worker not READY ERROR: ', err);
      });
    }
  }

  /**
   * Client unsubscribe
   */
  function unsubscribe() {
    getSubscription()
      .then(subscription => {
        //console.log('unsubscribe getScubScription subscription: ', subscription, WEB_PUSH_URL + '/unsubscribe');
        return fetch(WEB_PUSH_URL + '/unsubscribe', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        })
          .then(() => {
            //console.log('unsubscribe fetch SUCCESS');
            return subscription.unsubscribe();
          })
          .catch(err => {
            //console.error('unsubscribe fetch ERROR: ', err);
          });
      })
      .catch(err => {
        //console.warn('unsubscribe getSubscription ERROR: ', err);
      });
  }

  /**
   * Ask permission to use browser's notification
   */
  function activeNotification() {
    //Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      //console.error('activeNotification This browser does not support desktop notification');
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
      //console.log('activeNotification Permission to receive notifications has been granted');
    }

    // Otherwise we need to aske the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        permission = 'granted';
        if (permission === 'granted') {
          //console.error('activeNotification This browser granted for notification');
          /*
          navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification('Tijdreizen in Limburg', {
              body: 'Hallo trinl-gebruiker',
              badge: 'assets/icons/apple-icon-192.png',
              image: 'assets/screenshots/screenshot-512.png',
              icon: 'assets/icons/apple-icon-72.png',
              tag: 'vibration-sample'
            });
          });
          */
        }
      });
    }
  }

  /**
   * return client's subscription if available else return null
   */
  function getSubscription() {
    //console.log('getSubscription');
    return navigator.serviceWorker.ready
      .then(function (registration) {
        //console.log('getSubscription registration: ', registration);
        return registration.pushManager.getSubscription();
      })
      .catch(err => {
        //console.error('getSubscription serviceWorker NOT READY ERROR: ', err);
      });

  }

})(trinl);
