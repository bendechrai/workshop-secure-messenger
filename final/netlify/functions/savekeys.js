const axios = require("axios").default;
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function (event, context) {

    const payload = JSON.parse(event.body);

    // Save keys to Auth0 user's user_metadata
    var auth0Options = {
        method: 'PATCH',
        url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${payload.userId}`,
        headers: {
            authorization: `Bearer ${payload.accessToken}`,
            'content-type': 'application/json'
        },
        data: { user_metadata: { keys: payload.data } }
    };
    axios.request(auth0Options).then(function (response) {

        // Save public key to Supabase
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);
        supabase.from('keys').insert([
            { key: payload.data.publicKey }
        ]).then(function (response) {
            return {
                statusCode: 200,
                body: response.data
            };
        }
        ).catch(function (error) {
            return {
                statusCode: 500,
                body: error
            };
        }
        );

    }).catch(function (error) {
        return {
            statusCode: 501,
            body: error
        };
    });

};
