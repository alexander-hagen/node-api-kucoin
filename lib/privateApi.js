const
  axios = require('axios'),
  crypto = require('crypto');

var KucoinPrivate = function(api) {
  this.endPoint = "https://api.kucoin.com";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.passphrase = api.passphrase;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new KucoinPrivate(api);
};

KucoinPrivate.prototype.query = function(options) {

  const stamp=Date.now().toFixed(0);

  var query=Object.assign({},options.body);
  var source=stamp+options.method+options.url.replace(this.endPoint,'')+(Object.keys(query)==0?'':JSON.stringify(query));

  var signature = crypto.createHmac('sha256', this.secret).update(source).digest('base64');
  var phrase = crypto.createHmac('sha256', this.secret).update(this.passphrase).digest('base64');

  options["headers"]={
    "KC-API-KEY": this.apikey,
    "KC-API-SIGN": signature,
    "KC-API-TIMESTAMP": stamp,
    "KC-API-PASSPHRASE": phrase,
    "KC-API-KEY-VERSION": "2"
  };

  return axios(options).then(function(res) {
    return res.data
  }).catch(function(err) {
    console.log("Error",err,options);
    throw new Error(err.statusCode);
  });
};

KucoinPrivate.prototype.getQuery = function(path, query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return this.query(options);
};

KucoinPrivate.prototype.otherQuery = function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    body: query,
    json: true
  };
  return this.query(options);
};

//
// ORDERBOOK
//

