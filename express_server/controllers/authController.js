const axios = require('axios');
require("dotenv").config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

async function getUserData(sub) {
    try {
        const { data } = await axios.post(`https://dev-3mwnn06ty4frt075.us.auth0.com/oauth/token`, {
            client_id: "yhNQZ3h82WJdsqrtPgsqhJtvendwBCo5",
            client_secret: "mSl03rKxxRpOd_ClRD32NkTJYiobbcGaN4qJc_FnSWjHBSd2EtrAGRgKhEk9c2me",
            audience: "https://taskmaster/api",
            grant_type: 'client_credentials'
        });

        const accessToken = data.access_token;

        const options = {
            method: "GET",
            url: "http://localhost:3000/api",
            headers: { "authorization": accessToken },
        }

        axios(options)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });

    } catch (err) {
        console.error('Error fetching user logins:', err.response?.data || err.message);
        return null;
    }
}

module.exports = {
    config: config,
    getUserData: getUserData,
};