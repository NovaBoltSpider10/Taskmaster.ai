require("dotenv").config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-3mwnn06ty4frt075.us.auth0.com'
};

module.exports = config