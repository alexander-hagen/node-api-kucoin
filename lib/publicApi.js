var axios = require('axios');

var KucoinPublic = function() {
  this.endPoint = "https://api.kucoin.com";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new KucoinPublic();
};

KucoinPublic.prototype.query = async function(path) {
  const request={
      url: this.endPoint + path,
      method: "GET",
      timeout: this.timeout,
      forever: this.keepalive
    };
  return result=await axios(request)
    .then(function(res) {
      return res.data;
    })
    .catch(function(err) {
      console.log("Error: " + err);
      throw new Error(err.statusCode);
    });
};

//
// MARKET DATA
//

// Symbols and Tickers

KucoinPublic.prototype.getSymbols = function(market) { // https://docs.kucoin.com/#get-symbols-list
  var path = "/api/v2/symbols";
  if (market !== undefined) { path += "?market=" + market; };
  return this.query(path);
};

KucoinPublic.prototype.getTicker = function(symbol) { // https://docs.kucoin.com/#get-ticker
  var path = "/api/v1/market/orderbook/level1?symbol=" + symbol;
  return this.query(path);
};

KucoinPublic.prototype.getAllTickers = function() { // https://docs.kucoin.com/#get-all-tickers
  var path = "/api/v1/market/allTickers";
  return this.query(path);
};

KucoinPublic.prototype.getMarketStats = function(symbol) { // https://docs.kucoin.com/#get-24hr-stats
  var path = "/api/v1/market/stats?symbol=" + symbol;
  return this.query(path);
};

KucoinPublic.prototype.getMarkets = function() { // https://docs.kucoin.com/#get-market-list
  var path = "/api/v1/markets";
  return this.query(path);
};

// Orderbook

KucoinPublic.prototype.getPartOrderbook = function(symbol, depth=100) { // https://docs.kucoin.com/#get-part-order-book-aggregated
  var path = "/api/v1/market/orderbook/level2_"+depth.toString(0)+"?symbol="+symbol; // depth= 20 or 100
  return this.query(path);
};

KucoinPublic.prototype.getOrderbook = function(symbol) { // https://docs.kucoin.com/#get-full-order-book-aggregated
  var path = "/api/v3/market/orderbook/level2?symbol=" + symbol;
  return this.query(path);
};

// Histories

KucoinPublic.prototype.getTradeHistories = function(symbol) { // https://docs.kucoin.com/#get-trade-histories
  var path = "/api/v1/market/histories?symbol=" + symbol;
  return this.query(path);
};

KucoinPublic.prototype.getKlines = function(symbol,period,start,end) { // https://docs.kucoin.com/#get-klines
  var path = "/api/v1/market/candles?symbol=" + symbol + "&type=" + period;
  if (start !== undefined) { path += "&startAt=" + start.toString(0); };
  if (end !== undefined) { path += "&endAt=" + end.toString(0); };
  return this.query(path);
};

// Currencies

KucoinPublic.prototype.getCurrencies = function() { // https://docs.kucoin.com/#get-currencies
  var path = "/api/v1/currencies";
  return this.query(path);
};

KucoinPublic.prototype.getCurrencyDetail = function(currency,chain) { // https://docs.kucoin.com/#get-currency-detail-recommend
  var path = "/api/v2/currencies/"+currency;
  if (chain !== undefined) { path += "?chain=" + chain; };
  return this.query(path);
};

KucoinPublic.prototype.getFiatPrice = function(base,currencies) { // https://docs.kucoin.com/#get-fiat-price
  var sep="?";
  var path = "/api/v1/prices";
  if (base !== undefined) { path += sep+"base=" + base; sep="&"; };
  if (currencies !== undefined) { path += sep+"currencies=" + currencies; sep="&"; };
  return this.query(path);
};