KucoinPrivate.prototype.getOrderbook = function(options={}) { // https://docs.kucoin.com/#get-full-order-book-aggregated
  var path = "/api/v3/market/orderbook/level2",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

//
// USER
//

// USER INFO

KucoinPrivate.prototype.getSubUserInfo = function(options={}) { // hhttps://docs.kucoin.com/#get-paginated-list-of-sub-accounts
  var path="/api/v2/sub/user",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};


// ACCOUNT

KucoinPrivate.prototype.listAccounts = function(options={}) { // https://Kucoinapi.github.io/docs/spot/v1/en/#get-all-accounts-of-the-current-user
  var path="/api/v1/accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getAccount = function(id) { // https://docs.kucoin.com/#get-an-account
  const path="/api/v1/accounts/"+id;
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getAccountLedgers = function(options={}) { // https://docs.kucoin.com/#get-account-ledgers
  var path="/api/v1/accounts/ledgers",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getAccountSummary = function() { // https://docs.kucoin.com/#get-account-summary-information
  const path="/api/v1/user-info";
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.createSubAccount = function(options={}) { // hhttps://docs.kucoin.com/#create-sub-account
  const path="/api/v1/sub/user";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.getSubAccountAPIs = function(options={}) { // https://docs.kucoin.com/#get-sub-account-spot-api-list
  var path="/api/v1/sub/api-key",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.createSubAccountAPI = function(options={}) { // https://docs.kucoin.com/#create-spot-apis-for-sub-account
  const path="/api/v1/sub/api-key";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.updateSubAccountAPI = function(options={}) { // https://docs.kucoin.com/#modify-sub-account-spot-apis
  const path="/api/v1/sub/api-key/update";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.deleteSubAccountAPI = function(options={}) { // https://docs.kucoin.com/#delete-sub-account-spot-apis
  const path="/api/v1/sub/api-key";
  return this.otherQuery("DELETE", path, options);
};

KucoinPrivate.prototype.getSubBalance = function(id,zero=false) { // https://docs.kucoin.com/#get-account-balance-of-a-sub-account
  const path="/api/v1/sub-accounts/"+id+"?includeBaseAmount="+zero;
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getAggregatedBalance = function() { // https://docs.kucoin.com/#get-the-aggregated-balance-of-all-sub-accounts
  const path="//api/v1/sub-accounts";
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getSubAccountDetails = function(options={}) { // https://docs.kucoin.com/#get-paginated-sub-account-information
  var path="/api/v2/sub-accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getTransferable = function(options={}) { // https://docs.kucoin.com/#get-the-transferable
  var path="/api/v1/accounts/transferable",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.accountTransfer = function(options={}) { // https://docs.kucoin.com/#transfer-between-master-user-and-sub-user
  const path="/api/v2/accounts/sub-transfer";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.innerTransfer = function(options={}) { // https://docs.kucoin.com/#inner-transfer
  const path="/api/v2/accounts/inner-transfer";
  return this.otherQuery("POST", path, options);
};

// DEPOSIT

KucoinPrivate.prototype.createDepositAddress = function(options={}) { // https://docs.kucoin.com/#create-deposit-address
  const path="/api/v1/deposit-addresses";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.getDepositAddress = function(options={}) { // https://docs.kucoin.com/#get-deposit-addresses-v2
  const path="/api/v2/deposit-addresses",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getDeposits = function(options={}) { // https://docs.kucoin.com/#get-deposit-list
  var path="/api/v1/deposits",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getHistDeposits = function(options={}) { // https://docs.kucoin.com/#get-v1-historical-deposits-list
  var path="/api/v1/hist-deposits",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

// WITHDRAWALS

KucoinPrivate.prototype.getWithdrawals = function(options={}) { // https://docs.kucoin.com/#get-withdrawals-list
  var path="/api/v1/withdrawals",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getHistWithdrawals = function(options={}) { // https://docs.kucoin.com/#get-v1-historical-withdrawals-list
  var path="/api/v1/hist-withdrawals",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getWithdrawalQuota = function(currency,chain) { // https://docs.kucoin.com/#get-withdrawal-quotas
  var path="/api/v1/withdrawals/quotas?currency="+currency;
  if(chain!==undefined) { path+="&chain="+chain; };
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.applyWithdraw = function(options={}) { // https://docs.kucoin.com/#apply-withdraw-2
  const path="/api/v1/withdrawals";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.cancelWithdraw = function(id) { // https://docs.kucoin.com/#cancel-withdrawal
  const path="/api/v1/withdrawals/"+id;
  return this.otherQuery("DELETE", path, {});
};

// TRADE FEE

KucoinPrivate.prototype.getUserFee = function(options={}) { // https://docs.kucoin.com/#basic-user-fee
  var path="/api/v1/base-fee",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getSymbolFee = function(options={}) { // https://docs.kucoin.com/#actual-fee-rate-of-the-trading-pair
  const path="/api/v1/trade-fees",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

//
// TRADE
//

// ORDERS

KucoinPrivate.prototype.placeOrder = function(options={}) { // https://docs.kucoin.com/#place-a-new-order
  const path="/api/v1/orders";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.placeMarginOrder = function(options={}) { // https://docs.kucoin.com/#place-a-margin-order
  const path="/api/v1/margin/order";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.placeOrders = function(options={}) { // https://docs.kucoin.com/#place-bulk-orders
  const path="/api/v1/orders/multi";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.cancelOrder = function(id) { // https://docs.kucoin.com/#cancel-an-order
  const path="/api/v1/orders/"+id;
  return this.otherQuery("DELETE", path, {});
};

KucoinPrivate.prototype.cancelClientOrderID = function(id) { // https://docs.kucoin.com/#cancel-single-order-by-clientoid
  const path="/api/v1/order/client-order/"+id;
  return this.otherQuery("DELETE", path, {});
};

KucoinPrivate.prototype.cancelAllOrders = function(symbol,type) { // https://docs.kucoin.com/#cancel-all-orders
  var path="/api/v1/orders",sep="?";
  if(symbol!==undefined) { path+=sep+"symbol="+symbol; sep="&"; };
  if(type!==undefined) { path+=sep+"tradeType="+type; sep="&"; };
  return this.otherQuery("DELETE", path, {});
};

KucoinPrivate.prototype.getOrders = function(options={}) { // https://docs.kucoin.com/#list-orders
  var path="/api/v1/orders",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getRecentOrders = function() { // https://docs.kucoin.com/#recent-orders
  const path="/api/v1/limit/orders";
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getOrder = function(id) { // https://docs.kucoin.com/#get-an-order
  const path="/api/v1/orders/"+id;
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getClientOrderID = function(id) { // https://docs.kucoin.com/#get-single-active-order-by-clientoid
  const path="/api/v1/order/client-order/"+id;
  return this.getQuery(path, {});
};

// FILLS

KucoinPrivate.prototype.getFills = function(options={}) { // hhttps://docs.kucoin.com/#list-fills
  var path="/api/v1/fills",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getRecentFills = function() { // https://docs.kucoin.com/#recent-fills
  const path="/api/v1/limit/fills";
  return this.getQuery(path, {});
};

// STOP ORDER

KucoinPrivate.prototype.placeStopOrder = function(options={}) { // https://docs.kucoin.com/#place-a-new-order-2
  const path="/api/v1/stop-order";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.cancelSpotOrder = function(id) { // https://docs.kucoin.com/#cancel-an-order-2
  const path="/api/v1/stop-order/"+id;
  return this.otherQuery("DELETE", path, {});
};

KucoinPrivate.prototype.cancelSpotOrders = function(options={}) { // https://docs.kucoin.com/#cancel-orders
  const path="/api/v1/stop-order/cancel";
  return this.otherQuery("DELETE", path, options);
};

KucoinPrivate.prototype.getSpotOrder = function(id) { // https://docs.kucoin.com/#get-single-order-info
  const path="/api/v1/stop-order/"+id;
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getSpotOrders = function(options={}) { // https://docs.kucoin.com/#list-stop-orders
  var path="/api/v1/stop-order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getSpotClientOrderID = function(id,options={}) { // https://docs.kucoin.com/#get-single-order-by-clientoid
  var path="/api/v1/stop-order/queryOrderByClientOid/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.cancelSpotClientOrderID = function(id,options={}) { // https://docs.kucoin.com/#cancel-single-order-by-clientoid-2
  var path="/api/v1/stop-order/cancelOrderByClientOid/"+id,sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.otherQuery("DELETE",path,{});
};

//
// MARGIN TRADE
//

// MARGIN INFO

KucoinPrivate.prototype.getMarkPrice = function(symbol) { // https://docs.kucoin.com/#get-mark-price
  const path="/api/v1/mark-price/"+symbol+"/current";
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getMarginConfig = function() { // https://docs.kucoin.com/#get-margin-configuration-info
  const path="/api/v1/margin/config";
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getMarginAccount = function() { // https://docs.kucoin.com/#get-margin-account
  const path="/api/v1/margin/account";
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getMarginRiskLimit = function(options={}) { // https://docs.kucoin.com/#query-the-cross-isolated-margin-risk-limit
  const path="/api/v1/risk/limit/strategy",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

// BORROW & LEND

KucoinPrivate.prototype.placeBorrowOrder = function(options={}) { // https://docs.kucoin.com/#post-borrow-order
  const path="/api/v1/margin/borrow";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.getBorrowOrder = function(id) { // https://docs.kucoin.com/#get-borrow-order
  const path="//api/v1/margin/borrow?"+id;
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getRepayRecord = function(options={}) { // https://docs.kucoin.com/#get-repay-record
  var path="/api/v1/margin/borrow/outstanding",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getRepaymentRecord = function(options={}) { // https://docs.kucoin.com/#get-repayment-record
  var path="/api/v1/margin/borrow/repaid",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.marginRepayAll = function(options={}) { // https://docs.kucoin.com/#one-click-repayment
  const path="/api/v1/margin/repay/all";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.marginRepayOrder = function(options={}) { // https://docs.kucoin.com/#repay-a-single-order
  const path="/api/v1/margin/repay/single";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.placeLendOrder = function(options={}) { // https://docs.kucoin.com/#post-lend-order
  const path="/api/v1/margin/lend";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.cancelLendOrder = function(id) { // https://docs.kucoin.com/#cancel-lend-order
  const path="/api/v1/margin/lend/"+id;
  return this.otherQuery("DELETE", path, {});
};

KucoinPrivate.prototype.setAutoLend = function(options={}) { // https://docs.kucoin.com/#set-auto-lend
  const path="/api/v1/margin/toggle-auto-lend";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.getMarginOrders = function(options={}) { // https://docs.kucoin.com/#get-active-order
  var path="/api/v1/margin/lend/active",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getLendHistory = function(options={}) { // https://docs.kucoin.com/#get-lent-history
  var path="/api/v1/margin/lend/done",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getActiveLendOrders = function(options={}) { // https://docs.kucoin.com/#get-active-lend-order-list
  var path="/api/v1/margin/lend/trade/unsettled",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getSettledLendOrders = function(options={}) { // https://docs.kucoin.com/#get-settled-lend-order-history
  var path="/api/v1/margin/lend/trade/settled",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getAccountLendRecord = function(options={}) { // https://docs.kucoin.com/#get-account-lend-record
  var path="/api/v1/margin/lend/assets",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getLendingMarketData = function(options={}) { // https://docs.kucoin.com/#lending-market-data
  var path="/api/v1/margin/market",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getMarginTradeData = function(options={}) { // https://docs.kucoin.com/#margin-trade-data
  const path="/api/v1/margin/trade/last",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

// ISOLATED MARGIN

KucoinPrivate.prototype.getIsolatedSymbols = function() { // https://docs.kucoin.com/#query-isolated-margin-trading-pair-configuration
  const path="/api/v1/isolated/symbols";
  return this.getQuery(path, {});
};

KucoinPrivate.prototype.getIsolatedAccounts = function(options={}) { // https://docs.kucoin.com/#query-isolated-margin-account-info
  var path="/api/v1/isolated/accounts",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getSingleIsolatedAccount = function(symbol) { // https://docs.kucoin.com/#query-single-isolated-margin-account-info
  const path="/api/v1/isolated/account/"+symbol;
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.setIsolatedMarginBorrowing = function(options={}) { // https://docs.kucoin.com/#isolated-margin-borrowing
  const path="/api/v1/isolated/borrow";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.getOutstandingRepaymentRecords = function(options={}) { // https://docs.kucoin.com/#query-outstanding-repayment-records
  var path="/api/v1/isolated/borrow/outstanding",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.getRepaymentRecords = function(options={}) { // https://docs.kucoin.com/#query-repayment-records
  var path="/api/v1/isolated/borrow/repaid",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return this.getQuery(path,{});
};

KucoinPrivate.prototype.isolatedRepayAll = function(options={}) { // https://docs.kucoin.com/#quick-repayment
  const path="/api/v1/isolated/repay/all";
  return this.otherQuery("POST", path, options);
};

KucoinPrivate.prototype.isolatedRepaySingle = function(options={}) { // https://docs.kucoin.com/#single-repayment
  const path="/api/v1/isolated/repay/single";
  return this.otherQuery("POST", path, options);
};

//
// WEBSOCKET FEED
//

KucoinPrivate.prototype.getPrivateToken = function() {
  const path = "/api/v1/bullet-private";
  return this.otherQuery("POST", path, {});
};
