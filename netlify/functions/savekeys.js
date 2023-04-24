var axios = require("axios").default;

exports.handler = async function (event, context) {
    const payload = JSON.parse(event.body);

    var options = {
        method: 'PATCH',
        url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${payload.userId}`,
        headers: {
            authorization: `Bearer ${payload.accessToken}`,
            'content-type': 'application/json'
        },
        data: payload.data
    };

    axios.request(options).then(function (response) {
        return {
            statusCode: 200,
            body: response.data
        };
    }).catch(function (error) {
        return {
            statusCode: 500,
            body: error
        };
    });
};
