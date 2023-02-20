const
  axios = require('axios'),
  crypto = require('crypto'),
  WebSocket = require('ws');

const
  publicUrl  = 'wss://push1-v2.kucoin.com/endpoint',
  privateUrl = 'wss://push1-v2.kucoin.com/endpoint?token=MYTOKEN';

const
  GZIP=true,
  NOZIP=false;

var SocketNum=0;
class SocketClient {

  constructor(url, keys, gzip, token, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._promises = new Map();
    this._handles = new Map();
    this._num=(++SocketNum);
    this._pingTimeout=token.instanceServers[0].pingTimeout;
    this._token=token;

    this._createSocket(url);

//    this.compressed=gzip;
    this.name=(keys==undefined?"market":keys.name);
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);
    this._ws.onopen = async () => {
      console.log('ws connected', this.name);
      this.pingInterval = setInterval(sendPing, this._token.instanceServers[0].pingInterval, this);

      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
      console.log('ws closed', this.name);
      this._ws.emit('closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
//        cb.reject(new Error('Disconnected'));
      });
      clearInterval(this.pingInterval);
      clearTimeout(this.pingTimeout);

      this._ws=null;
    };

    this._ws.onerror = err => {
      console.log('ws error', this.name, err);
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onmessage = msg => {
//      try {
        var message,parts,method,symbol,option;
        message=JSON.parse(msg.data);

        var request;
        switch(message.type) {

          case "welcome":
            break;

          case "ack":
            if (this._promises.has(message.id)) {
              const cb = this._promises.get(message.id);
              this._promises.delete(message.id);
              cb.resolve({code:"200", data: message.type});
            } else {
              console.log('Unprocessed response', this._promises, message.id, message)
            };
            break;

          case "pong":
            clearTimeout(this.pingTimeout);
            break;

          case "message":
            const method=message.subject;
            const parts=message.topic.split(":");
            const params=parts.length==1?[""]:parts[1].split("_");
            const symbol=params[0];
            const option=params[1];

            if (this._handles.has(method)) {
              this._handles.get(method).forEach((cb,i) => { 
                cb(method,message.data,symbol,option);
               });
            } else {
              console.log('ws no handler', method);
            };

            break;

          case "notice":
            break;

          case "command":
            break;

          default:
            break;

        };

//      } catch (e) {
//        console.log('Fail parse message', e);
//      }

    };

  }

  async request(key, options) {

    if (this._ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        this._promises.set(key, {resolve, reject});
        this._ws.send(JSON.stringify(options));
        setTimeout(() => {
          if (this._promises.has(key)) {
            this._promises.delete(key);
            reject({"code":"408","error":"Request Timeout"});
          };
        }, 10000);
      });
    } else { console.log("ws socket unavailable"); };

  }

  setHandler(key, callback) {
    this._handles.set(key, []);
    this._handles.get(key).push(callback);
  }

  clearHandler(key) {
    if (this._handles.has(key)) { this._handles.delete(key); };
  }

}

function sendPing(socket) {
  if(socket._ws==null) { return; };

  const request={ id: Date.now(), type: "ping"};
  console.log("Ping "+socket.name,request);

  socket.pingTimeout = setTimeout(terminateSocket, socket._token.instanceServers[0].pingTimeout, socket);
  socket._ws.send(JSON.stringify(request));
}

function terminateSocket(socket) {

  console.log("Terminate socket "+socket.name);

  clearInterval(socket.pingInterval);
  if(socket._ws!==null) {
    socket._ws.emit('closed');
    socket._ws.terminate();
//    socket._ws=null; // will be set to null when close is triggered
  };

};

var KuCoinSocket = function(url, keys, token, gzip) {
  this.endPoint = "https://api.kucoin.com";
  this.baseURL = url;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;
  this.token=token.data;

  var newurl=this.token.instanceServers[0].endpoint+"?token="+token.data.token;
  this.socket = new SocketClient(newurl, keys, gzip, this.token, () => {
    this.initialized=true;
    if(keys!==undefined) { this.socket._ws.emit('authenticated'); } else { this.socket._ws.emit('initialized'); };

  });
};

module.exports = {
  publicApi: function(token) { return new KuCoinSocket(publicUrl, undefined, token, GZIP); },
  privateApi: function(keys,token) { return new KuCoinSocket(privateUrl, keys, token, NOZIP); }
};

KuCoinSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

KuCoinSocket.prototype.clearHandler = function(method) {
  this.socket.clearHandler(method);
};

//
// WEBSOCKET FEED
//


// ------------------------------------------------------------


//
// PUBLIC CHANNELS
//

KuCoinSocket.prototype.subscribeTicker = async function(symbols="all") { // https://docs.kucoin.com/#symbol-ticker
                                                                         // https://docs.kucoin.com/#all-symbols-ticker
  const key="/market/ticker:"+symbols;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeSnapshot = async function(symmarket) { // https://docs.kucoin.com/#symbol-snapshot
                                                                       // https://docs.kucoin.com/#market-snapshot
  const key="/market/snapshot:"+symmarket;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeOrderbook = async function(symbols) { // https://docs.kucoin.com/#level-2-market-data
  const key="/market/level2:"+symbols;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeBest = async function(symbols,depth) { // https://docs.kucoin.com/#level2-5-best-ask-bid-orders
                                                                      // https://docs.kucoin.com/#level2-50-best-ask-bid-orders
  const key="/spotMarket/level2Depth"+depth.toFixed(0)+":"+symbols; // depth is 5 or 50
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeCandles = async function(symbol,period) { // https://docs.kucoin.com/#klines
  const key="/market/candles:"+symbol+"_"+period;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeTrades = async function(symbols,private=false) { // https://docs.kucoin.com/#match-execution-data
  const key="/market/match:"+symbols;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true,privateChannel:private};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeIndexPrice = async function(symbols) { // https://docs.kucoin.com/#index-price
  const key="/indicator/index:"+symbols;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeMarkPrice = async function(symbols) { // https://docs.kucoin.com/#mark-price
  const key="/indicator/markPrice:"+symbols;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeMarginBook = async function(currencies) { // https://docs.kucoin.com/#order-book-change
  const key="/margn/fundingBook:"+currencies;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

// ------------------------------------------------------------


//
// PRIVATE CHANNELS
//

KuCoinSocket.prototype.subscribeOrderUpdates = async function() { // https://docs.kucoin.com/#private-order-change-events
  const key="/spotMarket/tradeOrders";
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true,privateChannel:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeBalanceUpdates = async function() { // https://docs.kucoin.com/#account-balance-notice
  const key="/account/balance";
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true,privateChannel:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeMarginPositions = async function() { // https://docs.kucoin.com/#debt-ratio-change
                                                                     // https://docs.kucoin.com/#position-status-change-event
  const key="/margin/position";
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true,privateChannel:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeMarginOrders = async function(currency) { // https://docs.kucoin.com/#margin-trade-order-enters-event
                                                                          // https://docs.kucoin.com/#margin-order-update-event
                                                                          // https://docs.kucoin.com/#margin-order-done-event
  const key="/margin/load:"+currency;
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true,privateChannel:true};
  const result = await this.socket.request(reqID,options);
  return result;
};

KuCoinSocket.prototype.subscribeStopOrders = async function() { // https://docs.kucoin.com/#stop-order-event
  const key="//spotMarket/advancedOrders";
  const reqID="id"+(++this.socket._id);
  const options={id:reqID,type:"subscribe",topic:key,response:true,privateChannel:true};
  const result = await this.socket.request(reqID,options);
  return result;
};
