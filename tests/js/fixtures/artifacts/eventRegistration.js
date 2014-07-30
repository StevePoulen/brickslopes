var eventRegistration = {
    '2' : {
        "registrationId": 27,
        "ageVerification": "YES",
        "comments": "This is my comment",
        "paid": "NO",
        "name": "BrickSlopes - Salt Lake City",
        "lineItems": {
            "total": '25.00',
            "lineItems": [
                {
                    "registrationLineItemId": 1,
                    "lineItem": "T-Shirt",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 2,
                    "lineItem": "Complete Name Badge",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 3,
                    "lineItem": "Event Badge Brick",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "2015 BrickSlopes",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 4,
                    "lineItem": "1st Badge Brick",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "Badge Line Two",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 5,
                    "lineItem": "2nd Badge Brick",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "Badge Line Three",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 6,
                    "lineItem": "Meet and Greet",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 7,
                    "lineItem": "Draft - $15",
                    "amount": "15.00",
                    "total": "15.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 8,
                    "lineItem": "Draft - $25",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                }
            ]
        }
    }
};

var eventRegistrationPaid = {
    '1' : {
        "ageVerification": "YES",
        "paid": "YES",
        "name": "BrickSlopes - Salt Lake City",
        "lineItems": {
            "total": '25.00',
            "lineItems": [
                {
                    "registrationLineItemId": 1,
                    "lineItem": "T-Shirt",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                }
            ]
        }
    }
};

var eventRegistrationNoMeetAndGreet = {
    '2': {
        "ageVerification": "YES",
        "paid": "NO",
        "name": "BrickSlopes - Salt Lake City",
        "lineItems": {
            "total": '25.00',
            "lineItems": [
                {
                    "registrationLineItemId": 1,
                    "lineItem": "T-Shirt",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                }
            ]
        }
    }
};

var eventRegistrationNoTShirt = {
    '3': {
        "ageVerification": "YES",
        "paid": "NO",
        "name": "BrickSlopes - Salt Lake City",
        "lineItems": {
            "total": '25.00',
            "lineItems": [
                {
                    "registrationLineItemId": 1,
                    "lineItem": "Meet and Greet",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                }
            ]
        }
    }
};

var eventRegistrationBadgeLineOneOnly = {
    '4': {
        "ageVerification": "YES",
        "paid": "NO",
        "name": "BrickSlopes - Salt Lake City",
        "lineItems": {
            "total": '25.00',
            "lineItems": [
                {
                    "registrationLineItemId": 1,
                    "lineItem": "Event Badge Brick",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "Badge Line One",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "YES",
                    "entryDate": "2014-04-04 18:50:00" 
                },
                {
                    "registrationLineItemId": 2,
                    "lineItem": "1st Badge Brick",
                    "amount": "25.00",
                    "total": "25.00",
                    "paid": "NO",
                    "discount": "NO",
                    "description": "Badge Line Two",
                    "size": "X-Large",
                    "quantity": 1,
                    "active": "NO",
                    "entryDate": "2014-04-04 18:50:00" 
                }
            ]
        }
    }
};
