## Documents

Documents are [JSON objects](http://en.wikipedia.org/wiki/JSON#Data_types.2C_syntax_and_example).
Documents are containers for your data, and are the basis of the Cloudant database.

All documents must have two fields:
a unique `_id` field, and a `_rev` field.
The `_id` field is either created by you,
or generated automatically as a [UUID](http://en.wikipedia.org/wiki/Universally_unique_identifier) by Cloudant.
The `_rev` field is a revision number, and is [essential to Cloudant's replication protocol](mvcc.html).
In addition to these two mandatory fields, documents can contain any other content expressed using JSON.

<aside>Cloudant uses an [eventually consistent](./basics.html#consistency) model for data. This means that under some conditions, it is possible that if your application performs a document write or update, followed immediately by a read of the same document, older document content is retrieved. In other words, your application would see the document content as it was *before* the write or update occurred. For more information about this, see the topic on [Consistency](./basics.html#consistency).</aside>

<h3 id="documentCreate">Create</h3>

> Creating a document:

```http
POST /$DATABASE HTTP/1.1
Content-Type: application/json
```

```shell
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/$DATABASE \
     -X POST \
     -H "Content-Type: application/json" \
     -d "$JSON"
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

db.insert($JSON, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

```json
{
  "_id": "apple",
  "item": "Malus domestica",
  "prices": {
    "Fresh Mart": 1.59,
    "Price Max": 5.99,
    "Apples Express": 0.79
  }
}
```

To create a document, make a POST request with the document's JSON content to `https://$USERNAME.cloudant.com/$DATABASE`.

<div></div>

> Example response:

```json
{
  "ok":true,
  "id":"apple",
  "rev":"1-2902191555"
}
```

The response is a JSON document containing the ID of the created document, the revision string, and `"ok": true`. If you did not provide an `_id` field, Cloudant generates one automatically as a [UUID](http://en.wikipedia.org/wiki/Universally_unique_identifier). If creation of the document failed, the response contains a description of the error.

<aside>If the write quorum cannot be met, a [`202` response](http.html#202) is returned.</aside>

### Read

> Reading a document:

```http
GET /$DATABASE/$DOCUMENT_ID HTTP/1.1
```

```shell
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

db.get($JSON._id, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

To retrieve a document, make a GET request to `https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID`.
If you do not know the `_id` for a particular document,
you can [query the database](database.html#get-documents) for all documents.

<div></div>

> Example response:

```json
{
  "_id": "apple",
  "_rev": "1-2902191555",
  "item": "Malus domestica",
  "prices": {
    "Fresh Mart": 1.59,
    "Price Max": 5.99,
    "Apples Express": 0.79
  }
}
```

The response contains the document you requested or a description of the error, if the document could not be retrieved.

<aside class="warning">
Due to the distributed, eventually consistent nature of Cloudant, reads might return stale data. In particular, data that has just been written, even by the same client, might not be returned from a read request immediately following the write request. To work around this behaviour, a client can cache state locally. Caching also helps to keep request counts down and thus increase application performance and decrease load on the database cluster. This also applies to requests to map-reduce and search indexes.
</aside>

### Read Many

To fetch many documents at once, [query the database](database.html#get-documents).

### Update

> Updating a document

```http
PUT /$DATABASE/$DOCUMENT_ID HTTP/1.1
```

```shell
// make sure $JSON contains the correct `_rev` value!
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID \
     -X PUT \
     -H "Content-Type: application/json" \
     -d "$JSON"
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

// make sure $JSON contains the correct `_rev` value!
$JSON._rev = $REV;

db.insert($JSON, $JSON._id, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

```json
{
  "_id": "apple",
  "_rev": "1-2902191555",
  "item": "Malus domestica",
  "prices": {
    "Fresh Mart": 1.59,
    "Price Max": 5.99,
    "Apples Express": 0.79,
    "Gentlefop's Shackmart": 0.49
  }
}
```

To update (or create) a document, make a PUT request with the updated JSON content *and* the latest `_rev` value (not needed for creating new documents) to `https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID`.

<aside>If you fail to provide the latest `_rev`, Cloudant responds with a [409 error](http.html#409).
This error prevents you overwriting data changed by other processes. If the write quorum cannot be met, a [`202` response](http.html#202) is returned.</aside>

<div></div>

> Example response:

```json
{
  "ok":true,
  "id":"apple",
  "rev":"2-9176459034"
}
```

The response contains the ID and the new revision of the document or an error message in case the update failed.

<div id="document-delete"></div>

### Delete

> Delete request

```http
DELETE /$DATABASE/$DOCUMENT_ID?rev=$REV HTTP/1.1
```

```shell
// make sure $JSON contains the correct `_rev` value!
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID?rev=$REV -X DELETE
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

// make sure $JSON contains the correct `_rev` value!
db.destroy($JSON._id, $REV, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

To delete a document, make a DELETE request with the document's latest `_rev` in the querystring, to `https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID`.

<aside>If you fail to provide the latest `_rev`, Cloudant responds with a [409 error](basics.html#http-status-codes).
This error prevents you overwriting data changed by other clients. If the write quorum cannot be met, a [`202` response](http.html#202) is returned.</aside>

<aside class="warning">
CouchDB doesn’t completely delete the specified document. Instead, it leaves a tombstone with very basic information about the document. The tombstone is required so that the delete action can be replicated. Since the tombstones stay in the database indefinitely, creating new documents and deleting them increases the disk space usage of a database and the query time for the primary index, which is used to look up documents by their ID.
</aside>

<div></div>

> Deletion response:

```json
{
  "id" : "apple",
  "ok" : true,
  "rev" : "3-2719fd4118"
}
```

The response contains the ID and the new revision of the document or an error message in case the update failed.

### Bulk Operations

The bulk document API allows you to create and update multiple documents at the same time within a single request. The basic operation is similar to creating or updating a single document, except that you batch the document structure and information. When creating new documents the document ID is optional. For updating existing documents, you must provide the document ID, revision information, and new document values.

<div></div>

#### Request Body

> Request to update/create/delete multiple documents:

```http
POST /$DATABASE/_bulk_docs HTTP/1.1
Content-Type: application/json
```

```shell
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/$DATABASE/_bulk_docs -X POST -H "Content-Type: application/json" -d "$JSON"
```

```javascript
var nano = require('nano');
var account = nano("https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com");
var db = account.use($DATABASE);

db.bulk($JSON, function (err, body) {
  if (!err) {
    console.log(body);
  }
});
```

```json
{
  "docs": [
    {
      "name": "Nicholas",
      "age": 45,
      "gender": "female",
      "_id": "96f898f0-f6ff-4a9b-aac4-503992f31b01",
      "_rev": "1-54dd23d6a630d0d75c2c5d4ef894454e"
    },
    {
      "name": "Taylor",
      "age": 50,
      "gender": "female"
    },
    {
      "_id": "d1f61e66-7708-4da6-aa05-7cbc33b44b7e",
      "_rev": "1-a2b6e5dac4e0447e7049c8c540b309d6",
      "_deleted": true
    }
  ]
}
```

For both inserts and updates the basic structure of the JSON document in the request is the same:

<table>
<colgroup>
<col width="15%" />
<col width="36%" />
<col width="26%" />
<col width="15%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Field</th>
<th align="left">Description</th>
<th align="left">Type</th>
<th align="left">Optional</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>docs</code></td>
<td align="left">Bulk Documents Document</td>
<td align="left">array of objects</td>
<td align="left">no</td>
</tr>
</tbody>
</table>

#### Object in `docs` array

<table>
<colgroup>
<col width="15%" />
<col width="41%" />
<col width="10%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Field</th>
<th align="left">Description</th>
<th align="left">Type</th>
<th align="left">Optional</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>_id</code></td>
<td align="left">Document ID</td>
<td align="left">string</td>
<td align="left">optional only for new documents</td>
</tr>
<tr class="even">
<td align="left"><code>_rev</code></td>
<td align="left">Document revision</td>
<td align="left">string</td>
<td align="left">mandatory for updates and deletes, not used for new documents</td>
</tr>
<tr class="odd">
<td align="left"><code>_deleted</code></td>
<td align="left">Whether the document should be deleted</td>
<td align="left">boolean</td>
<td align="left">yes</td>
</tr>
</tbody>
</table>

#### Response

> Example response:

```json
[{
  "id": "96f898f0-f6ff-4a9b-aac4-503992f31b01",
  "rev": "2-ff7b85665c4c297838963c80ecf481a3"
}, {
  "id": "5a049246-179f-42ad-87ac-8f080426c17c",
  "rev": "2-9d5401898196997853b5ac4163857a29"
}, {
  "id": "d1f61e66-7708-4da6-aa05-7cbc33b44b7e",
  "rev": "2-cbdef49ef3ddc127eff86350844a6108"
}]
```

The HTTP status code tells you whether the request was fully or partially successful. In the response body, you get an array with detailed information for each document in the request.

<table>
<colgroup>
<col width="7%" />
<col width="92%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Code</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">201</td>
<td align="left">All documents have been created or updated.</td>
</tr>
<tr class="even">
<td align="left">202</td>
<td align="left">For at least one document, the write quorum has not been met.</td>
</tr>
</tbody>
</table>

#### Inserting Documents in Bulk

> Example bulk insert of three documents:

```
{
  "docs": [{
    "name": "Nicholas",
    "age": 45,
    "gender": "male",
    "_id": "96f898f0-f6ff-4a9b-aac4-503992f31b01",
    "_attachments": {

    }
  }, {
    "name": "Taylor",
    "age": 50,
    "gender": "male",
    "_id": "5a049246-179f-42ad-87ac-8f080426c17c",
    "_attachments": {

    }
  }, {
    "name": "Owen",
    "age": 51,
    "gender": "male",
    "_id": "d1f61e66-7708-4da6-aa05-7cbc33b44b7e",
    "_attachments": {

    }
  }]
}
```

To insert documents in bulk into a database you need to supply a JSON structure with the array of documents that you want to add to the database. You can either include a document ID for each document, or allow the document ID to be automatically generated.

<div></div>

> Example response header after bulk insert of three documents:

```
201 Created
Cache-Control: must-revalidate
Content-Length: 269
Content-Type: application/json
Date: Mon, 04 Mar 2013 14:06:20 GMT
server: CouchDB/1.0.2 (Erlang OTP/R14B)
x-couch-request-id: e8ff64d5
```

> Example response content after bulk insert of three documents:

```
    [{
      "id": "96f898f0-f6ff-4a9b-aac4-503992f31b01",
      "rev": "1-54dd23d6a630d0d75c2c5d4ef894454e"
    }, {
      "id": "5a049246-179f-42ad-87ac-8f080426c17c",
      "rev": "1-0cde94a828df5cdc0943a10f3f36e7e5"
    }, {
      "id": "d1f61e66-7708-4da6-aa05-7cbc33b44b7e",
      "rev": "1-a2b6e5dac4e0447e7049c8c540b309d6"
    }]
```

The return code from a successful bulk insertion is [`201`](http.html#201),
with the content of the returned structure indicating specific success or otherwise messages on a per-document basis.

The return structure from the example contains a list of the documents created, including their revision and ID values.

The content and structure of the returned JSON depends on the transaction semantics being used for the bulk update; see [Bulk Documents Transaction Semantics](#bulk-documents-transaction-semantics) for more information. Conflicts and validation errors when updating documents in bulk must be handled separately; see [Bulk Document Validation and Conflict Errors](#bulk-document-validation-and-conflict-errors).

<div></div>

#### Updating Documents in Bulk

> Example request to perform bulk update:

```
POST /test/_bulk_docs HTTP/1.1
Accept: application/json
```

> Example JSON to bulk update documents:

```
{
  "docs": [{
    "name": "Nicholas",
    "age": 45,
    "gender": "female",
    "_id": "96f898f0-f6ff-4a9b-aac4-503992f31b01",
    "_attachments": {

    },
    "_rev": "1-54dd23d6a630d0d75c2c5d4ef894454e"
  }, {
    "name": "Taylor",
    "age": 50,
    "gender": "female",
    "_id": "5a049246-179f-42ad-87ac-8f080426c17c",
    "_attachments": {

    },
    "_rev": "1-0cde94a828df5cdc0943a10f3f36e7e5"
  }, {
    "name": "Owen",
    "age": 51,
    "gender": "female",
    "_id": "d1f61e66-7708-4da6-aa05-7cbc33b44b7e",
    "_attachments": {

    },
    "_rev": "1-a2b6e5dac4e0447e7049c8c540b309d6"
  }]
}
```

The bulk document update procedure is similar to the insertion procedure, except that you must specify the document ID and current revision for every document in the bulk update JSON string.

<div></div>

> Example JSON structure returned after bulk update:

```
[{
  "id": "96f898f0-f6ff-4a9b-aac4-503992f31b01",
  "rev": "2-ff7b85665c4c297838963c80ecf481a3"
}, {
  "id": "5a049246-179f-42ad-87ac-8f080426c17c",
  "rev": "2-9d5401898196997853b5ac4163857a29"
}, {
  "id": "d1f61e66-7708-4da6-aa05-7cbc33b44b7e",
  "rev": "2-cbdef49ef3ddc127eff86350844a6108"
}]
```

The return structure is the JSON of the updated documents, with the new revision and ID information.

<div></div>

You can optionally delete documents during a bulk update by adding the `_deleted` field with a value of `true` to each document ID/revision combination within the submitted JSON structure.

The return code from a successful bulk update is [`201`](http.html#201),
with the content of the returned structure indicating specific success or otherwise messages on a per-document basis.

The content and structure of the returned JSON depends on the transaction semantics being used for the bulk update; see [Bulk Documents Transaction Semantics](#bulk-documents-transaction-semantics) for more information. Conflicts and validation errors when updating documents in bulk must be handled separately; see [Bulk Document Validation and Conflict Errors](#bulk-document-validation-and-conflict-errors).

#### Bulk Documents Transaction Semantics

> Response with errors

```json
[
   {
      "id" : "FishStew",
      "error" : "conflict",
      "reason" : "Document update conflict."
   },
   {
      "id" : "LambStew",
      "error" : "conflict",
      "reason" : "Document update conflict."
   },
   {
      "id" : "7f7638c86173eb440b8890839ff35433",
      "error" : "conflict",
      "reason" : "Document update conflict."
   }
]
```

Cloudant only guarantees that some of the documents are saved if your request yields a [`202` response](http.html#202).
The response contains the list of documents successfully inserted or updated during the process.

The response structure indicates whether the document was updated successfully.
It does this by supplying the new `_rev` parameter,
indicating that a new document revision was successfully created.

If the update failed, then you get an `error` of type `conflict`.
In this case,
no new revision has been created.
You must submit the document update with the correct revision tag, to update the document.

<div></div>

#### Bulk Document Validation and Conflict Errors

The JSON returned by the `_bulk_docs` operation consists of an array of JSON structures,
one for each document in the original submission.
The returned JSON structure should be examined to ensure that all of the documents submitted in the original request were successfully added to the database.

The structure of the returned information is:

<table>
<colgroup>
<col width="20%" />
<col width="36%" />
<col width="26%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Field</th>
<th align="left">Description</th>
<th align="left">Type</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">docs [array]</td>
<td align="left">Bulk Documents Document</td>
<td align="left">array of objects</td>
</tr>
</tbody>
</table>

#### Fields of objects in docs array

<table>
<colgroup>
<col width="12%" />
<col width="50%" />
<col width="12%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Field</th>
<th align="left">Description</th>
<th align="left">Type</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">id</td>
<td align="left">Document ID</td>
<td align="left">string</td>
</tr>
<tr class="even">
<td align="left">error</td>
<td align="left">Error type</td>
<td align="left">string</td>
</tr>
<tr class="odd">
<td align="left">reason</td>
<td align="left">Error string with extended reason</td>
<td align="left">string</td>
</tr>
</tbody>
</table>

When a document (or document revision) is not correctly committed to the database because of an error, you should check the `error` field to determine error type and course of action.
The error is one of `conflict` or `forbidden`.

#### `conflict`

The document as submitted is in conflict.
If you used the default bulk transaction mode,
then the new revision was not created.
You must re-submit the document to the database.

Conflict resolution of documents added using the bulk docs interface is identical to the resolution procedures used when resolving conflict errors during replication.

#### `forbidden`

> Example javascript to produce `forbidden` error as part of a validation function:

```
throw({forbidden: 'invalid recipe ingredient'});
```

> Resulting error message from the validation function:

```json
{
   "id" : "7f7638c86173eb440b8890839ff35433",
   "error" : "forbidden",
   "reason" : "invalid recipe ingredient"
}
```

Entries with this error type indicate that the validation routine applied to the document during submission has returned an error.

<div id="quorum"></div>
### Quorum - writing and reading data

In a distributed system,
it is possible that a request might take some time to complete.
A quorum is used to help determine when a given request,
such as a write or read,
has completed successfully.

The number of systems deemed to represent a quorum for reading and writing have default values based on the [`n`, the number of replicas for each document](database.html#create),
where `n` defaults to 3.
By default,
the number of systems for a quorum for reading is `r`,
calculated as `n/2+1`.
Similarly,
the number of systems for a quorum for writing is `w`,
calculated as `n/2+1`.

<aside class="warning">It is not possible to specify the `n` value for a database at creation time on a multi-tenant system.
For help understanding quorum settings and their implications on dedicated Cloudant systems,
contact Cloudant support.</aside>

Cloudant implements a 'sloppy quorum' mechanism.
This means data is still written or read,
because if a primary node (one that would normally be used for the write or read) is not available,
another available node accepts and responds to the request.

The default quorum values should result in the best overall performance for all users.
However,
the default values have some implications:

-	Concurrent updates to the same document are possible and would generate a conflict internally. Avoid making rapid updates to the same document. Have a strategy for handling conflicts, as you might be creating them unwittingly.
-	There are no "read your writes" guarantees. You might write a document and then have a read request serviced from a shard copy which has not yet received the write. Another scenario would be a write where quorum was not met; immediately reading the same document back might return a different revision.
-	You should assume that secondary index reads are always eventually consistent. This is because a read request might be serviced by a shard copy that has not yet received the previous write.

For more information about Cloudant and distributed system concepts,
see the [CAP Theorem](cap_theorem.html) guide,
or contact Cloudant support.
