/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.factory('dataFactoryClock', ['$interval',
  function ($interval) {

    var fast = 5000;
    var medium = 10000;
    var slow = 20000;

    //fast = 10000;
    //medium = 15000;
    //slow = 20000;

    var clockBericht = null;
    var clockBerichtCard = null;
    var clockFoto = null;
    var clockFotoCard = null;
    var clockPoi = null;
    var clockPoiCard = null;
    var clockTrack = null;
    var clockTrackCard = null;

    var service = {

      stopClockBericht: function () {
        //console.error('Clock stopClockBericht');
        if (clockBericht !== null) {
          $interval.cancel(clockBericht);
          clockBericht = null;
        }
      },
      startClockBerichtFast: function (fn) {
        //console.error('Clock startClockBerichtFast');
        if (clockBericht !== null) {
          $interval.cancel(clockBericht);
          clockBericht = null;
        }
        clockBericht = $interval(fn, fast);
      },
      startClockBerichtMedium: function (fn) {
        //console.error('Clock startClockBerichtMedium');
        if (clockBericht !== null) {
          $interval.cancel(clockBericht);
          clockBericht = null;
        }
        clockBericht = $interval(fn, medium);
      },
      startClockBerichtSlow: function (fn) {
        //console.error('Clock startClockBerichtSlow');
        if (clockBericht !== null) {
          $interval.cancel(clockBericht);
          clockBericht = null;
        }
        clockBericht = $interval(fn, slow);
      },

      stopClockBerichtCard: function () {
        //console.error('Clock stopClockBerichtCard');
        if (clockBerichtCard !== null) {
          $interval.cancel(clockBerichtCard);
          clockBerichtCard = null;
        }
      },
      startClockBerichtCardFast: function (fn) {
        //console.error('Clock startClockBerichtCardFast');
        if (clockBerichtCard !== null) {
          $interval.cancel(clockBerichtCard);
          clockBerichtCard = null;
        }
        clockBerichtCard = $interval(fn, fast);
      },
      startClockBerichtCardMedium: function (fn) {
        //console.error('Clock startClockBerichtCardMedium');
        if (clockBerichtCard !== null) {
          $interval.cancel(clockBerichtCard);
          clockBerichtCard = null;
        }
        clockBerichtCard = $interval(fn, medium);
      },
      startClockBerichtCardSlow: function (fn) {
        //console.error('Clock startClockBerichtCardSlow');
        if (clockBerichtCard !== null) {
          $interval.cancel(clockBerichtCard);
          clockBerichtCard = null;
        }
        clockBerichtCard = $interval(fn, slow);
      },


      stopClockFoto: function () {
        //console.error('Clock stopClockFoto');
        if (clockFoto !== null) {
          $interval.cancel(clockFoto);
          clockFoto = null;
        }
      },
      startClockFotoFast: function (fn) {
        //console.error('Clock startClockFotoFast');
        if (clockFoto !== null) {
          $interval.cancel(clockFoto);
          clockFoto = null;
        }
        clockFoto = $interval(fn, fast);
      },
      startClockFotoMedium: function (fn) {
        //console.error('Clock startClockFotoMedium');
        if (clockFoto !== null) {
          $interval.cancel(clockFoto);
          clockFoto = null;
        }
        clockFoto = $interval(fn, medium);
      },
      startClockFotoSlow: function (fn) {
        //console.error('Clock startClockFotoSlow');
        if (clockFoto !== null) {
          $interval.cancel(clockFoto);
          clockFoto = null;
        }
        clockFoto = $interval(fn, slow);
      },

      stopClockFotoCard: function () {
        //console.error('Clock stopClockFotoCard');
        if (clockFotoCard !== null) {
          $interval.cancel(clockFotoCard);
          clockFotoCard = null;
        }
      },
      startClockFotoCardFast: function (fn) {
        //console.error('Clock startClockFotoCardFast');
        if (clockFotoCard !== null) {
          $interval.cancel(clockFotoCard);
          clockFotoCard = null;
        }
        clockFotoCard = $interval(fn, fast);
      },
      startClockFotoCardMedium: function (fn) {
        //console.error('Clock startClockFotoCardMedium');
        if (clockFotoCard !== null) {
          $interval.cancel(clockFotoCard);
          clockFotoCard = null;
        }
        clockFotoCard = $interval(fn, medium);
      },
      startClockFotoCardSlow: function (fn) {
        //console.error('Clock startClockFotoCardSlow');
        if (clockFotoCard !== null) {
          $interval.cancel(clockFotoCard);
          clockFotoCard = null;
        }
        clockFotoCard = $interval(fn, slow);
      },

      stopClockPoi: function () {
        //console.error('Clock stopClockPoi');
        if (clockPoi !== null) {
          $interval.cancel(clockPoi);
          clockPoi = null;
        }
      },
      startClockPoiFast: function (fn) {
        //console.error('Clock startClockPoiFast');
        if (clockPoi !== null) {
          $interval.cancel(clockPoi);
          clockPoi = null;
        }
        clockPoi = $interval(fn, fast);
      },
      startClockPoiMedium: function (fn) {
        //console.error('Clock startClockPoiMedium');
        if (clockPoi !== null) {
          $interval.cancel(clockPoi);
          clockPoi = null;
        }
        clockPoi = $interval(fn, medium);

      },
      startClockPoiSlow: function (fn) {
        //console.error('Clock startClockPoiSlow');
        if (clockPoi !== null) {
          $interval.cancel(clockPoi);
          clockPoi = null;
        }
        clockPoi = $interval(fn, slow);
      },

      stopClockPoiCard: function () {
        //console.error('Clock stopClockPoiCard');
        if (clockPoiCard !== null) {
          $interval.cancel(clockPoiCard);
          clockPoiCard = null;
        }
      },

      startClockPoiCardFast: function (fn) {
        //console.error('Clock startClockPoiCardFast');
        if (clockPoiCard !== null) {
          $interval.cancel(clockPoiCard);
          clockPoiCard = null;
        }
        clockPoiCard = $interval(fn, fast);
      },
      /*
      startClockPoiCardMedium: function (fn) {
        //console.error('Clock startClockPoiCardMedium');
        if (clockPoiCard !== null) {
          $interval.cancel(clockPoiCard);
          clockPoiCard = null;
        }
        clockPoiCard = $interval(fn, medium);
      },
      startClockPoiCardSlow: function (fn) {
        //console.error('Clock startClockPoiCardSlow');
        if (clockPoiCard !== null) {
          $interval.cancel(clockPoiCard);
          clockPoiCard = null;
        }
        clockPoiCard = $interval(fn, slow);
      },
      */
      stopClockTrack: function () {
        //console.error('Clock stopClockTrack');
        if (clockTrack !== null) {
          $interval.cancel(clockTrack);
          clockTrack = null;
        }
      },
      startClockTrackFast: function (fn) {
        //console.error('Clock startClockTrackFast');
        if (clockTrack !== null) {
          $interval.cancel(clockTrack);
          clockTrack = null;
        }
        clockTrack = $interval(fn, fast);
      },
      startClockTrackMedium: function (fn) {
        //console.error('Clock startClockTrackMedium');
        if (clockTrack !== null) {
          $interval.cancel(clockTrack);
          clockTrack = null;
        }
        clockTrack = $interval(fn, medium);
      },
      startClockTrackSlow: function (fn) {
        //console.error('Clock startClockTrackSlow');
        if (clockTrack !== null) {
          $interval.cancel(clockTrack);
          clockTrack = null;
        }
        clockTrack = $interval(fn, slow);
      },

      stopClockTrackCard: function () {
        //console.error('Clock stopClockTrackCard');
        if (clockTrackCard !== null) {
          $interval.cancel(clockTrackCard);
          clockTrackCard = null;
        }
      },
      startClockTrackCardFast: function (fn) {
        //console.error('Clock startClockTrackCardFast');
        if (clockTrackCard !== null) {
          $interval.cancel(clockTrackCard);
          clockTrackCard = null;
        }
        clockTrackCard = $interval(fn, fast);
      },
      startClockTrackCardMedium: function (fn) {
        //console.error('Clock startClockTrackCardMedium');
        if (clockTrackCard !== null) {
          $interval.cancel(clockTrackCard);
          clockTrackCard = null;
        }
        clockTrackCard = $interval(fn, medium);
      },
      startClockTrackCardSlow: function (fn) {
        //console.error('Clock startClockTrackCardSlow');
        if (clockTrackCard !== null) {
          $interval.cancel(clockTrackCard);
          clockTrackCard = null;
        }
        clockTrackCard = $interval(fn, slow);
      }
    };

    return service;
  }
]);
