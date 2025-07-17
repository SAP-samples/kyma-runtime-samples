const axios = require("axios");
const traceHeaders = ['x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-Flags', 'x-ot-span-context'];

const gatewayURL = process.env.GATEWAY_URL_OCC;
var baseSite = process.env.BASE_SITE;

const reviewGatewayURL = process.env.GATEWAY_URL_REVIEW;
const reviewODataPath = "/CustomerReviews";
const reviewServiceURL = reviewGatewayURL + reviewODataPath;

const c4cgatewayurl = process.env['GATEWAY_URL_C4C'];
const customerODataPath = "/IndividualCustomerCollection";
const ticketODataPath = "/ServiceRequestCollection";

module.exports = {
    main: async function (event, context) {

        var rightnow = new Date().toISOString();
        console.log(`*********** Current time: ${rightnow}`);
        console.log('*********** Event Data:');
        console.log(event.data);

        console.log('********** URLs:');
        console.log(reviewGatewayURL);


        var traceCtxHeaders = extractTraceHeaders(event.extensions.request.headers);

        var reviewCode = event.data.integrationKey;
        var userId = event.data.user.uid;
        console.log(`userId: ${userId}`);
        var anonymous = false;

        if (userId == 'anonymous') {
            anonymous = true;
        }

        //GET CUSTOMER INFO FROM OCC
        let customerDetails = await getUserDetails(userId, anonymous, traceCtxHeaders);
        console.log("customerDetails email: " + customerDetails.Email);

        //** GET REVIEW TEXT FROM Integration Object
        
        //Review details are now provided in the event data since we are using the 
        //SAP Commerce Cloud webhook method instead of a custom SAP Commerce Cloud event.
        
        //let reviewDetails = await getReviewDetails(reviewCode, traceCtxHeaders);
        let reviewDetails = event.data;

        var reviewHeadline = reviewDetails.headline;
        var reviewComment = reviewDetails.comment;
        const comment = reviewHeadline + ' ' + reviewComment;

        console.log("reviewDetails: " + comment);

        //DETERMINE REVIEW SENTIMENT
        let negative = await isNegative(comment, traceCtxHeaders);
        var rude = false;

        if (negative) {
            console.log("Customer sentiment is negative: ", comment);

            var message = "Negative review posted by " + customerDetails.Email + ": " + comment;
            await axios.post(process.env.SLACK_URL, { text: message });

            rude = await isNaughty(comment, traceCtxHeaders);
            if (rude) {
                console.log("Customer comment is rude: ", comment);
                var message = "Rude review posted by " + customerDetails.Email + ": " + comment;
                await axios.post(process.env.SLACK_URL, { text: message });
            }
            else {
                console.log("Customer comment is clean: ", comment);
                var message = "Clean review posted by " + customerDetails.Email + ": " + comment;
                await axios.post(process.env.SLACK_URL, { text: message });
            }
            const c4cUpdateFlag = process.env['C4C_UPDATE_FLAG']
            if(c4cUpdateFlag === "true") {
                //Create C4C Customer
                let customerID = await createC4CCustomer(customerDetails, traceCtxHeaders);
                console.log("customerID: " + customerID);
                
                if (customerID !== '') {
                //Create C4C Ticket
                     await createC4CTicket(customerID, customerDetails, comment, traceCtxHeaders);
                 }
             }
        }
        else {
            console.log("Customer sentiment is positive");

            var message = "Positive review posted by " + customerDetails.Email + ": " + comment;
            console.log(message);
            await axios.post(process.env.SLACK_URL, { text: message });
            // Trigger follow-up action

            rude = await isNaughty(comment, traceCtxHeaders);
            if (rude) {
                console.log("Customer comment is rude: ", comment);
                var message = "Rude review posted by " + customerDetails.Email + ": " + comment;
                console.log(message);
                // Trigger follow-up action
            }
            else {
                console.log("Customer comment is clean: ", comment);
                var message = "Clean review posted by " + customerDetails.Email + ": " + comment;
                console.log(message);
                // Trigger follow-up action
            }

            //do something cool with the positive reviews :-)
        }

        //Update Review status
        await updateReview(negative, rude, reviewDetails, traceCtxHeaders);
        

        console.log("returning processing complete.");
        return "processing complete";
    }
};

async function getUserDetails(userId, isAnonymous, traceCtxHeaders) {
    console.log(`userId: ${userId}`);
    var firstName = "Anonymous";
    var lastName = "Anonymous";
    var emailAddress = "anonymous@anonymous.com";

    if (!isAnonymous) {
        var url = `${gatewayURL}/${baseSite}/users/${userId}?fields=FULL`;
        console.log(`get user details: ${url}`);
        let response = await axios.get(url, { headers: traceCtxHeaders })
            .catch(function (error) {
                console.log('*** START Error on getUserDetails');
                logerror(error);
                console.log('*** END Error on getUserDetails');
            });
        firstName = response.data.firstName;
        lastName = response.data.lastName;
        emailAddress = response.data.displayUid;
    }

    var customerDetailsC4C = {
        "FirstName": firstName,
        "LastName": lastName,
        "Email": emailAddress,
        "RoleCode": "CRM000",
        "GenderCode": "1", //0002 is Mr., 0001 is Ms.
        "LifeCycleStatusCode": "2"
    };

    return customerDetailsC4C;
}

