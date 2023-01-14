# node-api-kucoin

**WARNING: This package is still early beta! Expect breaking changes until this sees a major release.**

Non-official implementation of KuCoin's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

```javascript
  const kucoin=require('node-api-kucoin');

  const publicAPI=new kucoin.publicApi();

```

### Section

|  API   | DESCRIPTION  |
|  :----  | :----  |

## __PRIVATE API__

```javascript
  const kucoin=require('node-api-kucoin');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new kucoin.privateApi(auth);

```

### Section

|  API   | DESCRIPTION  |
|  :----  | :----  |

## __WEBSOCKET API__

```javascript
  const kucoin=require('node-api-kucoin');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const marketAPI=new kucoin.sockets.marketApi();
  const tradingAPI=new kucoin.sockets.tradingApi(auth);

  tradingAPI.setHandler('orders', (symbol,method,data,option) => { updateOrder(symbol,method,data); });

  tradingAPI.socket._ws.on('authenticated', async () => { // For market API's: initialized
    const res=await tradingAPI.subscribeOrderUpdates();
  });

  tradingAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };

```

### MARKET DATA

```javascript
  const marketAPI=new kucoin.sockets.marketApi();
```

|  API   | HANDLER | DESCRIPTION  |
|  :----  | :----  | :----  |

### ACCOUNT AND ORDER

```javascript
  const tradingAPI=new kucoin.sockets.tradingApi();
```

|  API   | HANDLER | DESCRIPTION  |
|  :----  | :----  | :----  |
