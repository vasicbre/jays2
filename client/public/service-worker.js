var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/api/thing/things',
    'static/js/bundle.js',
    'static/js/1.chunk.js',
    'static/js/main.chunk.js'
];


self.addEventListener('install', function(event) {
  // Perform install steps
  var myHeaders = new Headers({
    'Authorization': 'Token 3070430694567871a7dca57ce2ce0540f6e8380c'
    }); 
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache.map(url => new Request(url, {
                headers: myHeaders})));
        })
    );
    });

self.addEventListener('fetch', function(event) {
    console.log('Fetching:', event.request.url);

    // event.waitUntil(async function() {
    //     // Exit early if we don't have access to the client.
    //     // Eg, if it's cross-origin.
    //     if (!event.clientId) return;
    
    //     // Get the client.
    //     const client = await clients.get(event.clientId);
    //     // Exit early if we don't get the client.
    //     // Eg, if it closed.
    //     if (!client) return;
    
    //     // Send a message to the client.
    //     client.postMessage({
    //       msg: "Hey I just got a fetch from you!",
    //       url: event.request.url
    //     });
       
    //   }());

    event.respondWith(
      caches.match(event.request, {
          cacheName:CACHE_NAME,
          ignoreVary:true
        })
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            console.log(response);
            return response;
          }
  
          return fetch(event.request).then(
            function(response) {
              console.log('fetch response');
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                  console.log('response failed');
                  return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });