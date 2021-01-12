/* eslint-disable no-undef */
'use strict';

// eslint-disable-next-line no-undef
trinl.factory('dataFactoryDropbox', ['$rootScope', 'loDash', '$q', '$http', '$timeout', '$interval', '$ionicLoading', '$ionicPopup', '$cordovaInAppBrowser', 'dataFactoryCeo', 'dataFactoryConfig', 'dataFactoryConfigX',
  function ($rootScope, loDash, $q, $http, $timeout, $interval, $ionicLoading, $ionicPopup, $cordovaInAppBrowser, dataFactoryCeo, dataFactoryConfig, dataFactoryConfigX) {

    //console.warn('dataFactoryDropbox');

    var dataFactoryDropbox = {};

    dataFactoryDropbox.accessToken = null;
    dataFactoryDropbox.folderHistory = [];
    dataFactoryDropbox.appKey = null;
    dataFactoryDropbox.redirectURI = null;
    dataFactoryDropbox.url = null;
    dataFactoryDropbox.defaultFolder = '';
    dataFactoryDropbox.type = '';
    dataFactoryDropbox.updating = false;

    dataFactoryDropbox.appKey = '4s85su30h7byv7p';
    dataFactoryDropbox.redirectURI = 'http://localhost';
    dataFactoryDropbox.url = 'https://www.dropbox.com/oauth2/authorize?client_id=' + dataFactoryDropbox.appKey + '&redirect_uri=' + dataFactoryDropbox.redirectURI + '&response_type=token';


    dataFactoryDropbox.setType = function (type) {
      //console.error('dataFactoryDropbox setType: ', type);
      dataFactoryDropbox.type = type;
    };

    dataFactoryDropbox.updateAccessToken = function () {
      //console.log('dataFactoryDropbox updateAccessToken');
      //
      // Update accessToken in backend for users using the desktop-version of TRINL
      //
      dataFactoryConfig.currentModel.set('dbtoken', dataFactoryDropbox.accessToken);
      dataFactoryConfig.currentModel.set('dropbox', true);
      dataFactoryConfig.currentModel.set('hash', localStorage.getItem('trinlMachineId'));
      dataFactoryConfig.currentModel.set('appVersion', dataFactoryCeo.appVersion);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
    };

    $rootScope.$on('resetDropbox', function () {
      //console.log('dataFactoryDropbox resetDropbox');
      //
      // accessToken parkeren in tmp
      // dbtoken in backend wissen en updaten
      //
      var tmp = dataFactoryDropbox.accessToken;
      dataFactoryDropbox.accessToken = '';
      dataFactoryConfig.currentModel.set('dbtoken', '');
      dataFactoryConfig.currentModel.set('dropbox', false);
      dataFactoryConfig.currentModel.set('hash', localStorage.getItem('trinlMachineId'));
      dataFactoryConfig.currentModel.set('appVersion', dataFactoryCeo.appVersion);
      dataFactoryConfigX.update(dataFactoryConfig.currentModel);
      $cordovaInAppBrowser.open('https://www.dropbox.com/logout?client_id=' + dataFactoryDropbox.appKey, '_blank');
      $timeout(function () {
        $rootScope.$emit('resetDropboxReady');
      }, 1000);
      return $http({
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/auth/token/revoke',
        headers: {
          'Authorization': 'Bearer ' + tmp
        },
      });
    });

    $rootScope.$on('setDropbox', function () {
      //console.log('dataFactoryDropbox setDropbox');
      loginViaDropboxDialog();
      $timeout(function () {
        $rootScope.$emit('setDropboxReady');
      }, 1000);
    });

    dataFactoryDropbox.initfolderStructure = function () {

      //console.log('dataFactoryDropbox initFolderStructure initialize Dropbox Structuur');
      //console.log('dataFactoryDropbox initFolderStructure controleer mappen');
      dataFactoryDropbox.getFolders('').then(function (checkFoldersResult) {
        //console.log('dataFactoryDropbox initFolderStructure controleer mappen result');
        //console.table(checkFoldersResult.data.entries);
        if (checkFoldersResult.data.entries.length !== 3) {
          //console.log('dataFactoryDropbox initFolderStructure start createFolders');
          dataFactoryDropbox.createFolders().then(function (createFoldersResult) {
            //console.log('dataFactoryDropbox initFolderStructure createFolders createFoldersResult');
            //console.table(createFoldersResult.data.entries);
            if (createFoldersResult.data['.tag'] !== 'complete') {
              var jobId = createFoldersResult.data.async_job_id.substr(6);
              //console.log('dataFactoryDropbox initFolderStructure createFoldersFolder jobId: ', jobId);
              var intervalCreate = $interval(function () {

                //console.log('dataFactoryDropbox initFolderStructure start createFoldersCheck');
                dataFactoryDropbox.createFoldersCheck(jobId).then(function (createFoldersCheckResult) {
                  //console.log('dataFactoryDropbox initFolderStructure createFoldersCheck result');
                  //console.table(createFoldersCheckResult.data.entries);
                  if (createFoldersCheckResult.data['.tag'] === 'complete' || createFoldersResult.data['.tag'] === 'complete') {
                    $interval.cancel(intervalCreate);
                  }
                });
              }, 100, 10);
            }

            if (createFoldersResult.data.entries.length == 3) {

              $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br>Dropbox vereist 3 aparte mappen<br>voor Locaties, Fotos en Sporen.<br>Indien nodig worden die nu aangemaakt.<br>Vervolgens worden de Locaties gekopieerd<br>naar de map Locaties<br><br>Deze aanpassing wordt 1-malig uitgevoerd.<br><br>Dit kan even duren. Een ogenblik geduld aub.......'
              });
              dataFactoryDropbox.updating = true;

              //console.log('dataFactoryDropbox initFolderStructure start getFolders');
              dataFactoryDropbox.getFolders('').then(function (getFoldersResult) {
                if (getFoldersResult.data.entries.length > 0) {
                  //console.log('dataFactoryDropbox initFolderStructure getFolders result');
                  //console.table(getFoldersResult.data.entries);
                  var getEntries = getFoldersResult.data.entries;

                  if (getEntries.length > 0) {

                    //console.log('dataFactoryDropbox initFolderStructure start copyFolders');
                    dataFactoryDropbox.copyFolders(getEntries).then(function (copyFoldersResult) {
                      //console.log('dataFactoryDropbox initFolderStructure copyFolders copyFoldersResult');
                      //console.table(copyFoldersResult.data.entries);

                      if (copyFoldersResult.data['.tag'] == 'async_job_id') {
                        var copyjobId = copyFoldersResult.data.async_job_id;
                      }
                      //console.log('dataFactoryDropbox initFolderStructure copyFolders copyjobId: ', copyjobId);
                      var intervalCopy = $interval(function () {

                        dataFactoryDropbox.copyFoldersCheck(copyjobId).then(function (copyFoldersCheckResult) {
                          //console.log('dataFactoryDropbox initFolderStructure copyFoldersCheck result');
                          //console.log(copyFoldersCheckResult.data['.tag']);
                          if (copyFoldersCheckResult.data['.tag'] !== 'in_progress' || copyFoldersResult.data['.tag'] === 'complete') {
                            $interval.cancel(intervalCopy);
                            //console.log('dataFactoryDropbox initFolderStructure start deleteFolders');

                            $timeout(function () {
                              dataFactoryDropbox.deleteFolders(getEntries).then(function (deleteFoldersResult) {
                                //console.log('dataFactoryDropbox initFolderStructure deleteFolders result');
                                //console.table(deleteFoldersResult.data.entries);
                                if (deleteFoldersResult.data['.tag'] == 'async_job_id') {
                                  var deletejobId = deleteFoldersResult.data.async_job_id;
                                }
                                //console.log('dataFactoryDropbox initFolderStructure deleteFolders deletejobId: ', deletejobId);
                                var intervalDelete = $interval(function () {
                                  dataFactoryDropbox.deleteFoldersCheck(deletejobId).then(function (deleteFoldersCheckResult) {
                                    //console.log('dataFactoryDropbox initFolderStructure deleteFoldersCheck result');
                                    //console.log(deleteFoldersCheckResult.data['.tag']);
                                    if (deleteFoldersCheckResult.data['.tag'] !== 'in_progress' || deleteFoldersResult.data['.tag'] === 'complete') {
                                      $interval.cancel(intervalDelete);
                                      $ionicLoading.hide();
                                      dataFactoryDropbox.updating = false;
                                    }
                                  });
                                }, 600);
                              });
                            }, 1000);
                          }
                        });
                      }, 600);
                    }).catch(function () {
                      if (dataFactoryDropbox.updating) {
                        //console.log('dataFactoryDropbox initFolderStructure initFolders hide 1');
                        $ionicLoading.hide();
                        dataFactoryDropbox.updating = false;
                      }
                    });
                  } else {
                    if (dataFactoryDropbox.updating) {
                      //console.log('dataFactoryDropbox initFolderStructure initFolders hide 2');
                      $ionicLoading.hide();
                      dataFactoryDropbox.updating = false;
                    }
                  }
                } else {
                  if (dataFactoryDropbox.updating) {
                    //console.log('dataFactoryDropbox initFolderStructure initFolders hide 3');
                    $ionicLoading.hide();
                    dataFactoryDropbox.updating = false;
                  }
                }

              }).catch(function () {
                if (dataFactoryDropbox.updating) {
                  //console.log('dataFactoryDropbox initFolderStructure initFolders hide 4');
                  $ionicLoading.hide();
                  dataFactoryDropbox.updating = false;
                }
              });
            } else {
              if (dataFactoryDropbox.updating) {
                //console.log('dataFactoryDropbox initFolderStructure initFolders hide 5');
                $ionicLoading.hide();
                dataFactoryDropbox.updating = false;
              }
              //console.log('dataFactoryDropbox initFolderStructure initFolders result moet 3 items hebben: ', createFoldersResult.data.entries, createFoldersResult.data.entries.length);
            }
          });
        } else {
          //console.log('dataFactoryDropbox initFolderStructure reeds 3 mappen aanwezig');
        }
      }).catch(function () {
        /*
        $ionicPopup.alert({
          title: 'Dropbox probleem',
          template: 'Dropbox kan bestanden niet lezen. Waarschijnlijk is Dropbox niet meer gekoppeld aan TRINL.<br><br><span class="trinl-rood">' + err.data.error['.tag'] + '</span><br><br>Probeer met Dropbox ontkoppelen en opnieuw koppelen'
        });
        */
      });
    };
    //
    // Wacht op
    $timeout(function () {

      //console.log('dataFactoryDropbox wacht op token en controleer dan de mappenStructuur');

      var structureInterval = $interval(function () {
        //console.warn('dataFactoryDropbox initStructure wacht op token.......  ', dataFactoryDropbox.accessToken);
        dataFactoryDropbox.login().then(function () {

          if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
            //console.warn('dataFactoryDropbox accessToken found: ', dataFactoryDropbox.accessToken);
            $interval.cancel(structureInterval);
            dataFactoryDropbox.initfolderStructure();
          }
        }).catch(function () {

          $ionicPopup.alert({
            title: 'Dropbox probleem',
            template: 'Dropbox kan bestanden niet lezen. Waarschijnlijk is Dropbox niet meer gekoppeld aan TRINL.<br><br><span class="trinl-rood">' + err.data.error['.tag'] + '</span><br><br>Probeer met Dropbox ontkoppelen en opnieuw koppelen'
          });

        });
      }, 800, 6);
    }, 1000);

    function loginViaDropboxDialog() {
      if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {

        //console.log('dataFactoryDropbox.login');

        if (!dataFactoryDropbox.accessToken) {

          //console.error('dataFactoryDropbox.login via login dialog from Dropbox');
          //console.log('dataFactoryDropbox.login mobile device url: ', dataFactoryDropbox.url);

          $cordovaInAppBrowser.open(dataFactoryDropbox.url, '_blank').then(function () {

            //console.error('result');

            var interval = $interval(function () {

              //console.log('dataFcatory.login mobile device waiting for token');

              if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
                $interval.cancel(interval);
                //console.log('dataFcatory.login mobile device token SUCCESS: ', dataFactoryDropbox.accessToken);
                dataFactoryDropbox.updateAccessToken();
                q.resolve();
              } else {
                //console.log('Dropbox!!!!!!');
              }
            }, 700, 200);

          }).catch(function (event) {

            $ionicPopup.alert({
              title: 'Koppelen Dropbox',
              template: 'Onbekende fout is opgetreden bij koppelen aan Dropbox.<br>' + JSON.stringify(event)
            });

            //console.error('dataFactoryDropbox.login mobile device browser open ERROR event: ', event);

            q.resolve();
          });
        } else {

          $ionicPopup.alert({
            title: 'Koppelen Dropbox',
            template: 'TRINL is reeds gekoppeld an Dropbox!'
          });
          //console.log('dataFacatory.login token reeds bekend: ', dataFactoryDropbox.accessToken);
          q.resolve();
        }
      } else {
        $ionicPopup.alert({
          title: 'Koppelen Dropbox',
          template: 'Koppelen aan Dropbox is uitsluitend mogelijk op een mobiel apparaat.'
        });

        //console.log('dataFacatory.login niet via Login van Dropbox (ONLY Mobile): ');
        q.resolve();
      }
    }
    //
    // Controleer of de gebruiker is ingelogd (heeft dbToken from backend)
    //
    dataFactoryDropbox.login = function () {

      var q = $q.defer();
      //
      // Initialize dataFactoryDropbox.accessToken
      //
      //console.log('dataFactoryDropbox accessToken: ', dataFactoryDropbox.accessToken);
      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        //console.log('dataFactoryDropbox reeds bekend accessToken: ', dataFactoryDropbox.accessToken);
        q.resolve();
      } else {
        //
        //  Timer voor timeout
        //
        var timer = $timeout(function () {
          //console.log('dataFactoryDropbox login get token from backend TIMEOUT 5 sec');
          q.resolve();
        }, 5010);

        var interval = $interval(function () {
          //console.log('dataFactoryDropbox login wachten op dataFactoryConfig.currentModel...................');
          if (!loDash.isEmpty(dataFactoryConfig.currentModel)) {
            $interval.cancel(interval);
            $timeout.cancel(timer);
            dataFactoryDropbox.accessToken = dataFactoryConfig.currentModel.get('dbtoken');
            //console.log('dataFactoryDropbox login dataFactoryConfig.currentModel, accessToken found: ', dataFactoryConfig.currentModel, dataFactoryDropbox.accessToken);

            q.resolve();
          }
        }, 200, 25);
      }

      return q.promise;
    };
    //
    // Dit event wordt getriggerd als tijdens inloggen een InAppBrower wordt geopen om in te loggen
    // bij Dropbox. Dit event set de accessToken ontvangen van Dropbox in accessToken en update naar backend
    //
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {

      //console.log('dataFactoryDropbox cordovaInAppBrowser:loadstart: ', event);

      if (event.url.indexOf('oauth2/authorize') > -1) {
        return;
      }

      if (event.url.indexOf('logout') > -1) {
        $cordovaInAppBrowser.close();
        return;
      }

      if (event.url.indexOf('login') > -1) {
        $cordovaInAppBrowser.close();
        return;
      }
      //console.log('Dropbox mobile device loadStart event: ', event);
      if (event.url.indexOf(dataFactoryDropbox.redirectURI) > -1) {
        $cordovaInAppBrowser.close();
        var token = event.url.split('=')[1].split('&')[0];
        dataFactoryDropbox.accessToken = token;
        //console.log('Dropbox mobile device loadStart token: ', token);
        dataFactoryDropbox.updateAccessToken();
        $timeout(function () {
          dataFactoryDropbox.initfolderStructure();
          //return dataFactoryDropbox.accessToken;
        }, 1000);

      }
    });

    function makeid(num) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < num; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    }

    dataFactoryDropbox.getUserInfo = function () {

      //console.log('dataFacatory.getUserInfo met accessToken: ', dataFactoryDropbox.accessToken);

      dataFactoryDropbox.login();

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/2/users/get_current_account',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken
          },
        });
      }
    };

    dataFactoryDropbox.createFolders = function () {

      //console.warn('dataFacatoryDropbox createFolders');

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {

        return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/2/files/create_folder_batch',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
            'Content-Type': 'application/json'
          },
          data: {
            paths: [
              dataFactoryDropbox.defaultFolder + '/Fotos',
              dataFactoryDropbox.defaultFolder + '/Locaties',
              dataFactoryDropbox.defaultFolder + '/Sporen'
            ],
            'autorename': false,
            'force_async': false
          }
        });
      }
    };

    dataFactoryDropbox.createFoldersCheck = function (createBatchId) {

      //console.log('dataFacatoryDropbox createFoldersCheck createBatchId: ', createBatchId);
      return $http({
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/files/create_batch/check',
        headers: {
          'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
          'Content-Type': 'application/json'
        },
        data: {
          'async_job_id': createBatchId,
        }
      });
    };

    dataFactoryDropbox.copyFolders = function (entries) {

      //console.log('dataFacatoryDropbox copyFolders');

      var fromFolder = loDash.filter(entries, function (item) {
        return item['.tag'] === 'file';
      });
      //console.log('dataFactoryDropbox copyFolders fromFiles');
      //console.table(fromFolder);

      var tmp = [];
      loDash.each(fromFolder, function (item) {
        tmp.push({
          'from_path': dataFactoryDropbox.defaultFolder + '/' + item.name,
          'to_path': dataFactoryDropbox.defaultFolder + '/Locaties/' + item.name
        });
      });
      //console.log('dataFactoryDropbox copyFolders tmp');
      //console.table(tmp);

      return $http({
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/files/copy_batch_v2',
        headers: {
          'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
          'Content-Type': 'application/json'
        },
        data: {
          'entries': tmp,
          'autorename': false
        }
      });
    };

    dataFactoryDropbox.copyFoldersCheck = function (copyBatchId) {

      //console.log('dataFacatoryDropbox copyFoldersCheck copyBatchId accessToken: ', copyBatchId, dataFactoryDropbox.accessToken);

      return $http({
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/files/copy_batch/check_v2',
        headers: {
          'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
          'Content-Type': 'application/json'
        },
        data: {
          'async_job_id': copyBatchId,
        }
      });
    };

    dataFactoryDropbox.deleteFolders = function (entries) {

      //console.log('dataFacatoryDropbox deleteFolders');

      var fromFolder = loDash.filter(entries, function (item) {
        return item['.tag'] === 'file';
      });
      //console.log('dataFactoryDropbox deleteFolders fromFiles');
      //console.table(fromFolder);

      var tmp = [];
      loDash.each(fromFolder, function (item) {
        tmp.push({
          'path': dataFactoryDropbox.defaultFolder + '/' + item.name,
        });
      });

      return $http({
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/files/delete_batch',
        headers: {
          'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
          'Content-Type': 'application/json'
        },
        data: {
          'entries': tmp,
        }
      });
    };

    dataFactoryDropbox.deleteFoldersCheck = function (deleteBatchId) {

      //console.log('dataFacatoryDropbox deleteFoldersCheck deleteBatchId: ', deleteBatchId);

      return $http({
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/files/delete_batch/check',
        headers: {
          'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
          'Content-Type': 'application/json'
        },
        data: {
          'async_job_id': deleteBatchId,
        }
      });
    };

    dataFactoryDropbox.createTRINLFolder = function (path) {

      //console.log('dataFacatory.createTRINLFolder met accessToken, path: ', dataFactoryDropbox.accessToken, path);

      dataFactoryDropbox.login();

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        var folderPath;

        if (!path) {
          //folderPath = dataFactoryDropbox.defaultFolder;
          folderPath = dataFactoryDropbox.type;
        } else {
          folderPath = path;
        }

        //console.log('dataFactoryDropbox createTRINLFolder  folderPath: ', folderPath);

        return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/2/files/create_folder_v2',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
            'Content-Type': 'application/json'
          },
          data: {
            'path': folderPath,
            'autorename': false
          }
        });
      }
    };

    dataFactoryDropbox.uploadGetSharedLink = function (folderPath, folderFile) {

      var parameters = {
        'url': folderPath,
        'path': folderFile
      };

      return $http({
        method: 'POST',
        url: 'https://content.dropboxapi.com/2/sharing/get_shared_link_file',
        headers: {
          'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
          'Dropbox-API-Arg': JSON.stringify(parameters),
          'Content-Type': 'application/octet-stream'
        }
      });

    };

    dataFactoryDropbox.upload = function (data, file, path, mode) {

      if (!mode) {
        mode = 'overwrite';
      }
      //console.log('dataFacatory.upload met accessToken, data, file, path: ', dataFactoryDropbox.accessToken, data, file, path, dataFactoryDropbox.type);

      dataFactoryDropbox.login();

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        var folderPath, folderFile;

        if (!path) {
          //folderPath = dataFactoryDropbox.defaultFolder;
          folderPath = dataFactoryDropbox.type;
        } else {
          folderPath = path;
        }

        if (!file) {
          folderFile = makeid(20);
        } else {
          folderFile = file;
        }

        var parameters = {
          'path': folderPath + '/' + folderFile,
          'mode': mode,
          'autorename': false,
          'mute': false
        };

        //console.log('dataFactoryDropbox uploadFile paramaters: ', parameters);

        return $http({
          method: 'POST',
          url: 'https://content.dropboxapi.com/2/files/upload',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
            'Dropbox-API-Arg': JSON.stringify(parameters),
            'Content-Type': 'application/octet-stream'
          },
          data: data
        });
      }
    };

    dataFactoryDropbox.uploadFoto = function (imageData, file, path, mode) {

      //console.log('dataFacatory.upload met accessToken, data, file, path: ', dataFactoryDropbox.accessToken, data, file, path, dataFactoryDropbox.type);
      if (!mode ) {
        mode = 'overwrite';
      }

      dataFactoryDropbox.login();

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        var folderPath, folderFile;

        if (!path) {
          //folderPath = dataFactoryDropbox.defaultFolder;
          folderPath = dataFactoryDropbox.type;
        } else {
          folderPath = path;
        }

        if (!file) {
          folderFile = makeid(20);
        } else {
          folderFile = file;
        }

        var parameters = {
          'contents': '@'+ imageData, 
          'path': folderPath + '/' + folderFile,
          'mode': 'overwrite',
          'autorename': false,
          'mute': false
        };
        var parameterStr = JSON.stringify(parameters);
        console.log('dataFactoryDropbox uploadFile paramaters: ', parameterStr);
        var contentType = 'application/octet-stream';
        console.log('dataFactoryDropbox uploadFile contentType: ', contentType);

        return $http({
          method: 'POST',
          url: 'https://content.dropboxapi.com/2/files/upload',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
            'Dropbox-API-Arg': parameterStr,
            'Content-Type': contentType
          }
        });
      }
    };

    dataFactoryDropbox.download = function (folderPath) {

      //console.error('dataFactoryDropbox.download met accessToken: ', dataFactoryDropbox.accessToken);
      //console.log('dataFactoryDropbox.download folderPath: ', folderPath);

      dataFactoryDropbox.login();

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        var downloadPath = {
          path: folderPath
        };

        return $http({
          method: 'POST',
          url: 'https://content.dropboxapi.com/2/files/download',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
            'Dropbox-API-Arg': JSON.stringify(downloadPath)
          },
        });
      }

    };

    dataFactoryDropbox.getFolders = function (path) {

      //console.log('dataFactoryDropbox.getFolders met accessToken, path: ', dataFactoryDropbox.accessToken, path);

      dataFactoryDropbox.login();

      if (dataFactoryDropbox.accessToken !== null && dataFactoryDropbox.accessToken.length > 0) {
        var folderPath;

        if (!path) {
          folderPath = '';
        } else {
          folderPath = path;

          if (dataFactoryDropbox.folderHistory[dataFactoryDropbox.folderHistory.length - 1] !== path) {
            dataFactoryDropbox.folderHistory.push(path);
          }

        }

        //console.log('dataFactoryDropbox.getFolders folderPath: ', folderPath);

        return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/2/files/list_folder',
          headers: {
            'Authorization': 'Bearer ' + dataFactoryDropbox.accessToken,
            'Content-Type': 'application/json'
          },
          data: {
            'path': folderPath,
            'recursive': false,
            'include_media_info': false,
            'include_deleted': false,
            'include_has_explicit_shared_members': false,
            'include_mounted_folders': true
          }
        });
      }
    };

    dataFactoryDropbox.goBackFolder = function () {

      if (dataFactoryDropbox.folderHistory.length > 0) {

        dataFactoryDropbox.folderHistory.pop();
        var path = dataFactoryDropbox.folderHistory[dataFactoryDropbox.folderHistory.length - 1];

        return dataFactoryDropbox.getFolders(path);
      } else {
        return dataFactoryDropbox.getFolders();
      }
    };

    return dataFactoryDropbox;
  }
]);
