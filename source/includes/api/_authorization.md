## Authorization

When you have authenticated, the next test is to decide whether you
are permitted to perform certain tasks. This is called authorization.

### Roles

Role&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description
-------------------|------------
`_reader`          | Gives the user permission to read documents (except design documents) from the database.
`_writer`          | Gives the user permission to create, update, and delete documents (except design documents) in the database.
`_admin`           | Gives the user all permissions, including setting permissions.
`_replicator`      | Gives the user permission to replicate a database, including creating checkpoints.
`_db_updates`      | Gives the user permission to use the global changes feed.
`_design`          | Gives the user permission to read design documents.
`_shards`          | Gives the user access to the `/$DB/_shards` endpoint.
`_security`        | Gives the user permission to read from the `/_api/v2/db/$DB/_security` endpoint

The credentials you use to log in to the dashboard automatically have `_admin` permissions to all databases you create. Everyone and everything else, from users you share databases with to API keys you create, must be given a permission level explicitly.

### Viewing Permissions

> Example request to determine permissions:

```http
GET /_api/v2/db/$DATABASE/_security HTTP/1.1
```

```shell
curl https://$USERNAME.cloudant.com/_api/v2/db/$DATABASE/_security \
     -u $USERNAME
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");

account.request({
  db: $DATABASE,
  path: '_security'
}, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

To see who has permissions to read, write, and manage the database, make a GET request against `https://$USERNAME.cloudant.com/_api/v2/db/$DATABASE/_security`.

<div></div>

> Example response:

```json
{
  "cloudant": {
    "antsellseadespecteposene": [
      "_reader",
      "_writer",
      "_admin"
    ],
    "garbados": [
      "_reader",
      "_writer",
      "_admin"
    ],
    "nobody": [
      "_reader"
    ]
  },
  "_id": "_security"
}
```

The `cloudant` field in the response object contains an object with keys that are the usernames that have permission to interact with the database.
The `nobody` username indicates what rights are available to unauthenticated users -- that is, any request made without authentication credentials.
In the example response, for instance, `nobody` has `_reader` permissions, making the database publicly readable.

### Modifying Permissions

A video overview about changing database permissions is available:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/uxlbbdAvawU?rel=0" frameborder="0" allowfullscreen title="Changing database permissions, video overview"></iframe>

<div></div>

> Modification request:

```http
PUT /_api/v2/db/$DATABASE/_security HTTP/1.1
Content-Type: application/json
```

```shell
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_api/v2/db/$DATABASE/_security \
     -X PUT \
     -H "Content-Type: application/json" \
     -d "$JSON"
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");

account.request({
  db: $DATABASE,
  path: '_security',
  method: 'PUT',
  body: '$JSON'
}, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

```json
{
  "cloudant": {
    "antsellseadespecteposene": [
      "_reader",
      "_writer",
      "_admin"
    ],
    "garbados": [
      "_reader",
      "_writer",
      "_admin"
    ],
    "nobody": [
      "_reader"
    ]
  }
}
```

To modify who has permissions to read, write, and manage a database, make a PUT request against `https://$USERNAME.cloudant.com/_api/v2/db/$DB/_security`. To see what roles you can assign, see [Roles](#roles).

The request object's `cloudant` field contains an object whose keys are usernames with permissions to interact with the database. The `nobody` username indicates what rights are available to unauthenticated users -- that is, anybody. In the example request, for instance, `nobody` has `_reader` permissions, making the database publicly readable.

<div></div>

> Example response:

```json
{
  "ok" : true
}
```

The response tells you whether the update has been successful.

### Creating API Keys

<aside class="warning">The earlier method of generating API keys by `POST`ing to `https://cloudant.com/api/generate_api_key` is now deprecated.</aside>

API keys allow you to give access to a person or application without having to create a new Cloudant account.
An API key consists of a randomly generated username and password.
The key is given the desired access permissions.
Once generated,
the API key can be used in the same way as a normal user account,
for example by granting read,
write,
or admin access permissions.

<aside class="warning">If you choose to generate an API key through the dashboard,
remember to record the key name and password.
These are both randomly generated,
and cannot be retrieved if lost or forgotten.</aside>

<aside class="warning">IBM Cloudant Data Layer Local Edition ("Cloudant Local") does not support API Keys.
For a similar capability,
create "CouchDB" style users,
as described in the [IBM Knowledge Center](http://www-01.ibm.com/support/knowledgecenter/SSTPQH_1.0.0/com.ibm.cloudant.local.install.doc/topics/clinstall_db_security.html).</aside>

<div></div>

> Example request to create an API key:

```http
POST https://<username>.cloudant.com/_api/v2/api_keys HTTP/1.1
```

```shell
curl -X POST https://$USERNAME:$PASSWORD@cloudant.com/_api/v2/api_keys
```

```javascript
var nano = require('nano');
var account = nano("https://$USERNAME:$PASSWORD@cloudant.com");

account.request({
  db: '_api',
  path: 'v2/api_keys',
  method: 'POST'
}, function (err, body) {
  if (!err) {
    console.log(body);
  }
});
```

> Example response:

```json
{
  "password": "YPNCaIX1sJRX5upaL3eqvTfi", 
  "ok": true, 
  "key": "blentfortedsionstrindigl"
}
```

To generate an API key,
use `https://<username>.cloudant.com/_api/v2/api_keys`.
Next,
assign the API key to a database by using a `PUT` request to `https://<username>.cloudant.com/_api/v2/db/<database>/_security`.
Once assigned to a database,
the key can be granted access permissions.
By default,
an API key has no permissions for anything,
and must be given permissions explicitly.

The response contains the generated key and password.
