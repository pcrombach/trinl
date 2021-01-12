var dbVer = '5';
var db;

var request = indexedDB.open('trinlSyncDB', dbVer);
request.onsuccess = function (evt) {
  db = evt.target.result;
  //console.log('IndexedDB OK!!!!!! ', dbVer);
};
request.onupgradeneeded = function (evt) {

  db = evt.target.result;

  if (db.objectStoreNames.contains('analytics')) {
    db.deleteObjectStore('analytics');
  }
  db.createObjectStore('analytics', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('blacklist')) {
    db.deleteObjectStore('blacklist');
  }
  db.createObjectStore('blacklist', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('ceo')) {
    db.deleteObjectStore('ceo');
  }
  db.createObjectStore('ceo', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('config')) {
    db.deleteObjectStore('config');
  }
  db.createObjectStore('config', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('bericht')) {
    db.deleteObjectStore('bericht');
  }
  db.createObjectStore('bericht', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('berichtsup')) {
    db.deleteObjectStore('berichtsup');
  }
  db.createObjectStore('berichtsup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('berichttag')) {
    db.deleteObjectStore('berichttag');
  }
  db.createObjectStore('berichttag', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('berichtreactie')) {
    db.deleteObjectStore('berichtreactie');
  }
  db.createObjectStore('berichtreactie', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('berichtreactiesup')) {
    db.deleteObjectStore('berichtreactiesup');
  }
  db.createObjectStore('berichtreactiesup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('foto')) {
    db.deleteObjectStore('foto');
  }
  db.createObjectStore('foto', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('fotosup')) {
    db.deleteObjectStore('fotosup');
  }
  db.createObjectStore('fotosup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('fototag')) {
    db.deleteObjectStore('fototag');
  }
  db.createObjectStore('fototag', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('fotoreactie')) {
    db.deleteObjectStore('fotoreactie');
  }
  db.createObjectStore('fotoreactie', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('fotoreactiesup')) {
    db.deleteObjectStore('fotoreactiesup');
  }
  db.createObjectStore('fotoreactiesup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('groepdeelnemers')) {
    db.deleteObjectStore('groepdeelnemers');
  }
  db.createObjectStore('groepdeelnemers', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('groepen')) {
    db.deleteObjectStore('groepen');
  }
  db.createObjectStore('groepen', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('help')) {
    db.deleteObjectStore('help');
  }
  db.createObjectStore('help', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('poi')) {
    db.deleteObjectStore('poi');
  }
  db.createObjectStore('poi', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('poisup')) {
    db.deleteObjectStore('poisup');
  }
  db.createObjectStore('poisup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('poitag')) {
    db.deleteObjectStore('poitag');
  }
  db.createObjectStore('poitag', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('poireactie')) {
    db.deleteObjectStore('poireactie');
  }
  db.createObjectStore('poireactie', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('poireactiesup')) {
    db.deleteObjectStore('poireactiesup');
  }
  db.createObjectStore('poireactiesup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('track')) {
    db.deleteObjectStore('track');
  }
  db.createObjectStore('track', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('tracksup')) {
    db.deleteObjectStore('tracksup');
  }
  db.createObjectStore('tracksup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('tracktag')) {
    db.deleteObjectStore('tracktag');
  }
  db.createObjectStore('tracktag', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('trackreactie')) {
    db.deleteObjectStore('trackreactie');
  }
  db.createObjectStore('trackreactie', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('trackreactiesup')) {
    db.deleteObjectStore('trackreactiesup');
  }
  db.createObjectStore('trackreactiesup', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('tag')) {
    db.deleteObjectStore('tag');
  }
  db.createObjectStore('tag', {
    keyPath: 'Id'
  });

  if (db.objectStoreNames.contains('analytics')) {
    db.deleteObjectStore('analytics');
  }
  //db.createObjectStore('analytics', { keyPath: "Id" });
  console.log('IndexedDB update to Version: ', dbVer);

};
request.onerror = function (evt) {
  console.error('IndexedDB not available!!!!!!: ', evt);
};
