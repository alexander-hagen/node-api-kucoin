# node-api-kucoin

**WARNING: This package is still early beta! Expect breaking changes until this sees a major release.**

Non-official implementation of KuCoin's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

```javascript
  const kucoin=require('node-api-kucoin');

  const publicAPI=new kucoin.publicApi();

```

### Market Data

#### Symbols & Ticker

| API                     | DESCRIPTION |
| :----                   | :---- |
| getSymbols              | https://docs.kucoin.com/#get-symbols-list |
| getTicker               | https://docs.kucoin.com/#get-ticker |
| getAllTickers           | https://docs.kucoin.com/#get-all-tickers |
| getMarketStats          | https://docs.kucoin.com/#get-24hr-stats |
| getMarkets              | https://docs.kucoin.com/#get-market-list |

#### Order Book

| API                     | DESCRIPTION |
| :----                   | :---- |
| getPartOrderbook        | https://docs.kucoin.com/#get-part-order-book-aggregated |

#### Histories

| API                     | DESCRIPTION |
| :----                   | :---- |
| getTradeHistories       | https://docs.kucoin.com/#get-trade-histories |
| getKlines               | https://docs.kucoin.com/#get-klines |

#### Currencies

| API                     | DESCRIPTION |
| :----                   | :---- |
| getCurrencies           | https://docs.kucoin.com/#get-currencies |
| getCurrencyDetail       | https://docs.kucoin.com/#get-currency-detail-recommend |
| getFiatPrice            | https://docs.kucoin.com/#get-fiat-price |

### Others

| API                     | DESCRIPTION |
| :----                   | :---- |
| getServerTime           | https://docs.kucoin.com/#server-time |
| getServiceStatus        | https://docs.kucoin.com/#service-status |
| getPublicToken          | https://docs.kucoin.com/#websocket-feed |

## __PRIVATE API__

```javascript
  const kucoin=require('node-api-kucoin');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new kucoin.privateApi(auth);

```

### Market Data

#### Order Book

| API                     | DESCRIPTION |
| :----                   | :---- |
| getPartOrderbook        | https://docs.kucoin.com/#get-part-order-book-aggregated |
| getOrderbook            | https://docs.kucoin.com/#get-full-order-book-aggregated |

### User

#### User Info

| API                     | DESCRIPTION |
| :----                   | :---- |
| getSubUserInfo          | https://docs.kucoin.com/#get-user-info-of-all-sub-accounts https://docs.kucoin.com/#get-paginated-list-of-sub-accounts|

#### Account

| API                     | DESCRIPTION |
| :----                   | :---- |
| listAccounts            | https://docs.kucoin.com/#list-accounts |
| getAccount              | https://docs.kucoin.com/#get-an-account |
| getAccountLedgers       | https://docs.kucoin.com/#get-account-ledgers |
| getAccountSummary       | https://docs.kucoin.com/#get-account-summary-info-v2 |
| createSubAccount        | https://docs.kucoin.com/#create-sub-account-v2 |
| getSubAccountAPIs       | https://docs.kucoin.com/#get-sub-account-spot-api-list |
| createSubAccountAPI     | https://docs.kucoin.com/#create-spot-apis-for-sub-account |
| modifySubAccountAPI     | https://docs.kucoin.com/#modify-sub-account-spot-apis |
| deleteSubAccountAPI     | https://docs.kucoin.com/#delete-sub-account-spot-apis |
| getSubBalance           | https://docs.kucoin.com/#get-account-balance-of-a-sub-account |
| getAggregatedBalance    | https://docs.kucoin.com/#get-the-aggregated-balance-of-all-sub-accounts |
| getSubAccountDetails    | https://docs.kucoin.com/#get-paginated-sub-account-information |
| getTransferable         | https://docs.kucoin.com/#get-the-transferable |
| accountTransfer         | https://docs.kucoin.com/#transfer-between-master-user-and-sub-user |
| innerTransfer           | https://docs.kucoin.com/#inner-transfer |

