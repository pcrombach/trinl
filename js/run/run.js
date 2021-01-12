/* eslint-disable no-misleading-character-class */
/* eslint-disable no-control-regex */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

trinl.run(['$rootScope', 'loDash', '$interval', '$http', '$cordovaStatusbar', '$cordovaNetwork', '$ionicPlatform', 'dataFactoryCodePush', 'dataFactoryFoto', 'dataFactoryPoi', 'dataFactoryTrack', 'dataFactoryConfig', 'dataFactoryCeo', 'amMoment',
  function ($rootScope, loDash, $interval, $http, $cordovaStatusbar, $cordovaNetwork, $ionicPlatform, dataFactoryCodePush, dataFactoryFoto, dataFactoryPoi, dataFactoryTrack, dataFactoryConfig, dataFactoryCeo, amMoment) {

    //console.warn('run');
    //console.time('InitialLoad');
    /**
     * Status van network
     * @type {String}
     */
    var networkState = '';
    /**
     * is FileSystem ready
     * @type {Boolean}
     */
    var fsready = false;

    var md;

    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
      //console.error('WEB_AUDIO RESUME MOBILE: ', AudioContext || webkitAudioContext);
      dataFactoryFoto.audioResume = true;
      dataFactoryPoi.audioResume = true;
      dataFactoryTrack.audioResume = true;
    } else {
      if (typeof AudioContext != 'undefined' || typeof webkitAudioContext != 'undefined') {
        //console.error('AUDIOCONTEXT');
        var resumeAudio = function () {
          //console.error('WEB_AUDIO RESUME: ', AudioContext || webkitAudioContext);
          dataFactoryFoto.audioResume = true;
          dataFactoryPoi.audioResume = true;
          dataFactoryTrack.audioResume = true;
          if (typeof g_WebAudioContext == 'undefined' || g_WebAudioContext == null) return;
          if (g_WebAudioContext.state == 'suspended') g_WebAudioContext.resume();
          document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('click', resumeAudio);
      }
    }
    $http.get('config.json').then(function (record) {

      //console.log('Run config.json read record: ', record);

      dataFactoryCeo.appVersion = record.data.widget.version || record.data.widget.$.version;

      //console.warn('Run event appVersionReady: ', dataFactoryCeo.appVersion);

      localStorage.setItem('authentication_appVersion', record.data.widget.version);
      localStorage.setItem('authentication_appVersion', dataFactoryCeo.appVersion);

      $rootScope.$emit('appVersionReady', {
        message: 'AppVersionReady: ' + dataFactoryCeo.appVersion,
        version: dataFactoryCeo.appVersion
      });
    });

    window.addEventListener('filePluginIsReady', function () {
      //console.log('File plugin is ready');
    }, false);

    $ionicPlatform.ready(function () {

      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

        codePush.notifyApplicationReady();
        cordova.plugins.notification.local.cancelAll('0');

        var interval = $interval(function () {
          //console.count('RUN waiting for config....');
          if (!angular.equals(dataFactoryConfig.currentModel, {})) {
            $interval.cancel(interval);
            ////console.error('Run xupdate: ', dataFactoryConfig.currentModel.get('xupdate'));
            if (dataFactoryConfig.currentModel.get('xupdate')) {
              dataFactoryCodePush.doUpdate();
            }
          }
        }, 100, 200);
      }
    });

    $rootScope.$on('codePushprogress', function (event, progress) {
      //console.error('Run from codePush event progress: ', progress);
      //console.log('Run ReceivedBytes from totalBytes ' + progress.receivedBytes + ' of ' + progress.totalBytes + ' bytes.');
      //console.log('Run Downloading Moet gedeeld door 100 voor progress-indicator: ' + parseInt(progress.receivedBytes / (progress.totalBytes / 100), 10) + ' %.');
    });

    $rootScope.$on('codePushlocalPackage', function (event, localPackage) {
      //console.error('Run from codePush event localPackage: ', localPackage);
      //console.log('Run localPackage description: ', localPackage.description);
      //console.log('Run localPackage appVerion: ', localPackage.appVersion);
      //console.log('Run localPackage mandatory: ', localPackage.isMandatory);

    });

    $ionicPlatform.ready(function () {
      if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        if (ionic.Platform.isIOS()) {
          ionic.Platform.fullScreen();
        }

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          $cordovaStatusbar.hide();
          md = cordova.require('cordova/plugin_list').metadata;


          //console.log('Run Plugin_list: ', md, loDash.has(md, 'cordova-plugin-notification-local'));

          networkState = $cordovaNetwork.getNetwork();

        }
      }
    });

    $rootScope.$on('FSReady', function () {
      //console.warn('App FSReady');
      fsready = true;
    });

    amMoment.changeLanguage('nl');

    // JSON.pruned : a function to stringify any object without overflow
    // example : var json = JSON.pruned({a:'e', c:[1,2,{d:{e:42, f:'deep'}}]})
    // two additional optional parameters :
    //   - the maximal depth (default : 6)
    //   - the maximal length of arrays (default : 50)
    // GitHub : https://github.com/Canop/JSON.prune
    // This is based on Douglas Crockford's code ( https://github.com/douglascrockford/JSON-js/blob/master/json2.js )
    (function () {
      'use strict';

      //var DEFAULT_MAX_DEPTH = 6;
      //var DEFAULT_ARRAY_MAX_LENGTH = 50;
      var DEFAULT_MAX_DEPTH = 10;
      var DEFAULT_ARRAY_MAX_LENGTH = 100;
      var seen; // Same variable used for all stringifications

      Date.prototype.toPrunedJSON = Date.prototype.toJSON;
      String.prototype.toPrunedJSON = String.prototype.toJSON;

      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        // eslint-disable-next-line no-useless-escape
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = { // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"': '\\"',
          '\\': '\\\\'
        };

      function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ?
            c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }

      function str(key, holder, depthDecr, arrayMaxLength) {
        var i, // The loop counter.
          k, // The member key.
          v, // The member value.
          length,
          partial,
          value = holder[key];
        if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
          value = value.toPrunedJSON(key);
        }

        switch (typeof value) {
          case 'string':
            return quote(value);
          case 'number':
            return isFinite(value) ? String(value) : 'null';
          case 'boolean':
          case 'null':
            return String(value);
          case 'object':
            if (!value) {
              return 'null';
            }
            if (depthDecr <= 0 || seen.indexOf(value) !== -1) {
              return '"-pruned-"';
            }
            seen.push(value);
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
              length = Math.min(value.length, arrayMaxLength);
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value, depthDecr - 1, arrayMaxLength) || 'null';
              }
              v = partial.length === 0 ?
                '[]' :
                '[' + partial.join(',') + ']';
              return v;
            }
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                try {
                  v = str(k, value, depthDecr - 1, arrayMaxLength);
                  if (v) partial.push(quote(k) + ':' + v);
                } catch (e) {
                  // this try/catch due to some "Accessing selectionEnd on an input element that cannot have a selection." on Chrome
                }
              }
            }
            v = partial.length === 0 ?
              '{}' :
              '{' + partial.join(',') + '}';
            return v;
        }
      }

      JSON.pruned = function (value, depthDecr, arrayMaxLength) {
        seen = [];
        depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
        arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
        return str('', {
          '': value
        }, depthDecr, arrayMaxLength);
      };

    }());

  }
]);
