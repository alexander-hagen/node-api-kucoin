const
  axios = require('axios');

var KucoinPublic = function() {
  this.endPoint = "https://api.kucoin.com";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new KucoinPublic();
};

KucoinPublic.prototype.getQuery = async function(path) {
  const request={
      url: this.endPoint + path,
      method: "GET",
      timeout: this.timeout,
      forever: this.keepalive,
    };
  return result=await axios(request)
    .then(function(res) {
      return res.data;
    })
    .catch(function(err) {
      console.log("Error: " + err,request);
      throw new Error(err.statusCode);
    });
};

KucoinPublic.prototype.otherQuery = async function(method,path) {
  const request={
      url: this.endPoint + path,
      method: method,
      timeout: this.timeout,
      forever: this.keepalive,
    };
  return result=await axios(request)
    .then(function(res) {
      return res.data;
    })
    .catch(function(err) {
      console.log("Error: " + err,request);
      throw new Error(err.statusCode);
    });
};

//
// MARKET DATA
//

// Symbols and Tickers

KucoinPublic.prototype.getSymbols = function(options) { // https://docs.kucoin.com/#get-symbols-list
  var path = "/api/v2/symbols",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

KucoinPublic.prototype.getTicker = function(options) { // https://docs.kucoin.com/#get-ticker
  var path = "/api/v1/market/orderbook/level1",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

KucoinPublic.prototype.getAllTickers = function() { // https://docs.kucoin.com/#get-all-tickers
  const path = "/api/v1/market/allTickers";
  return this.getQuery(path);
};

KucoinPublic.prototype.getMarketStats = function(options) { // https://docs.kucoin.com/#get-24hr-stats
  var path = "/api/v1/market/stats",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

KucoinPublic.prototype.getMarkets = function() { // https://docs.kucoin.com/#get-market-list
  const path = "/api/v1/markets";
  return this.getQuery(path);
};

// Orderbook

KucoinPublic.prototype.getPartOrderbook = function(depth=100,options) { // https://docs.kucoin.com/#get-part-order-book-aggregated
  var path = "/api/v1/market/orderbook/level2_"+depth.toString(0),sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

// Histories

KucoinPublic.prototype.getTradeHistories = function(options) { // https://docs.kucoin.com/#get-trade-histories
  var path = "/api/v1/market/histories",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

KucoinPublic.prototype.getKlines = function(options) { // https://docs.kucoin.com/#get-klines
  var path = "/api/v1/market/candles",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

// Currencies

KucoinPublic.prototype.getCurrencies = function() { // https://docs.kucoin.com/#get-currencies
  const path = "/api/v1/currencies";
  return this.getQuery(path);
};

KucoinPublic.prototype.getCurrencyDetail = function(currency,chain) { // https://docs.kucoin.com/#get-currency-detail-recommend
  var path = "/api/v2/currencies/"+currency;
  if (chain !== undefined) { path += "?chain=" + chain; };
  return this.getQuery(path);
};

KucoinPublic.prototype.getFiatPrice = function(options) { // https://docs.kucoin.com/#get-fiat-price
  var path = "/api/v1/prices",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path);
};

//
// OTHERS
//

KucoinPublic.prototype.getServerTime = function() { // https://docs.kucoin.com/#server-time
  const path="/api/v1/timestamp";
  return this.getQuery(path, {});
};

KucoinPublic.prototype.getServiceStatus = function() { // https://docs.kucoin.com/#service-status
  const path="/api/v1/status";
  return this.getQuery(path, {});
};

KucoinPublic.prototype.getPublicToken = function() {
  const path = "/api/v1/bullet-public";
  return this.otherQuery("POST", path, {});
};