#### Deposit

| API                     | DESCRIPTION |
| :----                   | :---- |
| createDepositAddress    | https://docs.kucoin.com/#create-deposit-address |
| getDepositAddresses     | https://docs.kucoin.com/#get-deposit-addresses-v2 |
| getDepositAddress       | https://docs.kucoin.com/#get-deposit-address |
| getDeposits             | https://docs.kucoin.com/#get-deposit-list |
| getHistDeposits         | https://docs.kucoin.com/#get-v1-historical-deposits-list |

#### Withdrawals

| API                     | DESCRIPTION |
| :----                   | :---- |
| getWithdrawals          | https://docs.kucoin.com/#get-withdrawals-list |
| getHistWithdrawals      | https://docs.kucoin.com/#get-v1-historical-withdrawals-list |
| getWithdrawalQuota      | https://docs.kucoin.com/#get-withdrawal-quotas |
| applyWithdraw           | https://docs.kucoin.com/#apply-withdraw-2 |
| cancelWithdraw          | https://docs.kucoin.com/#cancel-withdrawal |

#### Trade Fee

| API                     | DESCRIPTION |
| :----                   | :---- |
| getUserFee              | https://docs.kucoin.com/#basic-user-fee |
| getSymbolFee            | https://docs.kucoin.com/#actual-fee-rate-of-the-trading-pair | 

### Trade

#### Orders

| API                     | DESCRIPTION |
| :----                   | :---- |
| createOrder             | https://docs.kucoin.com/#place-a-new-order |
| createMarginOrder       | https://docs.kucoin.com/#place-a-margin-order |
| createOrders            | https://docs.kucoin.com/#place-bulk-orders |
| cancelOrder             | https://docs.kucoin.com/#cancel-an-order |
| cancelClientOrderID     | https://docs.kucoin.com/#cancel-single-order-by-clientoid |
| cancelAllOrders         | https://docs.kucoin.com/#cancel-all-orders |
| getOrders               | https://docs.kucoin.com/#list-orders |
| getRecentOrders         | https://docs.kucoin.com/#recent-orders |
| getOrder                | https://docs.kucoin.com/#get-an-order |
| getClientOrderID        | https://docs.kucoin.com/#get-single-active-order-by-clientoid |

#### Fills

| API                     | DESCRIPTION |
| :----                   | :---- |
| getFills                | https://docs.kucoin.com/#list-fills |
| getRecentFills          | https://docs.kucoin.com/#recent-fills |

#### Stop Order

| API                     | DESCRIPTION |
| :----                   | :---- |
| createStopOrder         | https://docs.kucoin.com/#place-a-new-order-2 |
| cancelStopOrder         | https://docs.kucoin.com/#cancel-an-order-2 |
| cancelStopOrders        | https://docs.kucoin.com/#cancel-orders |
| getStopOrder            | https://docs.kucoin.com/#get-single-order-info |
| getStopOrders           | https://docs.kucoin.com/#list-stop-orders |
| getStopClientOrderID    | https://docs.kucoin.com/#get-single-order-by-clientoid |
| cancelStopClientOrderID | https://docs.kucoin.com/#cancel-single-order-by-clientoid-2 |

### Margin Trade

#### Margin Info

| API                     | DESCRIPTION |
| :----                   | :---- |
| getMarkPrice            | https://docs.kucoin.com/#get-mark-price |
| getMarginConfig         | https://docs.kucoin.com/#get-margin-configuration-info |
| getMarginAccount        | https://docs.kucoin.com/#get-margin-account |
| getMarginRiskLimit      | https://docs.kucoin.com/#query-the-cross-isolated-margin-risk-limit |

#### Margin Trading

| API                     | DESCRIPTION |
| :----                   | :---- |
| createBorrowOrder       | https://docs.kucoin.com/#1-margin-borrowing |
| repayBorrowOrder        | https://docs.kucoin.com/#2-repayment |
| getBorrowOrder          | https://docs.kucoin.com/#get-borrow-order |
| getRepayHistory         | https://docs.kucoin.com/#4-get-repayment-history |

