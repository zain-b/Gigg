'use strict';

const CACHE_NAME = 'gigg-cache';
const baseUrl = 'http://localhost:3001/';
const serviceName = '[ServiceWorker] :: ';

const FILES_TO_CACHE = [
  '/gigg-service-worker.js',
  '/favicon.ico',
  '/index.html',
  '/main-es5.js',
  '/main-es2015.js',
  '/polyfills-es5.js',
  '/polyfills-es2015.js',
  '/runtime-es2015.js',
  '/scripts.js',
  '/manifest.webmanifest',
  '/styles.css',
  '/assets/map-icon-4.png',
  '/assets/not-found.jpg'
];

const CACHE_BLACKLIST = [
  'socket',
  '/api'
];

const CACHE_BLACKLIST_REGEX = new RegExp(CACHE_BLACKLIST.join("|"));

self.addEventListener('install', (evt) => {
  console.log(serviceName + 'Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(serviceName + 'Pre-caching resources');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log(serviceName + 'Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log(serviceName + 'Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );


  self.clients.claim();
});

/*
 * Network falling back to latest cache strategy. If network request succeeds, update the cache with the response.
 * If network fails, load from cache. This way cache will always be most up to date when user goes offline.
 *
 * Maybe not ideal under bad network conditions.
 *
 * Accommodate for the "/" base path when offline. Network will of course fail and so will cache because "/"
 * is not a file. If cache fails and request url is the baseUrl then return index.html from cache.
 *
 */
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).then(

      function (response) {
        console.log(serviceName +  "Fetching " + event.request.url);

        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        if (CACHE_BLACKLIST_REGEX.test(event.request.url)) {
          console.log(serviceName +  "Network succeeded, not adding blacklisted resource to cache: " + event.request.url);
          return response;
        }

        console.log(serviceName +  "Network succeeded, updating requested resource in cache: " + event.request.url);
        var responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(function (cache) {
            cache.put(event.request, responseToCache);
          });

        return response;
      }
    ).catch(function () {
      return caches.match(event.request)
        .then(function(response) {

          if (response) {
            console.log(serviceName +  "Network failed. Request " + event.request.url + "retrieved from cache instead.");
            return response;
          }

          if (event.request.url === baseUrl) {
            console.log(serviceName + "Mapping offline / request to cached index.html");
            return caches.match('index.html');
          }

          console.log(serviceName + "Network failed. Cache failed.");
          return response;
        })
    })
  );
});



