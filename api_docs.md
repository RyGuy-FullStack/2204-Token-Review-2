# Adventure Away API Documentation

## Introduction

Here at Adventure Away we strive to provide you with an easy to consume API, so you can build out beautiful front end experiences and leave the Data management to us.

We have a small handful of endpoints, each documented below.

### API URL Format

All API urls (aside from the two test endpoints) are versioned by which cohort you are a part of. This is to give students the best experience possible (avoiding thousands of vacations to sift through), and to show you a form of versioning.

Our versioning works like this

- The base URL is `http://localhost:4000`
- The first segment of path is `/api`, every endpoint available to you has that prefix. If you stop there (i.e. if you go to `http://localhost:4000/api`) you will find this documentation.
- The next segment of path is your cohort name, e.g. `/2004-UNF-HY-WEB-PT` or `/2006-CPU-RM-WEB-PT`
- The last segment of path is based on the resource or action you are taking, e.g. `/vacations` to fetch all vacations.

So, for example, a call for all vacations for the class going by the name **2004-UNF-HY-WEB-PT** would use the URL `http://localhost:4000/api/2004-UNF-HY-WEB-PT/vacations`.

### Authentication through JSON Web Tokens

When using the API, many calls are made in the context of a registered guest. The API protects itself by requiring a token string passed in the Header for requests made in that context.

A sample request **with** an authorization token looks like this:

```js
fetch('http://localhost:4000/api/COHORT-NAME/vacations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
  body: JSON.stringify({ /* whatever things you need to send to the API */ })
})
```

It is **crucial** that the value for `Authorization` is a string starting with `Bearer`, followed by a space, and finished with the `token` you receive either by registering or logging in. Deviating from this format will cause the API to not recognize the token, and will result in an error.

If the token is malformed, missing, or has been revoked, you will get a response specific to that.

```js
{
    "success": false,
    "error": {
        "type": "InvalidToken",
        "message": "Invalid token, please sign up or log in"
    },
    "data": null
}
```

### General Return Schema

```js
{
  success: false, // or true
  error: {
    name: "ErrorName",
    message: "This is an error message."
  }, // or null
  data: {
    guest: { username: "janesmyth" },
    message: "This is a data message."
  } // or null
}
```

Since a `success` or `error` is present in each call, we will only discuss the `data` object returned from the calls described below.

## Guest Endpoints

### `POST /api/COHORT-NAME/guests/register`

This route is used to create a new guest account. On success, you will be given a JSON Web Token to be passed to the server for requests requiring authentication.

#### Request Parameters

* `guest` (`object`, required)
    * `username` (`string`, required): the desired username for the new guest
    * `password` (`string`, required): the desired password for the new guest

#### Return Parameters

* `token` (`string`): the JSON Web Token which is used to authenticate the guest with any future calls

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/guests/register', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    guest: {
      username: 'superman27',
      password: 'krypt0n0rbust'
    }
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

If the API creates a new guest, the following object will be returned:

```js
{
  "success": true,
  "error": null,
  "data": {
    "token": "xyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg5MDY2ZGQ0MzkxNjAwTc1NTNlMDUiLCJ1c2VybmFtZSI6Im1hdHQiLCJpYXQiOjE1ODYwMzgzODF9.CTj4owBl0PB-G6G4E_1l6DS6_cVc0iKcMzBIWFUYM1p",
    "message": "Thanks for signing up for our service."
  }
}
```

### `POST /api/COHORT-NAME/guests/login`

This route is used for a guest to login when they already have an account. On success, you will be given a JSON Web Token to be passed to the server for requests requiring authentication.

#### Request Parameters

* `guest` (`object`, required)
    * `username` (`string`, required): the registered username for the guest
    * `password` (`string`, required): the matching password for the guest

#### Return Parameters

* `token` (`string`): the JSON Web Token which is used to authenticate the guest with any future calls

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/guests/login', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    guest: {
      username: 'superman27',
      password: 'krypt0n0rbust'
    }
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

If the API authenticates the username and password, the following object will be returned:

```js
{
  "success": true,
  "error": null,
  "data": {
    "token": "xyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg5MDY2ZGQ0MzkxNjAwTc1NTNlMDUiLCJ1c2VybmFtZSI6Im1hdHQiLCJpYXQiOjE1ODYwMzgzODF9.CTj4owBl0PB-G6G4E_1l6DS6_cVc0iKcMzBIWFUYM1p",
    "message": "Thanks for logging in to our service."
  }
}
```

### `GET /api/COHORT-NAME/guests/me`

This route is used to grab an already logged in guest's relevant data. It includes comments they have received, which might be useful if you wish to build out notifications for the guest. You must pass a valid token with this request, or it will be rejected.

#### Request Parameters

No request parameters are necessary for this route.

#### Return Parameters

* `guest` (`object`)
    * `vacations` (`array` of `vacation`): an array of vacation objects made by the guest
    * `comments` (`array` of `comment`): an array of comments made on vacations made to or by the guest
    * `id` (`string`): the database identifier of the guest
    * `username` (`string`): the username of the guest

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/guests/me', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
    "vacations": [
        {
            "location": "[On Request]",
            "comments": [
                {
                    "id": "5e8d1f2539e7a70017a7c968",
                    "guest": {
                        "id": "5e8d1f2539e7a70017a7c962",
                        "username": "jane1234"
                    },
                    "content": "I am very much in the market for a fine violin."
                }
            ],
            "id": "5e8d1f2539e7a70017a7c964",
            "guestId": "5e8d1f2539e7a70017a7c961",
            "description": "I've really only used this three or four times.  I thought it would be a good purchase, shows what I know.",
            "price": "$14.3 million",
            "createdAt": "2020-04-08T00:47:33.794Z",
            "updatedAt": "2020-04-08T00:47:33.865Z",
        },
        {
            "location": "Bronx, NY",
            "comments": [],
            "id": "5e8d1f8647b6ce0017600593",
            "price": "3.88",
            "description": "This is a 19 speed bicycle, barely used.",
            "guestId": "5e8d1f2539e7a70017a7c961",
            "createdAt": "2020-04-08T00:49:10.248Z",
            "updatedAt": "2020-04-08T00:49:10.248Z",
        }
    ],
    "comments": [
        {
            "id": "5e8d1f2539e7a70017a7c968",
            "vacation": {
                "id": "5e8d1f2539e7a70017a7c964",
            },
            "guest": {
                "id": "5e8d1f2539e7a70017a7c962",
                "username": "jane1234"
            },
            "content": "I am very much in the market for a fine violin."
        },
        {
            "id": "5e8d1f2539e7a70017a7c969",
            "vacation": {
                "id": "5e8d1f2539e7a70017a7c965",
            },
            "guest": {
                "id": "5e8d1f2539e7a70017a7c961",
                "username": "joe1234"
            },
            "content": "OMG Puppies... I'll take them all!"
        },
        {
            "id": "5e8d1fd747b6ce0017600594",
            "content": "I really love this item.  Can I have it?",
            "vacation": {
                "id": "5e8d1f2539e7a70017a7c965",
            },
            "guest": {
                "id": "5e8d1f2539e7a70017a7c961",
                "username": "joe1234"
            }
        }
    ],
    "id": "5e8d1f2539e7a70017a7c961",
    "username": "joe1234",
}
```
## Posts

The main data type is a `vacation`, not to be confused with a POST request. A vacation holds information about items for sale, including their cost, description, who posted it, and where they are located.

### `GET /api/COHORT-NAME/vacations`

A request to this endpoint fetches an array of `vacation` objects.

#### Request Parameters

No request parameters are necessary for this route.

#### Return Parameters

* `vacations` (`array` of `object`):
    * `id` (`string`): This is the database identifier for the `vacation` object.
    * `guest` (`object`)
        * `id` (`string`): This is the database identifier for the `guest` which created this `vacation`
        * `username` (`string`): This is the username for the `guest` which created this `vacation`
    * `description` (`string`): This is the description of the posted item.
    * `isCreator` (`boolean`): If a valid token is present with the request, `isCreator` will be true for any vacation made by the logged in guest.
    * `location` (`string`): This is the location of the posted item.
    * `comment` (`array` of `comment` objects): If a valid token is present with the request, and `isCreator` is true, this will contain an array of comments left for this posted item. If either is are not, this will be an empty array.
        * `guest` (`object`)
            * `id` (`string`): This is the database identifier for the `guest` which created this `comment`
            * `username` (`string`): This is the username for the `guest` which created this `comment`
        * `content` (`string`): This is the text content of the message
    * `createdAt` and `updatedAt` (`string`): These are the timestamps for when the vacation was inserted into the database, or most recently updated.

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/vacations')
  .then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
    "success": true,
    "error": null,
    "data": {
        "vacations": [
            {
                "location": "[On Request]",
                "comments": [],
                "id": "5e8d1a02829c8e0017c20b58",
                "guestId": {
                    "id": "5e8d1a02829c8e0017c20b55",
                    "username": "joe1234"
                },
                "description": "I've really only used this three or four times.  I thought it would be a good purchase, shows what I know.",
                "price": "$14.3 million",
                "createdAt": "2020-04-08T00:25:38.106Z",
                "updatedAt": "2020-04-08T00:25:38.264Z",
                "isCreator": false
            },
            {
                "location": "[On Request]",
                "comments": [],
                "id": "5e8d1a02829c8e0017c20b59",
                "guestId": {
                    "id": "5e8d1a02829c8e0017c20b56",
                    "username": "jane1234"
                },
                "description": "Not looking for any money, just want to find a good home for these four beautiful pups.",
                "price": "free",
                "createdAt": "2020-04-08T00:25:38.167Z",
                "updatedAt": "2020-04-08T00:25:38.268Z",
                "isCreator": false
            },
            {
                "location": "Downtown Los Angeles, CA",
                "comments": [],
                "id": "5e8d1a02829c8e0017c20b5a",
                "guestId": {
                    "id": "5e8d1a02829c8e0017c20b56",
                    "username": "jane1234"
                },
                "description": "This freezer is nearly 50 years old, but still works perfectly.  It is quite heavy, so I will need some help moving it.",
                "price": "$50",
                "createdAt": "2020-04-08T00:25:38.168Z",
                "updatedAt": "2020-04-08T00:25:38.168Z",
                "isCreator": false
            },
            {
                "location": "Ames, IA",
                "comments": [],
                "id": "5e8d1a02829c8e0017c20b5b",
                "guestId": {
                    "id": "5e8d1a02829c8e0017c20b57",
                    "username": "caesar1234"
                },
                "description": "To be honest, it is more amazing than my resolve.",
                "price": "$1400, OBO",
                "createdAt": "2020-04-08T00:25:38.186Z",
                "updatedAt": "2020-04-08T00:25:38.273Z",
                "isCreator": false
            }
        ]
    }
}
```