#### Lending Market

| API                     | DESCRIPTION |
| :----                   | :---- |
| getCurrencyDetails      | https://docs.kucoin.com/#1-get-currency-information |
| getInterestRates        | https://docs.kucoin.com/#2-get-interest-rates |
| purchaseMarginLend      | https://docs.kucoin.com/#3-subscription |
| redeemMarginLend        | https://docs.kucoin.com/#4-redemption |
| updateMarginLend        | https://docs.kucoin.com/#5-modify-subscription-orders |
| getRedemptionOrders     | https://docs.kucoin.com/#6-get-redemption-orders |
| getPurchaseOrders       | https://docs.kucoin.com/#7-get-subscription-orders |

### Others

| API                     | DESCRIPTION |
| :----                   | :---- |
| getPrivateToken         | https://docs.kucoin.com/#websocket-feed |

## __WEBSOCKET API__

```javascript
  const kucoin=require('node-api-kucoin');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const marketAPI=new kucoin.sockets.marketApi();
  marketAPI.socket._ws.on('initialized', async () => {
    // do your own initialization
  });

  const tradingAPI=new kucoin.sockets.tradingApi(auth);
  tradingAPI.setHandler('orders', (symbol,method,data,option) => { updateOrder(symbol,method,data); });

  tradingAPI.socket._ws.on('authenticated', async () => {
    const res=await tradingAPI.subscribeOrderUpdates();
  });

  tradingAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };

```

### Public Channels

| API                                       | HANDLER              | DESCRIPTION |
| :----                                     | :----                | :---- |
| subscribeTicker unsubscribeTicker         | trade.ticker         | https://docs.kucoin.com/#symbol-ticker https://docs.kucoin.com/#all-symbols-ticker |
| subscribeSnapshot unsubscribeSnapshot     | trade.snapshot       | https://docs.kucoin.com/#symbol-snapshot https://docs.kucoin.com/#market-snapshot |
| subscribeOrderbook unsubscribeOrderbook   | trade.l2update       | https://docs.kucoin.com/#level-2-market-data |
| subscribeBest unsubscribeBest             | level2               | https://docs.kucoin.com/#level2-5-best-ask-bid-orders https://docs.kucoin.com/#level2-50-best-ask-bid-orders |
| subscribeCandles unsubscribeCandles       | trade.candles.update | https://docs.kucoin.com/#klines |
| subscribeTrades unsubscribeTrades         | trade.l3match        | https://docs.kucoin.com/#match-execution-data |
| subscribeIndexPrice unsubscribeIndexPrice | tick                 | https://docs.kucoin.com/#index-price |
| subscribeMarkPrice unsubscribeMarkPrice   | tick                 | https://docs.kucoin.com/#mark-price |
| subscribeMarginBook unsubscribeMarginBook | funding.update       | https://docs.kucoin.com/#order-book-change |

### Private Channels

| API                                                 | HANDLER                            | DESCRIPTION |
| :----                                               | :----                              | :---- |
| subscribeOrderUpdates unsubscribeOrderUpdates       | orderChange                        | https://docs.kucoin.com/#private-order-change-events |
| subscribeBalanceUpdates ubsubscribeBalanceUpdates   | account.balance                    | https://docs.kucoin.com/#account-balance-notice |
| subscribeDebRatioUpdates unsubscribeDebRatioUpdates | debt.ratio position.status         | https://docs.kucoin.com/#debt-ratio-change |
| subscribeMarginOrders                               | order.open order.update order.done | https://docs.kucoin.com/#margin-trade-order-enters-event https://docs.kucoin.com/#margin-order-update-event https://docs.kucoin.com/#margin-order-done-event |
| subscribeStopOrders                                 | stopOrder                          | https://docs.kucoin.com/#stop-order-event |
