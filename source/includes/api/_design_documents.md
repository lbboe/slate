## Design Documents

Instead of storing data in a document,
you might also have special documents that store other content, such as functions.
The special documents are called "design documents".

Design documents are [documents](#documents) that have an `_id` beginning with `_design/`. They can be read and updated in the same way as any other document in the database.
Cloudant reads specific fields and values of design documents as functions.
Design documents are used to [build indexes](#indexes), [validate updates](#update-validators), and [format query results](#list-functions).

### Creating or updating a design document

-   **Method**: `GET /$DATABASE/_design/design-doc`
-   **Request**: JSON of the design document information
-   **Response**: JSON status
-   **Roles permitted**: \_writer

To create a design document, upload it to the specified database.

In these examples,
`$VARIABLES` might refer to standard and design documents.
To distinguish between them,
standard documents have an `_id` indicated by `$DOCUMENT_ID`,
while design documents have an `_id` indicated by `$DESIGN_ID`.

The structure of design document is as follows:

-   **\_id**: Design Document ID
-   **\_rev**: Design Document Revision
-   **views (optional)**: an object describing MapReduce views
    -   **viewname** (one for each view): View Definition
        -   **map**: Map Function for the view
        -   **reduce (optional)**: Reduce Function for the view
        -   **dbcopy (optional)**: Database name to store view results in
-   **indexes (optional)**: an object describing search indexes
    -   **index name** (one for each index): Index definition
        -   **analyzer**: Object describing the analyzer to be used or an object with the following fields:
            -   **name**: Name of the analyzer. Valid values are `standard`, `email`, `keyword`, `simple`, `whitespace`, `classic`, `perfield`.
            -   **stopwords (optional)**: An array of stop words. Stop words are words that should not be indexed. If this array is specified, it overrides the default list of stop words. The default list of stop words depends on the analyzer. The list of stop words for the standard analyzer is: "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with".
            -   **default (for the per field analyzer)**: default language to use if there is no language specified for the field
            -   **fields (for the per field analyzer)**: An object specifying which language to use to analyze each field of the index. Field names in the object correspond to field names in the index (i.e. the first parameter of the index function). The values of the fields are the languages to be used, e.g. "english".
        -   **index**: Function that handles the indexing
-   **shows (optional)**: Show functions
    -   **function name** (one for each function): Function definition
-   **lists (optional)**: List functions
    -   **function name** (one for each function): Function definition

### Copying a Design Document

You can copy the latest version of a design document to a new document
by specifying the base document and target document.
The copy is requested using the `COPY` HTTP request.

<aside class="warning">`COPY` is a non-standard HTTP command.</aside>

<div></div>

>  Example command to copy a design document:

```http
COPY /recipes/_design/recipes HTTP/1.1
Content-Type: application/json
Destination: /recipes/_design/recipelist
```

> Example response to copy command:

```json
{
  "id" : "recipes/_design/recipelist"
  "rev" : "1-9c65296036141e575d32ba9c034dd3ee",
}
```

An example request to copy the design document `recipes` to the new
design document `recipelist` produces a response containing the ID and revision of
the new document.

<aside class="notice">Copying a design document does not automatically reconstruct the view
indexes. Like other views, these are recreated the first
time the new view is accessed.</aside>

<div></div>

#### The structure of the copy command

-	 **Method**: `COPY /$DATABASE/_design/design-doc`
-	 **Request**: None
-	 **Response**: JSON describing the new document and revision
-	 **Roles permitted**: \_writer
-	 **Query Arguments**:
    -	**Argument**: `rev`
        -	**Description**:  Revision to copy from
        -	**Optional**: yes
        -	**Type**: string
-	**HTTP Headers**
    -	**Header**: `Destination`
        -	**Description**: Destination document (and optional revision)
        -	**Optional**: no

The source design document is specified on the request line, with the
`Destination` HTTP Header of the request specifying the target
document.

<div></div>

#### Copying from a specific revision

>  Example command to copy a specific revision of the design document:

```http
COPY /recipes/_design/recipes?rev=1-e23b9e942c19e9fb10ff1fde2e50e0f5 HTTP/1.1
Content-Type: application/json
Destination: recipes/_design/recipelist
```

To copy *from* a specific version, add the `rev` argument to the query
string.

The new design document is created using the specified revision of
the source document.

<div></div>

#### Copying to an existing design document

>  Example command to overwrite an existing copy of the design document:

```http
COPY /recipes/_design/recipes
Content-Type: application/json
Destination: recipes/_design/recipelist?rev=1-9c65296036141e575d32ba9c034dd3ee
```

> Example response to overwriting successfully an existing design document:

```json
{
    "id" : "recipes/_design/recipes"
    "rev" : "2-55b6a1b251902a2c249b667dab1c6692",
}
```

To copy to an existing document, specify the current revision
string for the target document, using the `rev` parameter to the
``Destination`` HTTP Header string.

The return value is the new revision of the copied document.

### Deleting a design document

> Example command to delete a design document:

```http
DELETE /recipes/_design/recipes?rev=2-ac58d589b37d01c00f45a4418c5a15a8 HTTP/1.1
Content-Type: application/json
```

> Example response, containing the delete document ID and revision:

```json
{
  "id" : "recipe/_design/recipes"
  "ok" : true,
  "rev" : "3-7a05370bff53186cb5d403f861aca154",
}
```

You can delete an existing design document. Deleting a design document also
deletes all of the associated view indexes, and recovers the
corresponding space on disk for the indexes in question.

To delete successfully, you must specify the current revision of the design document
using the `rev` query argument.

<div></div>

#### The structure of the delete command

-	 **Method**: `DELETE /db/_design/design-doc`
-	 **Request**:  None
-	 **Response**:  JSON of deleted design document
-	 **Roles permitted**: _writer
-	 **Query Arguments**:
    -	**Argument**: `rev`
        -	**Description**: Current revision of the document for validation
        -	**Optional**: yes
        -	**Type**: string
-	**HTTP Headers**
    -	**Header**: `If-Match`
        -	**Description**: Current revision of the document for validation
        -	**Optional**: yes

### Views

An important use of design documents is for creating views. These are discussed in more detail [here](#creating-views).

### Rewrite rules

> Example rewrite rules:

```json
"rewrites": [
  {
    "from": "/",
    "to": "index.html",
    "method": "GET",
    "query": {}
  },
  {
    "from": "/foo/:var",
    "to": "/foo",
    "method": "GET",
    "query": {"v": "var"}
  }
]
```

A design document can contain rules for URL rewriting, by using an array in the `rewrites` field.
Requests that match the rewrite rules must have a URL path that starts with `/$DATABASE/_design/doc/_rewrite`.

Each rule is a JSON object with 4 fields:

<table>
<colgroup>
<col width="20%" />
<col width="80%" />
</colgroup>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>from</code></td>
<td>A path relative to <code>/$DATABASE/_design/doc/_rewrite</code>, used to match URLs to rewrite rules. Path elements that start with a <code>:</code> are treated as variables and match any string that does not contain a <code>/</code>. A <code>*</code> can only appear at the end of the string, and matches any string - including slashes.</td>
</tr>
<tr>
<td><code>to</code></td>
<td>The path (relative to <code>/$DATABASE/_design/doc/</code> and not including the query part of the URL) that is the result of the rewriting step. Variables captured in <code>from</code> can be used in <code>to</code>. <code>*</code> can also be used and contains everything captured by the pattern in <code>from</code>.</td>
</tr>
<tr>
<td><code>method</code></td>
<td>The HTTP method that should be matched on.</td>
</tr>
<tr>
<td><code>query</code></td>
<td>The query part of the resulting URL. This is a JSON object containing the key/value pairs of the query.</td>
</tr>
</tbody>
</table>

#### Example rewrite rules

<table>
<colgroup>
<col width="30%" />
<col width="30%" />
<col width="30%" />
<col width="10%" />
</colgroup>
<thead>
<tr>
<th>Rule</th>
<th>URL</th>
<th>Rewrite to</th>
<th>Tokens</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>{"from": "/a/b", "to": "/some/"}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a/b?k=v</code></td>
<td><code>/$DATABASE/_design/doc/some/k=v</code></td>
<td>k = v</td>
</tr>
<tr>
<td><code>{"from": "/a/b", "to": "/some/:var"}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a/b</code></td>
<td><code>/$DATABASE/_design/doc/some/b?var=b</code></td>
<td>var = b</td>
</tr>
<tr>
<td><code>{"from": "/a", "to": "/some/*"}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a</code></td>
<td><code>/$DATABASE/_design/doc/some</code></td>
<td>&nbsp;</td>
</tr>
<tr>
<td><code>{"from": "/a/*", "to": "/some/*}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a/b/c</code></td>
<td><code>/$DATABASE/_design/doc/some/b/c</code></td>
<td>&nbsp;</td>
</tr>
<tr>
<td><code>{"from": "/a", "to": "/some/*"}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a</code></td>
<td><code>/$DATABASE/_design/doc/some</code></td>
<td>&nbsp;</td>
</tr>
<tr>
<td><code>{"from": "/a/:foo/*","to": "/some/:foo/*"}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a/b/c</code></td>
<td><code>/$DATABASE/_design/doc/some/b/c?foo=b</code></td>
<td>foo = b</td>
</tr>
<tr>
<td><code>{"from": "/a/:foo", "to": "/some", "query": { "k": ":foo" }}</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a/b</code></td>
<td><code>/$DATABASE/_design/doc/some/?k=b&foo=b</code></td>
<td>foo =:= b</td>
</tr>
<tr>
<td><code>{"from": "/a", "to": "/some/:foo" }</code></td>
<td><code>/$DATABASE/_design/doc/_rewrite/a?foo=b</code></td>
<td><code>/$DATABASE/_design/doc/some/b&foo=b</code></td>
<td>foo = b</td>
</tr>
</tbody>
</table>

### Indexes

All queries operate on pre-defined indexes defined in design documents.
These indexes are:

* [Search](#search)
* [MapReduce](#creating-views)

<!-- * [Geo](#geo) -->

For example,
to create a design document used for searching,
you must ensure that two conditions are true:

1. You have identified the document as a design document by having an `_id` starting with `_design/`.
2. A [search index](#search) has been created within the document by [updating](#update) the document with the appropriate field or by [creating](#create) a new document containing the search index.

As soon as the search index design document exists and the index has been built, you can make queries using it.

For more information about search indexing,
refer to the [search](#search) section of this documentation.

#### General notes on functions in design documents

Functions in design documents are run on multiple nodes for each document and might be run several times. To avoid inconsistencies, they need to be idempotent, meaning they need to behave identically when run multiple times and/or on different nodes. In particular, you should avoid using functions that generate random numbers or return the current time.


### List Functions

> Example design document referencing a list function:

```json
{
  "_id": "_design/list_example",
  "lists": {
    "FUNCTION_NAME": "function (head, req) { ... }"
  }
}
```

> Example list function:

```
function (head, req) {
  // specify our headers
  start({
    headers: {
      "Content-Type": 'text/html'
    }
  });
  // send the respond, line by line
  send('<html><body><table>');
  send('<tr><th>ID</th><th>Key</th><th>Value</th></tr>')
  while(row = getRow()){
    send(''.concat(
      '<tr>',
      '<td>' + toJSON(row.id) + '</td>',
      '<td>' + toJSON(row.key) + '</td>',
      '<td>' + toJSON(row.value) + '</td>',
      '</tr>'
    ));
  }
  send('</table></body></html>');
}
```

> Example query:

```http
GET /$DATABASE/$DESIGN_ID/_list/$LIST_FUNCTION/$MAPREDUCE_INDEX HTTP/1.1
Host: $USERNAME.cloudant.com
```

```shell
curl https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_list/$LIST_FUNCTION/$MAPREDUCE_INDEX \
     -u $USERNAME
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

db.view_with_list($DESIGN_ID, $MAPREDUCE_INDEX, $LIST_FUNCTION, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

Use list functions to customize the format of [MapReduce](#using-views) query results.
They are used when you want to access Cloudant directly from a browser, and need data to be returned in a different format, such as HTML.

<aside>The result of a list function is not stored. This means that the function is executed every time a request is made.
As a consequence, using map-reduce functions might be more efficient.
For web and mobile applications, consider whether any computations done in a list function would be better placed in the application tier.</aside>

List functions require two arguments: `head` and `req`.

When you define a list function,
you use it by making a `GET` request to `https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_list/$LIST_FUNCTION/$MAPREDUCE_INDEX`.
In this request:

* `$LIST_FUNCTION` is the name of list function you defined.
* `$MAPREDUCE_INDEX` is the name of the index providing the query results you want to format.

The other parameters are the same query parameters used in a [MapReduce query](#queries).

#### head

Field | Description
------|-------------
total_rows | Number of documents in the view
offset | Offset where the document list started

#### req

Field | Description
------|-------------
body | Request body data as string. If the request method is `GET` this field contains the value "undefined". If the method is `DELETE` or `HEAD` the value is "" (empty string).
cookie | Cookies object.
form | Form data object. Contains the decoded body as key-value pairs if the Content-Type header was `application/x-www-form-urlencoded`.
headers | Request headers object.
id | Requested document id string if it was specified or null otherwise.
info | Database information
method | Request method as string or array. String value is a method as one of: `HEAD`, `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, and `TRACE`. Otherwise it will be represented as an array of char codes.
path | List of requested path sections.
peer | Request source IP address.
query | URL query parameters object. Note that multiple keys are not supported and the last key value suppresses others.
requested_path | List of actual requested path section.
raw_path | Raw requested path string.
secObj | The database's [security object](#viewing-permissions)
userCtx | Context about the currently authenticated user, specifically their `name` and `roles` within the current database.
uuid | A generated UUID

### Show Functions

> Design doc with a show function:

```json
{
  "_id": "_design/show_example",
  "shows": {
    "FUNCTION_NAME": "function (doc, req) { ... }"
  }
}
```

> Example show function:

```
function (doc, req) {
  if (doc) {
    return "Hello from " + doc._id + "!";
  } else {
    return "Hello, world!";
  }
}
```

> Example query:

```http
GET /$DATABASE/$DESIGN_ID/_show/$SHOW_FUNCTION/$DOCUMENT_ID HTTP/1.1
Host: $USERNAME.cloudant.com
```

```shell
curl https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_show/$SHOW_FUNCTION/$DOCUMENT_ID \
     -u $USERNAME
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

db.show($DESIGN_ID, $SHOW_FUNCTION, $DOCUMENT_ID, function (err, body) {
  if (!err) {
    console.log(body);
  }
});
```

Show functions are similar to [list functions](#list-functions) but are used to format individual documents.
They are used when you want to access Cloudant directly from a browser, and need data to be returned in a different format, such as HTML.

<aside>The result of a show function is not stored. This means that the function is executed every time a request is made.
As a consequence, using map functions might be more efficient.
For web and mobile applications, consider whether any computations done in a show function would be better placed in the application tier.</aside>

Show functions receive two arguments: `doc`, and [req](#req). `doc` is the document requested by the show function.

When you have defined a show function, you query it with a `GET` request to `https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_show/$SHOW_FUNCTION/$DOCUMENT_ID`,
where `$SHOW_FUNCTION` is the name of the function that is applied to the document that has `$DESIGN_ID` as its `_id`.

### Update Handlers

> Example design doc:

```json
{
  "_id": "_design/update_example",
  "updates": {
    "UPDATE_HANDLER_NAME": "function (doc, req) { ... }"
  }
}
```

> Example update handler:

```
function(doc, req){
  if (!doc){
    if ('id' in req && req.id){
      // create new document
      return [{_id: req.id}, 'New World']
    }
    // change nothing in database
    return [null, 'Empty World']
  }
  doc.world = 'hello';
  doc.edited_by = req.userCtx.name
  return [doc, 'Edited World!']
}
```

> Example query:

```http
POST /$DATABASE/$DESIGN_ID/_update/$UPDATE_HANDLER HTTP/1.1
Host: $USERNAME.cloudant.com
Content-Type: application/json
```

```shell
curl https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_update/$UPDATE_HANDLER \
     -X POST \
     -H "Content-Type: application/json" \
     -u $USERNAME
     -d "$JSON"
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");
var db = account.use($DATABASE);

db.atomic($DESIGN_ID, $UPDATE_HANDLER, $DOCUMENT_ID, $JSON, function (err, body) {
  if (!err) {
    console.log(body);
  }
});
```

Update handlers are custom functions that live on Cloudant's server that will create or update a document.
This can, for example, provide server-side modification timestamps, and document updates to individual fields without the latest revision. 

Update handlers receive two arguments: `doc` and [req](#req).
If a document ID is provided in the request to the update handler, then `doc` will be the document corresponding with that ID. If no ID was provided, `doc` will be `null`.

Update handler functions must return an array of two elements, the first being the document to save (or null, if you don't want to save anything), and the second being the response body.

Here's how to query update handlers:

Method | URL
-------|------
POST | `https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_update/$UPDATE_HANDLER`
PUT | `https://$USERNAME.cloudant.com/$DATABASE/$DESIGN_ID/_update/$UPDATE_HANDLER/$DOCUMENT_ID`

Where `$DESIGN_ID` is the `_id` of the document defining the update handler, `$UPDATE_HANDLER` is the name of the update handler, and `$DOCUMENT_ID` is the `_id` of the document you want the handler to, well, handle.

### Filter Functions

> Example design document:

```json
{
  "_id":"_design/FILTER_EXAMPLE",
  "filters": {
    "FILTER_EXAMPLE": "function (doc, req) { ... }"
  }
}
```

Filter functions filter the [changes feed](#get-changes), removing changes you don't want to monitor.
The filter function is run over every change in the changes feed, and only those for which the function returns `true` are returned to the client in the response.

<div></div>

###### h6

> Example filter function:

```
function(doc, req){
  // we need only `mail` documents
  if (doc.type !== 'mail'){
    return false;
  }
  // we're interested only in `new` ones
  if (doc.status !== 'new'){
    return false;
  }
  return true; // passed!
}
```

Filter functions receive two arguments: `doc` and [req](#req). `doc` represents the document being filtered and `req` contains information about the http request. In most cases, only the `doc` parameter will be used.

<div></div>

###### h6

> Example query:

```http
GET /$DATABASE/_changes?filter=$DESIGN_ID%2F$FILTER HTTP/1.1
Host: $USERNAME.cloudant.com
```

```shell
curl https://$USERNAME.cloudant.com/$DATABASE/_changes?filter=$DESIGN_ID%2F$FILTER \
     -u $USERNAME
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");

account.db.changes($DATABASE, {
  // ex: example/filter
  filter: [$DESIGN_ID, $FILTER_FUNCTION].join('/')
}, function (err, body, headers) {
  if (!err) {
    console.log(body);
  }
});
```

To use a filter function on the changes feed, specify the `filter` parameter in the `_changes` query.

### Update Validators

> Example design document:

```json
{
  "_id": "_design/validator_example",
  "validate_doc_update": "function(newDoc, oldDoc, userCtx, secObj) { ... }"
}
```

> Example update validator:

```
function(newDoc, oldDoc, userCtx, secObj) {
  if (newDoc.address === undefined) {
     throw({forbidden: 'Document must have an address.'});
  }
}
```

> Example response:

```json
{
  "error": "forbidden",
  "reason": "Document must have an address."
}
```

Update validators evaluate whether a document should be written to disk when insertions and updates are attempted.
They do not require a query because they implicitly run during this process. If a change is rejected, the update validator responds with a custom error. 

Update validators get four arguments:

* `newDoc`: the version of the document passed in the request.
* `oldDoc`: the version of the document currently in the database, or `null` if there is none.
* `userCtx`: context about the currently authenticated user, such as `name` and `roles`..
* `secObj`: the database's [security object](#viewing-permissions)

### Retrieving information about a design document

> Example to get the information for the `recipesdd` design document in the `recipes` database:

```http
GET /recipes/_design/recipesdd/_info HTTP/1.1
Host: $USERNAME.cloudant.com
```

```shell
curl https://$USERNAME.cloudant.com/recipes/_design/recipesdd/_info \
     -u $USERNAME
```

> Example JSON structure response:

```json
{
   "name" : "recipesdd"
   "view_index" : {
      "compact_running" : false,
      "updater_running" : false,
      "language" : "javascript",
      "purge_seq" : 10,
      "waiting_commit" : false,
      "waiting_clients" : 0,
      "signature" : "fc65594ee76087a3b8c726caf5b40687",
      "update_seq" : 375031,
      "disk_size" : 16491
   },
}
```

-   **Method**: `GET /db/_design/design-doc/_info`
-   **Request**: None
-   **Response**: JSON of the design document information
-   **Roles permitted**: \_reader

Obtains information about a given design document, including the index, index size and current status of the design document and associated index information.

The individual fields in the returned JSON structure are detailed below:

-   **name**: Name/ID of Design Document
-   **view\_index**: View Index
    -   **compact\_running**: Indicates whether a compaction routine is currently running on the view
    -   **disk\_size**: Size in bytes of the view as stored on disk
    -   **language**: Language for the defined views
    -   **purge\_seq**: The purge sequence that has been processed
    -   **signature**: MD5 signature of the views for the design document
    -   **update\_seq**: The update sequence of the corresponding database that has been indexed
    -   **updater\_running**: Indicates if the view is currently being updated
    -   **waiting\_clients**: Number of clients waiting on views from this design document
    -   **waiting\_commit**: Indicates if there are outstanding commits to the underlying database that need to processed
