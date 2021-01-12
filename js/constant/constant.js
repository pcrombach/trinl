/* eslint-disable no-undef */
'use strict';
/**
 * @class constant
 * URL configuration to switch between server environment
 * URL '' default is 'https://www.trinl.nl/'
 * @return {Object} constant
 */
//var trinl;
//
// Deze constant redirect de app running op mobile devices
//
trinl.constant(
  'BASE', {
    'WEB_PUSH_URL': 'https://quitteapp.nl/pushserver',
    //'WEB_PUSH_URL': 'http://localhost:4040',
    //'URL': ''
    //'URL': 'http://localhost/trinl/'
    'URL': 'https://www.trinl.nl/'
    //'URL': 'https://www.pcmatic.nl/'
  });
