'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryAnalytics', ['loDash', '$interval', '$moment', '$ionicPlatform', 'dataFactoryObjectId', 'dataFactoryStore',
  function (loDash, $interval, $moment, $ionicPlatform, dataFactoryObjectId, dataFactoryStore) {
    /*
    Analytics is de interface om analytics te beheren
    De store heeft een andere functie dan in de regulire dataFactoies.
    Daar waar een interessante aktiviteit wordt gestart wordt een record aangemaakt.
    Deze records worden standaard in de store geplaatst (push) maar nog niet verstuurd.
    Om het aantal connections te beperken worden twee methodes toegepast.
    De store heeft een maximaal aantal records.
    Indien dit maximum bereikt is wordt de store geupload naar de server.
    Of als een maximum tijd wordt overschreven wordt de store geupload naar de server.
*/
    ////console.warn('dataFactoryAnalytics started');

    var dataFactoryAnalytics = {};
    dataFactoryAnalytics.storeId = 'analytics';

    var debug = true;
    var store = [];
    var storeMax = 5;
    var storeMaxAll = 500;
    var interval;
    var intervalTime = 10; // seconden
    /*
    Initialize store en timer
    Indien timer afloopt
*/
    clearStore();


    //var gebruikers = [];
    //var aantalGebruikers = 10;
    //var kaartHedenAktueel = [];
    //var kaartNietHedenAktueel = [];
    //var sessieStatus = [];
    //var intervals = [];
    //var timeouts = [];
    /*
    var kaartenHeden = [
      { naam: 'Open Street Map', index: 0 },
      { naam: 'Open Street Map Terrain', index: 1 },
      { naam: 'Open Street satelliet', index: 2 }
    ];
    var kaartenVerleden = [
      { naam: '1950', index: 13 },
      { naam: '1900', index: 14 },
      { naam: '1850', index: 15 },
      { naam: '1800', index: 16 },
      { naam: '1700', index: 17 },
      { naam: '1600', index: 18 }
    ];
    var kaartenThema = [
      { naam: 'Pol, vastgesteld in 2014', index: 30 },
      { naam: 'Geurhinder Peel, 2014', index: 31 },
      { naam: 'Windmolenvisie', index: 32 },
      { naam: 'Zonnevisie', index: 33 },
      { naam: 'Hemelhelderheid', index: 34 }
    ];

    var lagen = [
      { naam: 'provinciegrens', index: 1 },
      { naam: 'gemeentegrenzen', insex: 2 },
      { naam: 'water', index: 4 },
      { naam: 'tbo', index: 5 },
      { naam: 'electriciteitsnetwerk', index: 7 },
      { naam: 'plaatsnamen', index: 8 },
      { naam: 'achterban', index: 13 }
    ];
    */
    // createEvent: ', sessie, xtype, xnaam, xindex, xon, gebruikerId;
    //var timeout1, timeout2, timeout3, timeout4, timeout5, timeout6, timeout7, timeout8, interval1, interval2, interval3;
    /*
    function genereerGebruikers() {
      var i = 0;
      for (i = 0; i < aantalGebruikers; i++) {
        gebruikers.push(dataFactoryObjectId.create());
      }
    }
    */
    //
    //  TABELLEN met timeouts en intervals per gebruiker
    //
    /*
    function stopAll() {
      setTimeout(function () {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
        clearTimeout(timeout6);
        clearTimeout(timeout7);
        clearTimeout(timeout8);
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);
      }, 20000);
    }
    */
    //
    //  Met key gebruikerId
    //  De oude aktuele hedenkaart bepalen
    //  Een willekeurige hedenkaart selecteren.
    //  Indien niet gelijk dan is echt een nieuwe kaart gekozen
    //  De aktuele kaartheden van de gebruiker verwijderen
    //  De aktele kaartheden toevoegen
    //
    /*
    function newKaartHeden(gebruikerId) {
      var oudekaart = loDash.find(kaartHedenAktueel, function (oudekaart) {
        return oudekaart.gebruikerId === gebruikerId;
      });
      var nieuwekaart = loDash.sample(kaartenHeden);
      if (oudekaart && nieuwekaart && (oudekaart.naam !== nieuwekaart.naam)) {
        if (nieuwekaart.index === 0) {
          stopNietHedenKaart(gebruikerId);
        }
        loDash.remove(kaartHedenAktueel, function (oudekaart) {
          return oudekaart.gebruikerId === gebruikerId;
        });
        kaartHedenAktueel.push(nieuwekaart);
        dataFactoryAnalytics.createEvent('kaarten', 'kaart', nieuwekaart.naam, nieuwekaart.index, '1', gebruikerId);
      }
    }
    */
    /*
    function newKaartVerleden(gebruikerId) {
      var oudekaart = loDash.find(kaartNietHedenAktueel, function (oudekaart) {
        return oudekaart.gebruikerId === gebruikerId;
      });
      var nieuwekaart = loDash.sample(kaartenVerleden);
      if (oudekaart && nieuwekaart && (oudekaart.naam !== nieuwekaart.naam)) {
        loDash.remove(kaartNietHedenAktueel, function (oudekaart) {
          return oudekaart.gebruikerId === gebruikerId;
        });
        kaartNietHedenAktueelpush(nieuwekaart);
        dataFactoryAnalytics.createEvent('kaarten', 'kaart', nieuwekaart.naam, nieuwekaart.index, '1', gebruikerId);
      }
    }
    */
    /*
    function newKaartThema(gebruikerId) {
      var oudekaart = loDash.find(kaartNietHedenAktueel, function (oudekaart) {
        return oudekaart.gebruikerId === gebruikerId;
      });
      var nieuwekaart = loDash.sample(kaartenThema);
      if (oudekaart && nieuwekaart && (oudekaart.naam !== nieuwekaart.naam)) {
        loDash.remove(kaartNietHedenAktueel, function (oudekaart) {
          return oudekaart.gebruikerId === gebruikerId;
        });
        kaartNietHedenAktueelpush(nieuwekaart);
        dataFactoryAnalytics.createEvent('kaarten', 'kaart', nieuwekaart.naam, nieuwekaart.index, '1', gebruikerId);
      }
    }
    */
    /*
    function stopNietHedenKaart(gebruikerId) {
      loDash.remove(kaartNietHedenAktueel, function (kaart) {
        return kaart.gebruikerId === gebruikerId;
      });
    }
    */
    /*
    function startLaag(gebruikerId) {
      var nieuweLaag = loDash.sample(lagen);
      dataFactoryAnalytics.createEvent('kaarten', 'laag', nieuweLaag.naam, nieuweLaag.index, '1', gebruikerId);
      timeout8 = setTimeout(function () {
        dataFactoryAnalytics.createEvent('kaarten', 'laag', nieuweLaag.naam, nieuweLaag.index, '0', gebruikerId);
      }, Math.floor(Math.random() * 500000) + 60000);
      timeouts.push({
        timeout: timeout8,
        gebruikerId: gebruikerId
      });
    }
    */
    //
    //  Onderstaande events moeten eigenlijk komen uit de app
    //
    /*
    function sessieInit(gebruikerId) {
      dataFactoryAnalytics.createEvent('sessie', 'app', 'cold', '', '1', gebruikerId);
      dataFactoryAnalytics.createEvent('kaarten', 'kaart', 'Open Street Map', '0', '1', gebruikerId);
      dataFactoryAnalytics.createEvent('kaarten', 'laag', 'Provinciegrens', '1', '1', gebruikerId);
      dataFactoryAnalytics.createEvent('kaarten', 'opacity', '100', '0', '1', gebruikerId);
    }
    */
    /*
    function startSessie(gebruikerId) {

      ////console.log('Mockup startSessie gebruikerId: ', gebruikerId);

      loDash.remove(sessieStatus, function (oudeSessie) {
        return oudeSessie.gebruikerId === gebruikerId;
      });

      sessieStatus.push({
        status: 'start',
        gebruikerId: gebruikerId
      });

      loDash.remove(gebruikers, function (gebruiker) {
        return gebruiker === gebruikerId;
      });
      ////console.log('Mockup gebruikers: ', gebruikers);
      ////console.log('Mockup aktiveGebruikers: ', aktieveGebruikers);
      sessieInit(gebruikerId);

      interval2 = $interval(function () {

        intervals.push({
          interval: interval2,
          gebruikerId: gebruikerId
        });
        //
        //  timeout stopt deze sessie na tussen de 5 en 30 minuten
        //  Binnen deze tijd kunnen divers andere events gestart worden
        //  Deze events moetn stoppen indien deze sessie gaat naar status pause
        //  en mogen weer gestart worden na status resume
        //
        timeout1 = setTimeout(function () {
          stopSessie(gebruikerId);
          ////console.error('Mockup sessie ready!!!!! Start nieuwe Sessie door TRINL te herstarten');
        }, Math.floor(Math.random() * 1000 * 60 * 30) + 5);
        timeouts.push({
          timeout: timeout1,
          gebruikerId: gebruikerId
        });
        timeout2 = setTimeout(function () {
          newKaartHeden(gebruikerId);
        }, Math.floor(Math.random() * 20000) + 60000);
        timeouts.push({
          timeout: timeout2,
          gebruikerId: gebruikerId
        });
        timeout3 = setTimeout(function () {
          newKaartThema(gebruikerId);
        }, Math.floor(Math.random() * 10000) + 60000);
        timeouts.push({
          timeout: timeout3,
          gebruikerId: gebruikerId
        });
        timeout4 = setTimeout(function () {
          newKaartVerleden(gebruikerId);
        }, Math.floor(Math.random() * 7000) + 60000);
        timeouts.push({
          timeout: timeout4,
          gebruikerId: gebruikerId
        });
        timeout5 = setTimeout(function () {
          startLaag(gebruikerId);
        }, Math.floor(Math.random() * 7000) + 60000);
        timeouts.push({
          timeout: timeout5,
          gebruikerId: gebruikerId
        });
      }, 4000);
      //
      //  SESSIE bijwerken met pause en resume
      //  Indien sessie is stop of pause dan overige events stoppen.
      //  Indien sessie is start (ook door resume) mogen de evnents weer gegenereerd worden
      //

      interval3 = $interval(function () {
        timeout6 = $timeout(function () {
          dataFactoryAnalytics.createEvent('sessie', 'app', 'pause', '', '0', gebruikerId);
        }, Math.floor(Math.random() * 7000) + 60000);
        timeouts.push({
          timeout: timeout7,
          gebruikerId: gebruikerId
        }, 10000);
        timeout7 = $timeout(function () {
          dataFactoryAnalytics.createEvent('sessie', 'app', 'resume', '', '0', gebruikerId);
        }, Math.floor(Math.random() * 300000) + 60000);
        timeouts.push({
          timeout: timeout8,
          gebruikerId: gebruikerId
        }, 10000);
      }, 600000);

    }
    */
    /*
     function stopSessie(gebruikerId) {
       ////console.log('Mockup stopSessie gebruikerId: ', gebruikerId);
       gebruikers.push(gebruikerId);
       loDash.remove(sessieStatus, function (oudeSessie) {
         return oudeSessie.gebruiker === gebruikerId;
       });
       dataFactoryAnalytics.createEvent('sessie', 'app', 'stop', '', '0', gebruikerId);

       ////console.log('Mockup gebruikers: ', gebruikers);
       ////console.log('Mockup sessieStatus: ', sessieStatus);
     }
     */
    /*
    function startMockup() {
      ////console.log('Mockup startMockup');
      interval1 = setInterval(function () {
        var gebruikerId = loDash.sample(gebruikers);
        if (gebruikerId) {
          startSessie(gebruikerId);
        }
      }, 2000);
    }
    */
    //genereerGebruikers();
    //startMockup();
    //stopAll();
    //
    //  Deze timer start regelmatig een uploadStore
    //  startTimer kijkt of er records in de store staan die nig naar de backend moeten
    //
    function startTimer() {

      ////console.warn('Analytics startTimer sec: ', intervalTime);

      interval = $interval(function () {
        if (debug) {
          ////console.warn('Analytics interval time to upload store');
        }
        uploadStore();
      }, intervalTime * 1000);
    }
    //
    //  Indien records in store stop de interval
    //  Upload records in store naar backend
    //  Maximaal storeMax aantal records via sendBuffer sturen naar backend
    //  Haal een aantal (storeMax) records uit de store en plaats deze in de sendBuffer
    //  Verstuur sendBuffer naar backend. Indien niet OK plaats de sendBuffer terug in de store.
    //
    //  Indien de store meer dan maxStore aantal records heeft worden de resterende records
    //  de volgende interval verstuurd.
    //
    function uploadStore() {

      var sendBuffer = [];

      if (store.length > 0) {
        //console.log('Analytics uploadStore store.length: ', store.length);
        if (interval) {
          $interval.cancel(interval);
        }
        var i = 0;
        for (i = 0; i < storeMax; i++) {
          var next = store.shift();
          if (next !== null) {
            sendBuffer.push(next);
          }
        }
        if (debug) {
          //console.log('Analytics uploadStore sendBuffer: ', JSON.stringify(sendBuffer), sendBuffer.length);
        }

        if (sendBuffer.length > 0) {
          //console.warn('Analytics uploadStore sendBufeer.length: ', sendBuffer.length);

          // eslint-disable-next-line no-unused-vars
          dataFactoryStore.addAnalytics(sendBuffer).then(function (result) {
            //console.log('Analytics sendBuffer RESULT: ', result);
            startTimer();
          // eslint-disable-next-line no-unused-vars
          }).catch(function (error) {
            //console.error('Analytics sendBuffer ERROR: ', error);
            store.unshift(sendBuffer);
            startTimer();
            if (debug) {
              //console.error('Analytics sendBuffer after restore sendBuffer: ', JSON.stringify(sendBuffer));
            }
          });
        } else {
          //console.warn('Analytics sendBuffer empty');
        }
      } else {
        //console.warn('Analytics store empty');
      }
    }
    /*
    Initialize store
    Start timer
    */
    function clearStore() {

      ////console.warn('Analytics clearStore en start startTimer Interval');
      store = [];
      startTimer();
    }
    /*
    Public function to create a analytic record
    */
    dataFactoryAnalytics.createEvent = function () {};

    dataFactoryAnalytics.zzzzzzzzzzzzzzzzzcreateEvent = function (sessie, xtype, xnaam, xindex, xon, gebruikerId) {

      if (debug) {
        ////console.warn('Analytics createEvent: ', sessie, xtype, xnaam, xindex, xon, gebruikerId);
        ////console.log('Analytics createEvent storeMaxAll, store.length: ', storeMaxAll, store.length);
      }
      if (store.length <= storeMaxAll) {
        var timestamp = $moment().format('YYYY-MM-DD HH:mm:ss');
        var event = {};
        event.Id = dataFactoryObjectId.create();
        event.createdOn = timestamp;
        if (!gebruikerId) {
          event.gebruikerId = localStorage.getItem('authentication_id');
        } else {
          event.gebruikerId = gebruikerId;
        }
        /*
    Indien = false dan moet in een vorige gelijksoortig record de duur gewijzigd worden.
    De duur is de tijd tussen tussen twee gelijksortige records (sub, sub1 en sub2)
    zoek het gelijksoortig event op met true => de datum is begin.
    In het current record is de datum einde

    Dit kan niet hier berkend worden omdat het begin record niet meer in de store hoeft te zijn.
    Het beginrecord kan reeds geupload zijn naar de backend.
    Het berkenen van de duur zla in de Analytic-monitor moeten gebeuren.
    Of in de backend bij upload??????
*/
        event.aantal = 0;

        if (xon !== '0' && xon !== '1') {
          if (debug) {
            ////console.error('Analytics createEvent Sub3 NOT 0 OR 1');
          }
        }

        if (sessie) {
          event.sessie = sessie;
        }
        if (xtype) {
          event.xtype = xtype;
        }
        if (xnaam) {
          event.xnaam = xnaam;
        } else {
          event.xnaam = ' ';
        }
        if (xindex) {
          event.xindex = xindex;
        } else {
          event.xindex = ' ';
        }
        if (xindex === 0) {
          event.xindex = '0';
        }
        if (xon) {
          event.xon = xon;
        } else {
          event.xon = '';
        }
        ////console.log('Analytics createEvent type, index, naam, index, on:', xtype, xindex, xnaam, xindex, xon);
        //
        // Nieuw time of sub nieuw record
        //
        store.push(event);
        if (store.length >= storeMax) {
          ////console.warn('Analytics createEvent maximum aantal records time to upload: ', store.length);
          uploadStore();
        }
        if (debug) {
          ////console.log('Analytics createEvent in store now: ', store);
        }
      }
    };

    $ionicPlatform.on('pause', function () {
      dataFactoryAnalytics.createEvent('trinl', 'app', 'pause', '', '0');
      if (debug) {
        ////console.warn('analytics create pause');
      }
    });

    $ionicPlatform.on('resume', function () {
      dataFactoryAnalytics.createEvent('trinl', 'app', 'resume', '', '1');
      if (debug) {
        ////console.warn('analytics create resume');
      }
    });

    return dataFactoryAnalytics;

  }
]);
