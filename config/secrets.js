module.exports = {
  db: 'localhost',

  localAuth: true,
  sessionSecret: "Your Session Secret goes here",

  keen:  {
    projectId:"532f8710ce5e436304000009",
    writeKey: "7145b2fe039620da1d74e645b0abc487b0025c3f90561d9e1fb997b43da0276770e5a057f10c04651434cb8604e2579aab5c024430af9729aa952974070c555e732191fe9d75cf74a3462cea68453b1da24ba47db5bbac00339c8ed2fa083e11018e7ca020be73841b7552f4a9637272"
  },
  
  mandrill: {
    user: 'boxgamex@gmail.com',
    password: 'GAvvFcgExPuaga_pGr8Tpg'
  },

  gmail: {
    user: 'Your Gmail Username',
    password: 'Your Gmail Password'
  },

  nyt: {
    key: 'Your New York Times API Key'
  },

  lastfm: {
    api_key: 'Your API Key',
    secret: 'Your API Secret'
  },

  facebookAuth: false,
  facebook: {
    clientID: 'Your App ID',
    clientSecret: 'Your App Secret',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  githubAuth: false,
  github: {
    clientID: 'b5af81e1450fb92bfcfa',
    clientSecret: '4d535952ea88e8a86ee1f1b544eda31082a4428b',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitterAuth: true,
  twitter: {
    consumerKey: 'k8UNGTEfFCMVwF2SR2IMw',
    consumerSecret: 'ihEanVypO9MGzrcPrYwEHS1UILJQY75OhHeUkOkzaI',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  googleAuth: false,
  google: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  steam: {
    apiKey: 'Your Steam API Key'
  },

  twilio: {
    sid: 'Your Account SID',
    token: 'Your Auth Token'
  },

  tumblr: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    redirectUrl: 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: 'Your Venmo Client ID',
    clientSecret: 'Your Venmo Client Secret',
    redirectUrl: 'http://localhost:3000/auth/venmo/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com', // or api.paypal.com
    client_id: 'Your Client ID',
    client_secret: 'Your Client Secret',
    returnUrl: 'http://localhost:3000/api/paypal/success',
    cancelUrl: 'http://localhost:3000/api/paypal/cancel'
  }
};
