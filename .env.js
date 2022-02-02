const AM_URL = 'https://forgerock.crbrl.io/am'; // (include the /am)
const DEBUGGER_OFF = true;
const DEVELOPMENT = true;
const API_URL = 'https://api.example.com:9443'; // (your resource API server's URL)
const JOURNEY_LOGIN = 'Login'; // (name of journey/tree for Login)
const JOURNEY_REGISTER = 'Registration'; // (name of journey/tree for Register)
const SEC_KEY_FILE = './updatedCerts/api.example.com.key';
const SEC_CERT_FILE = './updatedCerts/api.example.com.crt';
const REALM_PATH = 'alpha';
const REST_OAUTH_CLIENT = 'WebOAuthClientGbafal'; // (name of private OAuth 2.0 client/application)
const REST_OAUTH_SECRET = 'Password1!'; // (the secret for the private OAuth 2.0 client/application)
const WEB_OAUTH_CLIENT = 'WebOAuthClient'; // (the name of the public OAuth 2.0 client/application)
const PORT = '9443';

export { 
    API_URL,
    AM_URL,
    DEBUGGER_OFF,
    DEVELOPMENT,
    JOURNEY_LOGIN,
    JOURNEY_REGISTER,
    SEC_KEY_FILE,
    SEC_CERT_FILE,
    REALM_PATH,
    REST_OAUTH_CLIENT,
    REST_OAUTH_SECRET,
    WEB_OAUTH_CLIENT,
    PORT
}