### `POST /api/COHORT-NAME/vacations`

A request to this endpoint will attempt to create a new post. You must pass a valid token with this request, or it will be rejected.

#### Request Parameters

* `vacation` (`object`, required)
    * `description` (`string`, required): the description of the posted item
    * `location` (`string`, optional): the location of the posted item, will default to `[On Request]` if not supplied

#### Return Parameters

* `vacation` (`object`)
    * `id` (`string`): This is the database identifier for the `vacation` object.
    * `guest` (`object`)
        * `id` (`string`): This is the database identifier for the `guest` which created this `vacation`
        * `username` (`string`): This is the username for the `guest` which created this `vacation`
    * `description` (`string`): This is the description of the posted item.
    * `isCreator` (`boolean`): If a valid token is present with the request, `isCreator` will be true for any vacation made by the logged in guest.
    * `location` (`string`): This is the location of the posted item.
    * `comment` (`array` of `comment` objects): If a valid token is present with the request, and `isCreator` is true, this will contain an array of comments left for this posted item. If either is are not, this will be an empty array.
        * `guest` (`object`)
            * `id` (`string`): This is the database identifier for the `guest` which created this `comment`
            * `username` (`string`): This is the username for the `guest` which created this `comment`
        * `content` (`string`): This is the text content of the message
    * `createdAt` and `updatedAt` (`string`): These are the timestamps for when the vacation was inserted into the database, or most recently updated.

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/vacations', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
  body: JSON.stringify({
    post: {
      title: "My favorite stuffed animal",
      description: "This is a pooh doll from 1973. It has been carefully taken care of since I first got it.",
      price: "$480.00",
      willDeliver: true
    }
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
    "success": true,
    "error": null,
    "data": {
        "vacation": {
            "location": "Bronx, NY",
            "comments": [],
            "id": "5e8d1bd48829fb0017d2233b",
            "price": "3.88",
            "description": "This is a 19 speed bicycle, barely used.",
            "guestId": {
                "id": "5e8d1a02829c8e0017c20b55",
                "username": "joe1234"
            },
            "createdAt": "2020-04-08T00:33:24.157Z",
            "updatedAt": "2020-04-08T00:33:24.157Z",
            "isCreator": true
        }
    }
}
```

### `PATCH /api/COHORT-NAME/vacations/VACATION_ID`

This endpoint will edit a vacation whose `id` is equal to `VACATION_ID`.  The request will be rejected if it is either missing a valid token, or if the guest represented by the token is not the guest that created the original post.

#### Request Parameters

Only the fields in the request will be updated.

* `vacation` (`object`, required)
    * `description` (`string`, optional): the description of the posted item
    * `location` (`string`, optional): the location of the posted item

#### Return Parameters

* `vacation` (`object`): The UPDATED version of the post
    * `id` (`string`): This is the database identifier for the `vacation` object.
    * `guest` (`object`)
        * `id` (`string`): This is the database identifier for the `guest` which created this `vacation`
        * `username` (`string`): This is the username for the `guest` which created this `vacation`
    * `description` (`string`): This is the description of the posted item.
    * `isCreator` (`boolean`): If a valid token is present with the request, `isCreator` will be true for any vacation made by the logged in guest.
    * `location` (`string`): This is the location of the posted item.
    * `comments` (`array` of `comment` objects): If a valid token is present with the request, and `isCreator` is true, this will contain an array of comments left for this posted item. If either is are not, this will be an empty array.
        * `guest` (`object`)
            * `id` (`string`): This is the database identifier for the `guest` which created this `comment`
            * `username` (`string`): This is the username for the `guest` which created this `comment`
        * `content` (`string`): This is the text content of the message
    * `createdAt` and `updatedAt` (`string`): These are the timestamps for when the vacation was inserted into the database, or most recently updated.

#### Sample Call

```js
fetch('http://adventure-away.herokuapp.com/api/COHORT-NAME/vacations/5e8d1bd48829fb0017d2233b', {
  method: "PATCH",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
  body: JSON.stringify({
    post: {
      title: "My favorite stuffed animal",
      description: "This is a pooh doll from 1973. It has been carefully taken care of since I first got it.",
      price: "$480.00",
      location: "New York, NY",
      willDeliver: true
    }
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
    "success": true,
    "error": null,
    "data": {
        "vacation": {
            "location": "Bronx, NY",
            "comments": [],
            "id": "5e8d1bd48829fb0017d2233b",
            "price": "3.88",
            "description": "This is a 19 speed bicycle, barely used.",
            "guestId": {
                "id": "5e8d1a02829c8e0017c20b55",
                "username": "joe1234"
            },
            "createdAt": "2020-04-08T00:33:24.157Z",
            "updatedAt": "2020-04-08T00:33:24.157Z",
            "isCreator": true
        }
    }
}
```

### `DELETE /api/COHORT-NAME/vacations/VACATION_ID`

This endpoint will delete a vacation whose `id` is equal to `VACATION_ID`.  The request will be rejected if it is either missing a valid token, or if the guest represented by the token is not the guest that created the original post.


#### Request Parameters

There are no request parameters.

#### Return Parameters

There are no return parameters.

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/vacations/5e8d1bd48829fb0017d2233b', {
  method: "DELETE",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  }
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
  success: true,
  error: null,
  data: null
}
```

## Messages

A `comment` is associated both to a specific `vacation`, as well as to the `guest` which creates the message.

### `POST /api/COHORT-NAME/vacations/VACATION_ID/comments`

This endpoint will create a new message for a vacation whose `id` is equal to `VACATION_ID`.  You must pass a valid token with this request, or it will be rejected.

#### Request Parameters

* `comment` (`object`, required)
    * `content` (`string`, required): The content of the message

#### Return Parameters

* `comment` (`object`)
    * `id` (`string`): The database identifier of the new message
    * `content` (`string`): The content of the new message
    * `vacation` (`string`): The database identifier of the posting the message is for
    * `guest` (`string`): The database identifier of the author of the message
    * `createdAt` and `updatedAt` (`string`): These are the timestamps for when the vacation was inserted into the database, or most recently updated

#### Sample Call

```js
fetch('http://localhost:4000/api/COHORT-NAME/vacations/5e8929ddd439160017553e06/comments', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
  body: JSON.stringify({
    message: {
      content: "Do you still have this?  Would you take $10 less?"
    }
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
    "success": true,
    "error": null,
    "data": {
        "message": {
            "id": "5e8d1fd747b6ce0017600594",
            "content": "I really love this item.  Can I have it?",
            "vacation": "5e8d1f2539e7a70017a7c965",
            "guest": "5e8d1f2539e7a70017a7c961",
            "createdAt": "2020-04-08T00:50:31.402Z",
            "updatedAt": "2020-04-08T00:50:31.402Z",
        }
    }
}
```
