<h2 id="ReplicationAPI">Replication</h2>

Cloudant replication is the process that synchronizes ('syncs') the state of two databases.
Any change which has occured in the source database is reproduced in the target database.
You can create replications between any number of databases, whether continuous or not.

Depending on your application requirements, you use replication to share and aggregate state and content.

This overview explains how replication works:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/OPW8bomFcDY?rel=0" frameborder="0" allowfullscreen title="Replication overview video"></iframe>

This video shows you how to replicate a Cloudant sample database:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/TDvzZ887tGI?rel=0" frameborder="0" allowfullscreen title="Video showing how to replicate a sample database"></iframe>

Replication takes place in one direction only.
To keep two databases synchronized with each other, you must replicate in both directions.
This means that you must replicate from `databasea` to `databaseb`, and separately from `databaseb` to `databasea`.

<aside class="warning">Continuous replication can result in a large number of internal calls. This might affect costs for multi-tenant users of Cloudant systems. Continuous replication is disabled by default.</aside>

<aside class="warning">The target database must exist. It is not automatically created if it does not exist. Add `"create_target":true` to the JSON document describing the replication if the target database does not exist prior to replication.</aside>

Replications are created in one of two ways:

1. A replication can be created using a [replication document](#replication-document-format) in the `_replicator` database. Creating and modifying replications in this way allows you to control replication in the same as working with other documents.
2. A replication can be started by `POST`ing a JSON document describing the desired replication directly to the `/_replicate` endpoint.

### Replication document format

<aside class="warning">You must use the *full* URL when specifying the source and target databases in a replication document.</aside>

The format of the document used to describe a replication is as follows:

Field&nbsp;Name | Required | Description
-----------|----------|-------------
`source` | yes | Identifies the database to copy revisions from. Can be a database URL, or an object whose url property contains the full URL of the database.
`target` | yes | Identifies the database to copy revisions to. Same format and interpretation as source. Does not have to be the same value as the `source` field.
`continuous` | no | Continuously syncs state from the `source` to the `target`, only stopping when deleted.
`create_target` | no | A value of `true` tells the replicator to create the `target` database if it does not exist.
`doc_ids` | no | Array of document IDs; if given, only these documents are replicated.
`filter` | no | Name of a [filter function](design_documents.html#filter-functions) that can choose which documents get replicated.
`proxy` | no | Proxy server URL.
`query_params` | no | Object containing properties that are passed to the [filter function](design_documents.html#filter-functions).
<div id="checkpoints">`use_checkpoints`</div> | no | Indicate whether to create checkpoints. Checkpoints greatly reduce the time and resources needed for repeated replications. Setting this to `false` removes the requirement for write access to the `source` database. Defaults to `true`.
`user_ctx` | no | An object containing the username and optionally an array of roles, e.g.: `"user_ctx": {"name": "jane", "roles": ["admin"]} `. This is needed for the replication to show up in the output of `/_active_tasks`.

### The `/_replicator` database

The `/_replicator` database is a special database where you can `PUT` or `POST` documents to trigger replications, or `DELETE` to cancel ongoing replications. These documents have exactly the same content as the JSON documents you can `POST` to the [`/_replicate/`](#the-/_replicate-endpoint) endpoint. The fields supplied in the replication document are `source`, `target`, `continuous`, `create_target`, `doc_ids`, `filter`, `proxy`, `query_params`, `use_checkpoints`. These fields are described in the [Replication document format](#replication-document-format).

Replication documents can have a user defined `_id`.

The names of the source and target databases do not have to be the same.

<aside class="warning">All design documents and `_local` documents added to the `/_replicator` database are ignored.</aside>

#### Creating a replication

> Example instructions for creating a replication document:

```shell
curl -X PUT https://$USERNAME:$PASSWORD@USERNAME.cloudant.com/_replicator/replication-doc -H 'Content-Type: application/json' -d @replication-document.json
#assuming replication-document.json is a json file with the following content:
```

```http
PUT /_replicator/replication-doc HTTP/1.1
Content-Type: application/json
```

> Example replication document:

```json
{
  "source": "https://$USERNAME1:$PASSWORD1@$USERNAME1.cloudant.com/$DATABASE1",
  "target": "https://$USERNAME2:$PASSWORD2@$USERNAME2.cloudant.com/$DATABASE2",
  "create_target": true,
  "continuous": true
}
```

To start a replication, [add a replication document](#replication-document-format) to the `_replicator` database.

This overview explains how to create a replication job:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/GmZ3HrwMhO4?rel=0" frameborder="0" allowfullscreen title="Replication creation video"></iframe>

You can set up replication using cURL:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/sQ3ldxOhpWM?rel=0" frameborder="0" allowfullscreen title="Replication creation using curl video"></iframe>

<h3></h3>

#### Monitoring a replication

> Example instructions for monitoring a replication:

```shell
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_active_tasks
```

```http
GET /_active_tasks HTTP/1.1
```

```javascript
var nano = require('nano');
var account = nano("https://"+$USERNAME+":"+$PASSWORD+"@"+$USERNAME+".cloudant.com");

account.request({
  path: '_active_tasks'
}, function (err, body, headers) {
  if (!err) {
    console.log(body.filter(function (task) {
      return (task.type === 'replication');
    })); 
  }
});
```

> Example response of active task including continuous replication:

```json
[
  {
    "user": null,
    "updated_on": 1363274088,
    "type": "replication",
    "target": "https://repl:*****@tsm.cloudant.com/user-3dglstqg8aq0uunzimv4uiimy/",
    "docs_read": 0,
    "doc_write_failures": 0,
    "doc_id": "tsm-admin__to__user-3dglstqg8aq0uunzimv4uiimy",
    "continuous": true,
    "checkpointed_source_seq": "403-g1AAAADfeJzLYWBgYMlgTmGQS0lKzi9KdUhJMjTRyyrNSS3QS87JL01JzCvRy0styQGqY0pkSLL___9_VmIymg5TXDqSHIBkUj1YUxyaJkNcmvJYgCRDA5AC6tuflZhGrPsgGg9ANAJtzMkCAPFSStc",
    "changes_pending": 134,
    "pid": "<0.1781.4101>",
    "node": "dbcore@db11.julep.cloudant.net",
    "docs_written": 0,
    "missing_revisions_found": 0,
    "replication_id": "d0cdbfee50a80fd43e83a9f62ea650ad+continuous",
    "revisions_checked": 0,
    "source": "https://repl:*****@tsm.cloudant.com/tsm-admin/",
    "source_seq": "537-g1AAAADfeJzLYWBgYMlgTmGQS0lKzi9KdUhJMjTUyyrNSS3QS87JL01JzCvRy0styQGqY0pkSLL___9_VmI9mg4jXDqSHIBkUj1WTTityWMBkgwNQAqob39WYhextkE0HoBoBNo4MQsAFuVLVQ",
    "started_on": 1363274083
  }
]
```

> Example response of active task including single replication:

```json
[
  {
    "pid": "<0.1303.0>",
    "replication_id": "e42a443f5d08375c8c7a1c3af60518fb+create_target",
    "checkpointed_source_seq": 17333,
    "continuous": false,
    "doc_write_failures": 0,
    "docs_read": 17833,
    "docs_written": 17833,
    "missing_revisions_found": 17833,
    "progress": 3,
    "revisions_checked": 17833,
    "source": "http://username.cloudant.com/db/",
    "source_seq": 551202,
    "started_on": 1316229471,
    "target": "test_db",
    "type": "replication",
    "updated_on": 1316230082
  }
]
```

To monitor replicators currently in process, make a `GET` request to `https://$USERNAME.cloudant.com/_active_tasks`.
This returns any active tasks, including replications. To filter for replications, look for documents with `"type": "replication"`.

This overview explains how to check replication status:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/TIXpJmmqP6Y?rel=0" frameborder="0" allowfullscreen title="Replication status check video"></iframe>

For details about the information provided by `_active_tasks`, see [Active tasks](active_tasks.html).

<h3></h3>

#### Delete

> Example instructions for deleting a replication document:

```http
DELETE /_replicator/replication-doc?rev=1-... HTTP/1.1
```

```shell
curl -X DELETE https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_replicator/replication-doc?rev=1-...
```

To cancel a replication, simply [delete its replication document](#document-delete) from the `_replicator` database.

If the replication is in an [`error` state](#replication-status), the replicator makes repeated attempts to achieve a successful replication. A consequence is that the replication document is updated with each attempt. This also changes the document revision value. Therefore, you should get the revision value immediately before deleting the document, otherwise you might get an [HTTP 409 "document update conflict"](http.html#409) response.

### The /\_replicate endpoint

> Example instructions for starting a replication:

```shell
curl -H 'Content-Type: application/json' -X POST "https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_replicate" -d @replication-doc.json
#with the file replication-doc.json containing the required replication.
```

```http
POST /_replicate HTTP/1.1
Content-Type: application/json
```
> Example document describing the required replication:

```json
{
  "source": "http://$USERNAME:$PASSWORD@username.cloudant.com/example-database",
  "target": "http://$USERNAME2:$PASSWORD2@example.org/example-target-database"
}
```

You are encouraged to use the [Replicator Database](#the-/_replicator-database) to manage replication.
However, replication can also be triggered by sending a `POST` request directly to the `/_replicate` API URL. The `POST` contains a JSON document that describes the desired replication.

-   **Method**: `POST`
-   **Path**: `/_replicate`
-   **Request**: Replication specification
-   **Response**: TBD
-   **Roles permitted**: \_admin

#### Return Codes

Code | Description
-----|------------
`200` | Replication request successfully completed.
`202` | Continuous replication request has been accepted.
`404` | Either the source or target database was not found.
`500` | JSON specification was invalid.

Use this call to request, configure, or stop, a replication operation.

The specification of the replication request is controlled through the JSON content of the request. The JSON should be an object with fields defining the source, target and other options. The fields of the JSON request are as follows:

-   **cancel**: (Optional) Cancels the replication.
-   **continuous**: (Optional) Configure the replication to be continuous.
-   **create\_target**: (Optional) Creates the target database.
-   **doc\_ids**: (Optional) Array of document IDs to be synchronized.
-   **proxy**: (Optional) Address of a proxy server through which replication should occur.
-   **source**: Source database URL, including user name and password.
-   **target**: Target database URL, including user name and password.

### Replication Operation

> Example request to replicate between a database on the source server `example.com`, and a target database on Cloudant:

```
POST /_replicate
Content-Type: application/json
Accept: application/json

{
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
}
```

> Example error reponse if one of the requested databases for a replication does not exist:

```json
{
   "error" : "db_not_found"
   "reason" : "could not open http://username.cloudant.com/ol1ka/",
}
```

The aim of replication is that at the end of the process, all active documents on the source database are also in the destination or 'target' database, and that all documents deleted from the source databases are also deleted from the destination database (if they existed there).

Replication has two forms: push or pull replication:

-   *Push replication* is where the `source` is a local database, and `destination` is a remote database.

-   *Pull replication* is where the `source` is the remote database instance, and the `destination` is the local database.

Pull replication is helpful if your source database has a permanent IP address, and your destination database is local and has a dynamically assigned IP address, for example, obtained through DHCP.
Pull replication is especially appropriate if you are replicating to a mobile or other device from a central server.

In all cases, the requested databases in the `source` and `target` specification must exist. If they do not, an error is returned within the JSON object.

### Creating a target database during replication

> Example request to create a target database and replicate onto it:

```
POST http://username.cloudant.com/_replicate
Content-Type: application/json
Accept: application/json

{
   "create_target" : true
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
}
```

If your user credentials allow it, you can create the target database during replication by adding the `create_target` field to the request object.

The `create_target` field is not destructive. If the database already exists, the replication proceeds as normal.

### Canceling replication

> Example instructions for canceling a replication:

```shell
curl -H 'Content-Type: application/json' -X POST 'https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_replicate HTTP/1.1' -d @replication-doc.json
#the file replication-doc.json has the following content:
```

```http
POST /_replicate HTTP/1.1
Content-Type: application/json
```

> Example document to describe the replication to be canceled:

```json
{
  "source": "https://username:password@username.cloudant.com/example-database",
  "target": "https://username:password@example.org/example-database",
  "cancel": true
}
```

A replication triggered by `POST`ing to `/_replicate` can be canceled by `POST`ing the exact same JSON object but with the additional `cancel` property set to `true`.

<aside class="warning">If a replication is canceled, the request which initiated the replication fails with error 500 (shutdown).</aside>

The replication ID can be obtained from the original replication request if it is a continuous replication.
Alternatively, the replication ID can be obtained from `/_active_tasks`.

### Single Replication

> Example request for a single synchronization between the source database `recipes` and the target database `recipes2`.

```
POST /_replicate
Content-Type: application/json
Accept: application/json

{
   "source" : "http://user:pass@user.cloudant.com/recipes",
   "target" : "http://user:pass@user.cloudant.com/recipes2",
}
```

> Example response following a request for a single replication:

``` json
{
   "ok" : true,
   "history" : [
      {
         "docs_read" : 1000,
         "session_id" : "52c2370f5027043d286daca4de247db0",
         "recorded_seq" : 1000,
         "end_last_seq" : 1000,
         "doc_write_failures" : 0,
         "start_time" : "Thu, 28 Oct 2010 10:24:13 GMT",
         "start_last_seq" : 0,
         "end_time" : "Thu, 28 Oct 2010 10:24:14 GMT",
         "missing_checked" : 0,
         "docs_written" : 1000,
         "missing_found" : 1000
      }
   ],
   "session_id" : "52c2370f5027043d286daca4de247db0",
   "source_last_seq" : 1000
}
```

Replication of a database means that the two databases - the 'source' and the 'target' - are synchronized. By default, the replication process occurs one time, and synchronizes the two databases together.

The response to a request for a single replication is a JSON structure containing the success or failure status of the synchronization process. The response also contains statistics about the process.

The structure of the response includes details about the replication status:

-  **history [array]**: Replication History
  -  **doc\_write\_failures**: Number of document write failures
  -  **docs\_read**: Number of documents read
  -  **docs\_written**: Number of documents written to target
  -  **end\_last\_seq**: Last sequence number in changes stream
  -  **end\_time**: Date/Time replication operation completed
  -  **missing\_checked**: Number of missing documents checked
  -  **missing\_found**: Number of missing documents found
  -  **recorded\_seq**: Last recorded sequence number
  -  **session\_id**: Session ID for this replication operation
  -  **start\_last\_seq**: First sequence number in changes stream
  -  **start\_time**: Date/Time replication operation started
-  **ok**: Replication status
-  **session\_id**: Unique session ID
-  **source\_last\_seq**: Last sequence number read from source database

### Continuous Replication

> Example instructions for enabling continuous replication:

```shell
curl -H 'Content-Type: application/json' -X POST http://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_replicate -d @replication-doc.json
# where the file replication-doc.json indicates that the replication should be continuous
```

```http
POST /_replicate HTTP/1.1
Content-Type: application/json
```

> Example document specifying that the replication should be continuous:

```json
{
  "source": "http://username:password@example.com/foo", 
  "target": "http://username:password@username.cloudant.com/bar", 
  "continuous": true
}
```

By default, the synchronization of a database during replication happens only once, at the time the replicate request is made. To ensure that replication from the source database to the target database takes place continually, set the `continuous` field of the JSON object within the request to `true`.

With continuous replication, changes in the source database are replicated to the target database forever, until you specifically cancel the replication.

Changes are replicated between the two databases as long as a network connection is available between the two instances.

When in operation, the replication process does not stop when it has processed all current updates.
Instead, the replication process continues to wait for further updates to the source database, and applies them to the target.

<aside class="warning">Continuous replication forces checks to be made continuously on the source database.
This results in an increasing number of database accesses, even if the source database content has not changed.
Database accesses are counted as part of the work performed by a multi-tenant database configuration.</aside>

#### Canceling Continuous Replication

> Example replication request to create the target database if it does not exist, and to replicate continuously:

```json
{
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
   "create_target" : true,
   "continuous" : true
}
```

> Example request to cancel the replication, providing matching fields to the original request:

```json
{
    "cancel" : true,
    "continuous" : true
    "create_target" : true,
    "source" : "http://user:pass@example.com/db",
    "target" : "http://user:pass@user.cloudant.com/db",
}
```

Cancel continuous replication by including the `cancel` field in the JSON request object, and setting the value to `true`.

<aside class="warning">For the cancelation request to succeed, the structure of the request must be identical to the original request. In particular, if you requested continuous replication, the cancellation request must also contain the `continuous` field.</aside>

Requesting cancellation of a replication that does not exist results in a 404 error.

### Example replication sequence

> Example instructions for starting a replication:

```shell
$ curl -H 'Content-Type: application/json' -X POST 'http://username.cloudant.com/_replicate' -d @replication-doc.json
#the file replication-doc.json describes the intended replication.
```

```http
POST /_replicate HTTP/1.1
Content-Type: application/json
```

> Example document describing the intended replication:

```json
{
  "source": "https://username:password@example.com/foo", 
  "target": "https://username:password@username.cloudant.com/bar", 
  "create_target": true, 
  "continuous": true
}
```

> Example response after starting the replication:

```json
{
  "ok": true,
  "_local_id": "0a81b645497e6270611ec3419767a584+continuous+create_target"
}
```

> Example instructions for canceling the replication:

```shell
curl -H 'Content-Type: application/json' -X POST http://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/_replicate -d @replication-doc.json
# where the file replication-doc.json specifies the replication task to be canceled.
```

```http
POST /_replicate HTTP/1.1
Content-Type: application/json
```

> Example document specifying the replication to be canceled:

```json
{
  "replication_id": "0a81b645497e6270611ec3419767a584+continuous+create_target",
  "cancel": true
}
```

> Example response after successfully canceling the replication, indicated by the `"ok":true` content:

```json
{
  "ok": true,
  "_local_id": "0a81b645497e6270611ec3419767a584+continuous+create_target"
}
```

A simple example of creating a replication task, then canceling it.