async function logerror(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('*** error.response.data');
        console.log(error.response.data);
        console.log('*** error.response.status');
        console.log(error.response.status);
        console.log('*** error.response.headers');
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('*** error.request');
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('*** error.message');
        console.log('Error', error.message);
    }
    console.log('*** error.config');
    console.log(error.config);
}

// getReviewDetails() not needed since we now get the review details in the event.  
// This method is retained to show how to access a SAP Commerce Cloud Integration API from Kyma.
async function getReviewDetails(reviewCode, traceCtxHeaders) {

    var url = `${reviewServiceURL}('${reviewCode}')`;
    let response = await axios.get(url, { headers: traceCtxHeaders })
        .catch(function (error) {
            console.log('Error on getReviewDetails:' + error);
        });

    return response.data.d;
}

async function updateReview(isNegative, isRude, content, traceCtxHeaders) {

    var status = { "code": "approved" };
    if (isNegative || isRude) {
        content.blocked = true;
        status = { "code": "rejected" };
    }
    content.approvalStatus = status;

    let response = await axios.post(`${reviewServiceURL}`, content, { headers: traceCtxHeaders })
        .catch(function (error) {
            console.log('*** Error on updateReview:' + error);
            logerror(error);
            console.log('*** Error on updateReview:' + error);
        });
}

async function isNegative(comment, traceCtxHeaders) {
    var url = process.env.SVC_URL_TEXT_ANALYSIS
    var headers = {
        'Content-Type': 'application/json',
    }
    Object.assign(headers,traceCtxHeaders);
    requestJson = `{"text": "${comment}"}`

    let response = await axios.post(url, requestJson, { headers: headers })
        .catch(function (error) {
            console.log('Error on isNegative:' + error);
        });
        console.log("Sentiment score: polarity: " + response.data.polarity + " pubjectivity: " + response.data.subjectivity);
    return response.data.polarity < 0.1
}

async function isNaughty(comment, traceCtxHeaders) {

    var url = process.env.SVC_URL_CONTENT_MODERATION;
    var headers = {
        'Content-Type': 'application/json',
    }
    Object.assign(headers,traceCtxHeaders);
    requestJson = `{"text": "${comment}"}`

    let response = await axios.post(url, requestJson, { headers: headers })
        .catch(function (error) {
            console.log('Error on isNaughty:' + error);
        });

    console.log("Content moderation inappropriate: " + response.data.inappropriate + " probability: " + response.data.probability);

    return response.data.inappropriate > 0;
}

async function sendToSlack(message, boolPositive) {
    var channelName = "#product-reviews-neg";
    if (boolPositive) {
        channelName = "#product-reviews-pos";
    }
    web.chat.postMessage({ channel: channelName, as_user: true, text: message })
        .then((res) => {
            console.log('Message sent to Slack: ', res.ts);
        })
        .catch(function (error) {
            console.log('Error on sendToSlack');
        });
}

async function sendToSlackClean(message, boolPositive) {
    var channelName = "#product-reviews-naughty";
    if (boolPositive) {
        channelName = "#product-reviews-clean";
    }
    web.chat.postMessage({ channel: channelName, as_user: true, text: message })
        .then((res) => {
            console.log('Message sent to SlackClean: ', res.ts);
        })
        .catch(function (error) {
            console.log('Error on sendToSlackClean');
        });
}

async function createC4CCustomer(customerDetails, traceCtxHeaders) {

   var customersUrl = c4cgatewayurl + customerODataPath;

	let response = await axios.get(customersUrl + "?$filter=Email eq '" + customerDetails.Email + "'", {headers:traceCtxHeaders})
    .catch(function(error) {
        console.log('Error on createC4CCustomer:' + error);
        return '';
    });

	if (response.data.d.results[0]) {
        console.log("Found existing IndividualCustomer, doing nothing");

console.log(JSON.stringify(response.data.d.results[0]));
        var customerID = response.data.d.results[0].CustomerID;

        return customerID;
}
    else {
        console.log("Inside else, create new customer...");
        let response = await axios.post(customersUrl, customerDetails, {headers:traceCtxHeaders})
        .catch(function(error) {
            console.log('Error on createC4CCustomer: ' + error);
        });

console.log(JSON.stringify(response.data.d.results));
        var customerID = response.data.d.results.CustomerID;

        return customerID;
    }

}

async function createC4CTicket(customerID, customerDetails, comment, traceCtxHeaders) {

	var ticketUrl = c4cgatewayurl + ticketODataPath;

    var ticketDetailsC4C = {
    	"ServicePriorityCode" : "2",
        "ProcessingTypeCode": "SRRQ",
        "Name" : "Negative product review from " + customerDetails.Email,
        "BuyerPartyID": customerID,
        "ServiceRequestTextCollection" :[{
        "TypeCode": "10004",
           "Text": comment
        }]
    };

    let response = await axios.post(ticketUrl, ticketDetailsC4C, {headers:traceCtxHeaders})
    .catch(function(error) {
        console.log('Error on createC4CTicket: ' + error);
    });
}

function extractTraceHeaders(headers) {

    var map = {};
    for (var i in traceHeaders) {
        h = traceHeaders[i]
        headerVal = headers[h]
        if (headerVal !== undefined) {
            map[h] = headerVal
        }
    }
    return map;

}
