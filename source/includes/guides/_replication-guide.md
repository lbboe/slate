## Replication

Cloudant’s replication capabilities are best-of-class. Data can be copied from one database to another in the same Cloudant account, across accounts and across data centers. Data can even be replicated to and from a Cloudant account and a mobile device using [Cloudant Sync](https://cloudant.com/product/cloudant-features/sync/) or [PouchDB](http://pouchdb.com/). Replication can run in one direction or in both directions, as one-shot or continuous operation and can be finely tuned with optional parameters.

Cloudant’s replication protocol is compatible with a range of other databases and libraries, making it a great fit for Internet of Things (IoT) and mobile applications. 

This guide introduces Cloudant’s replication functionality, discuss common use-cases and shows how to make your application replicate successfully.

### What is Replication?

Cloudant is a distributed JSON data store with an HTTP API which is run as a service on multiple clouds, or in your server rack. Documents are stored in databases and can grow to any size as Cloudant shards its data across many nodes. Replication is the copying of data from a source database to a target database.  The source and target databases need not be on the same Cloudant account, or even in the same data center. 
  
![replication](images/replication_guide_1.png)

Replication is complete when the latest version of each document in the source has made it to the destination database; this includes new documents, updates to existing documents and deletions. Only the latest version of a document will remain after replication; older versions are left behind. 

The source database remains unaltered by replication (apart from checkpoint data being written to it, to allow partial replications to resume from the last known position) and any pre-existing data in the destination database remains.

### How do I initiate replication via the Dashboard?

The Cloudant Dashboard provides a convenient user-interface to trigger replication. Simply visit the Replication tab of your Cloudant Dashboard and click on the New Replication button. Complete the simple form:

![replication2](images/replication_guide_2.png)

defining the source and target databases and click “Replicate”.  
  
![replication3](images/replication_guide_3.png)

The status of each replication task can be seen in the “All Replications” section of the Dashboard, with each job moving from “Triggered” to “Complete” as it progresses.

![replication4](images/replication_guide_4.png)

### How do I run replication across different Cloudant accounts?

> Source and target URLs

```json
{
  "source": "https://myfirstaccount.cloudant.com/a",
  "target": "https://mysecondaccount.cloudant.com/b"
}
```

The source and target of a replication are simply URLs of Cloudant databases e.g.

The source and target need not be on the same account, nor does the source and target database name need to match.

### Do I run replication on the source or the destination?

Replication can be initiated at either the source or the destination end. This means that you can decide whether account A is pushing data to account B, or account B is pulling data from account A. In some cases, it may not be possible to run replication in either configuration e.g. if one account is behind a firewall. Replication happens over HTTP (or HTTPS) and so no non-standard ports need be opened. The decision as to which device initiates replication is left to you.

### How to initiate replication via the Cloudant API?

> Starting a replication job

```http
POST /_replicator HTTP/1.1
Content-Type: application/json
Host: myaccount.cloudant.com
Authorization: ...
```

```shell
curl 
   -X POST 
   -H 'Content-type: application/json'
   'https://myuser:mypassword@myaccount.cloudant.com/_replicator'
   -d '@replication.json'
```

```json
{
  "_id": "weekly_backup",
  "source":  "https://username:password@myaccount1.cloudant..com/source",
  "target":  "https://username:password@myaccount2.cloudant.com/destination",
  "create_target":  true
}
```

Every Cloudant account has a special database called `_replicator`, into which replication jobs can be inserted. Simply add a document into the `_replicator` database to initiate replication.

 * `_id` - Supplying an _id field is optional, but can be useful in order to identify replication tasks. Cloudant will generate a value for you if you do not supply one.
 * `source` - the URL of the source Cloudant database, including login credentials
 * `target` - the URL of the destination Cloudant database, including login credentials
 * `create_target` (optional) - whether to create the destination database if it doesn't exist or not

### Checkpoints

Under the hood, the replication process writes its state in “checkpoint” documents in both the source and destination databases. This allows replication to be resumed from where it left off without having to start from scratch. This feature can be switched off by supplying `"use_checkpoints": false` when starting replication, but is recommended to leave this feature on if your replication is to resume efficiently from its last known position.

### Permissions

Admin access is required to insert a document into the `_replicator` database, but the login credentials supplied in the source / target parameters need not have admin rights, only the rights to be able to:

 * write documents at the destination end
 * write checkpoint documents at both ends 

Cloudant has a special `_replicator` user permission which allows the creation of checkpoint documents, but does not allow the creation of ordinary documents in a database. It is recommended that you create API keys that have

 * `_reader` and `_replicator` access at the source side
 * `_writer` access at the destination side

API keys are created and configured on a per-database basis in the Cloudant Dashboard

![replication](images/replication_guide_5.png)
  
or programmatically via the Cloudant API.

### Two-way replication

What if we wanted data to be copied in both directions; known as two-way replication or synchronization? The answer is that we would simply set up two separate replication processes, one taking the data from A to B, the other taking data from B to A. It’s as simple as that! Both replication processes progress independently, with data moving seamlessly in both directions.

![replication6](images/replication_guide_6.png)

### Continuous replication

> Starting a continuous replication

```http
POST /_replicator HTTP/1.1
Content-Type: application/json
Host: myaccount.cloudant.com
Authorization: ...

```

```shell
curl 
   -X POST 
   -H "Content-type: application/json"
   https://myuser:mypassword@myaccount.cloudant.com/_replicator
   -d @continuous-replication.json
```

```json
{
  "_id": "weekly_continuous_backup",
  "source":  "https://username:password@myaccount1.cloudant..com/source",
  "target":  "https://username:password@myaccount2.cloudant.com/destination",
  "continuous": true
}
```

So far we have only dealt with one-shot replication which finishes when all of the source data has been written to the target database. With continuous replication, data flows continuously with all subsequent changes to the source database being transmitted to the target database in real-time.

Continuous replication is triggered by clicking the “Make this replication continuous” tick box when defining a replication task in the Cloudant Dashboard, or by setting the `"continuous"` flag via the Cloudant API:

Two-way replication can be continuous in one or both of the directions by setting the continuous flag accordingly.

### Monitoring replication

> Monitoring a replication process

```shell
curl 'https://myaccount.cloudant.com/_replicator/weekly_backup'
```

```http
GET /_replicator/weekly_backup HTTP/1.1
HOST: myaccount.cloudant.com
Authorization: ...
```

> Response

```json
{
  "_id": "weekly_backup",
  "_rev": "22-c57c18f7e761f1a76fa977caa03cd098",
  "source": "https://u:p@myaccount.cloudant.com/a",
  "create_target": false,
  "target": "https://u:p@myaccount.cloudant.com/b",
  "continuous": true,
  "_replication_state": "triggered",
  "_replication_state_time": "2014-12-01T15:19:01+00:00",
  "_replication_id": "4514b08cb4c2ded7da9ab04a87182ceb"
}
```

Cloudant’s `_replicator` database can be interrogated at any time using the Dashboard or via the API:

If replication has failed (e.g. if the authentication credentials were invalid), then the error state will be recorded in the `_replicator` document. In addition, the Cloudant account’s `/_active_tasks` endpoint can be used to see replication work as it progresses (see https://docs.cloudant.com/guides/replication/replicator-database.html for more details).

### Cancelling replication

> Cancelling a replication

```shell
curl -X DELETE 'https://myaccount.cloudant.com/_replicator/weekly_backup?rev=22-c57c18f7e761f1a76fa977caa03cd098'
```

```http
DELETE /_replicator/weekly_backup?rev=22-c57c18f7e761f1a76fa977caa03cd098 HTTP/1.1
Host: myaccount.cloudant.com
Authorization: 
```

Stopping an ongoing replication job is a simple matter of deleting the document from the `_replicator` database, either via the Dashboard or via the API.

### Other replication use-cases

Replication isn’t just for Cloudant-to-Cloudant data transfer. Cloudant’s replication protocol is compatible with other databases and libraries for a variety of real-world applications.

#### Apache CouchDB

[Apache CouchDB](http://couchdb.apache.org/) is an open-source database that can communicate with Cloudant out-of-the-box. Applications include:

 * backup - replicate your data from Cloudant to your own CouchDB databases and take nightly snapshots of your data for archiving purposes. Send the data to a backup service such as [Amazon Glacier](https://aws.amazon.com/glacier/) for safe keeping
 * local-first data collection - write your data to local Apache CouchDB first and replicate it to Cloudant for long-term storage, aggregation and analysis

#### PouchDB

```
var db = new PouchDB("myfirstdatabase");

var URL = "https://u:p@username.cloudant.com/my_database");

db.sync(URL, { live: true });
```

[PouchDB](http://pouchdb.com/) is an open-source, in-browser database that allows data to be replicated between the browser and Cloudant and vice-versa. Having the data stored in a web browser, on the client side, allows web applications to continue to function without an internet connection. PouchDB can sync any changed data to and from Cloudant when a internet connection is present. Setting up replication from the client side is a few lines of Javascript.

#### CloudantSync

```
URI uri = new URI("https://u:p@username.cloudant.com/my_database");
Datastore ds = manager.openDatastore("my_datastore");

// Replicate from the local to remote database
Replicator replicator = ReplicatorFactory.oneway(ds, uri);

// Fire-and-forget (there are easy ways to monitor the state too)
replicator.start();
```

[CloudantSync](https://cloudant.com/cloudant-sync-resources/) is a set of native libraries for iOS and Android that allows data to be stored locally in a mobile device and synced with Cloudant when mobile connectivity permits. As with PouchDB, setting up replication is a few lines of code.

CloudantSync is used widely in mobile applications, such as iPhone/Android games, where the app’s state is persisted to Cloudant via replication, but the data is also available on the device for offline use.

### Filtered Replication

Sometimes it is useful to remove some data during the replication process when replicating one database to another e.g:

 * to remove all traces of deleted documents, making the target database smaller than the source
 * to segregate the data into smaller chunks e.g. UK data in one database, US data in another

###### replication filter function

> Filter function

```
function(doc, req) {
  if (doc._deleted) {
    return false;
  }
  return true;
}
```

> Starting a filtered replication

```http
POST /_replicator HTTP/1.1
Content-Type: application/json
Host: myaccount.cloudant.com
Authorization: ...

```

```shell
curl 
   -X POST 
   -H "Content-type: application/json"
   https://myuser:mypassword@myaccount.cloudant.com/_replicator
   -d @filtered-replication.json
```

```json   
{
  "_id": "weekly_backup",
  "source":  "https://username:password@myaccount1.cloudant..com/source",
  "target":  "https://username:password@myaccount2.cloudant.com/destination",
  "filter": "mydesigndoc/myfilter"
}
```

Cloudant’s filtered replication allows you to define a Javascript function which decides (via its return value) whether each document in a database is to be filtered or not. Filter functions are stored in Design Documents. Here is an example filter function that only allows non-deleted documents to be replicated.

When starting a replication job, a filter function’s name can be specified in terms of the design document it resides in and the filter function’s name.

### Changes feed

> Querying the changes feed

```http
GET /$db/_changes?feed=continuous HTTP/1.1
Host: myaccount.cloudant.com
Authorization: ...

```

```shell
curl "https://myaccount.cloudant.com/$db/_changes?feed=continuous"
```

```json
{"seq":"11-g1AAAAEueJzLYWBgYMlgTmGQSUlKzi9KdUhJMtTLTU1M0UvOyS9NScwr0ctLLckBqmJKZEiy____f1YGUyJLLlCA3cg0zdTS3II43UkOQDKpHmoAM9gAkxQzQ2OLNOIMyGMBkgwNQApoxv6sDGaoK1KTkgwTk1IJGEGKHQcgdoAdygDxaVJSorlhShYAJoFc1Q","id":"6f8ab9fa52c117eb76240daa1a55827f","changes":[{"rev":"1-619d7981d7027274a4b88810d318a7b1"}]}
```

Cloudant publishes each database’s adds, edits and deletes on a single HTTP feed which can be consumed by your application to trigger events. You can access the feed using curl.

The curl command will stream every change that is required to get the latest version of every document in the database. Each change has the following form:

with one line per change, each change consisting of a sequence number (seq), the id of the document that has changed and an array of changes. To see the document body itself, append `&include_docs=true` to the curl command.

###### changes-feed-since

> Using since

```http
GET /$db/_changes?feed=continuous&include_docs=true&since=11-g1AAAAEueJzLYWBgYMlgTmGQSUlKzi9KdUhJMtTLTU1M0UvOyS9NScwr0ctLLckBqmJKZEiy____f1YGUyJLLlCA3cg0zdTS3II43UkOQDKpHmoAM9gAkxQzQ2OLNOIMyGMBkgwNQApoxv6sDGaoK1KTkgwTk1IJGEGKHQcgdoAdygDxaVJSorlhShYAJoFc1Q HTTP/1.1
HOST: myaccount.cloudant.com
Authorization: ...
```

```shell
curl "https://myaccount.cloudant.com/$db/_changes?feed=continuous&include_docs=true&since=11-g1AAAAEueJzLYWBgYMlgTmGQSUlKzi9KdUhJMtTLTU1M0UvOyS9NScwr0ctLLckBqmJKZEiy____f1YGUyJLLlCA3cg0zdTS3II43UkOQDKpHmoAM9gAkxQzQ2OLNOIMyGMBkgwNQApoxv6sDGaoK1KTkgwTk1IJGEGKHQcgdoAdygDxaVJSorlhShYAJoFc1Q"
```

To join the changes feed from a known position, simply pass a `since` parameter with the sequence number you want to start from.

###### changes-feed-since-now

> since = now

```http
GET /$db/_changes?feed=continuous&include_docs=true&since=now HTTP/1.1
Host: myaccount.cloudant.com
Authorization: ...
```

```shell
curl "https://myaccount.cloudant.com/$db/_changes?feed=continuous&include_docs=true&since=now"
```

```
var feed = db.follow({since: "now", include_docs: true})
feed.on('change', function (change) {
  console.log("change: ", change);
})
feed.follow();
```

To rejoin the changes feed from now, set `since=now`.

To access this data programmatically is even simpler. For example the [Cloudant Node.js library](https://www.npmjs.com/package/cloudant) allows changes to be followed with a few lines of code.

Example use cases might be:

 * adding items to a message queue to trigger actions within your application, such as sending a customer email
 * update an in-memory database to record live counts of activity 
 * writing data to a text file in order to push data into an SQL database

###### changes-feed-filtering

> Filtering the changes feed

```http
GET /$db/_changes?feed=continuous&include_docs=true&since=now&filter=mydesigndoc/myfilter HTTP/1.1
Host: myaccount.cloudant.com
Authorization: ...
```

```shell
curl "https://myaccount.cloudant.com/$db/_changes?feed=continuous&include_docs=true&since=now&filter=mydesigndoc/myfilter"
```

The changes feed can be filtered using a filter function, just as replication can.

A word of caution: the `_changes` feed’s ordering isn’t guaranteed, i.e. changes may not appear in strict time order, because data is arriving from multiple Cloudant nodes and eventual consistency rules apply.

### Replication Pitfalls

#### Incorrect user permissions

In order for replication to proceed optimally when replicating from database “a” to database “b”, the credentials supplied need to have

 * `_reader` and `_replicator` rights on database “a”
 * `_writer` rights on database “b”

API keys are generated in the Cloudant Dashboard and each key can be given individual rights per Cloudant database. Cloudant needs to be able to write its checkpoint documents at the “read” end of replication, otherwise no state is saved and replication will not resume from where it left off. This can lead to performance problems when resuming replications of large data sets; without checkpoints, the replication process restarts from the beginning each time it is resumed.

#### Replication document is conflicted

Another consequence of setting user permissions incorrectly is that the `_replicator` document itself (the document that  records the current state of the replication process) becomes conflicted. In extreme examples, the document can become huge (because it contains many unresolved conflicts) eating into available space and causing extra server load. 

Check the size of your `_replicator` database by doing `GET https://myaccount.cloudant.com/_replicator` and looking for the `disk_size` in the returned JSON. If this indicates a size of over 1GB, then please contact [Cloudant support](https://cloudant.com/support/) for further advice.

An individual `_replicator` document can be checked for conflicts by querying `GET https://myaccount.cloudant.com/_replicator/<<docid>>?conflicts=true`.

###### resetting-replicator-database

> Removing and recreating the `_replicator` database

```http
DELETE /_replicator HTTP/1.1
HOST: myaccount.cloudant.com
Authorization: ...
```

```http
PUT /_replicator HTTP/1.1
HOST: myaccount.cloudant.com
Authorization: ...
```

```shell
curl -X DELETE 'https://myaccount.cloudant.com/_replicator'
curl -X PUT 'https://myaccount.cloudant.com/_replicator'
```

If you want to cancel all replications and start with a new, clean `_replicator` database, simply delete and recreate the `replicator` database.

#### Many simultaneous replications

It is easy to forget that you have set up replication between two databases and then set up additional replication processes in error. As each replication job is independent of the other, Cloudant will not prevent you from doing this but each replication task will use up system resources.

Audit your “active replications” in the Cloudant Dashboard to ensure that there are no unwanted replication tasks in progress. Simply delete any `_replicator` documents that are no longer needed.

### Tuning replication speed

By default, Cloudant replication will run at a reasonable rate to get the data from the source to the target without adversely affecting performance. There is a trade-off between replication rate and cluster performance for other tasks; your use-case may require faster replication at the expense of other Cloudant services, or conversely, you may require cluster performance to take priority with replication being treated as a background process.

There are advanced replication API options documented <a href="https://docs.cloudant.com/replication.html">here</a> which will allow you to increase or decrease the amount of computing power handed over to replication:

 * if your documents contain attachments, you may want to consider reducing the batch_size and increasing the worker_processes, to deal with the larger document size in smaller batches
 * if you have many tiny documents, then you may be able to increase the `worker_process` and `http_connections` safely
 * if you want to run replication with minimal impact, setting `worker_processes` and `http_connections` to 1 may suit you

If you have any questions about the best configuration for your use-case, please contact [Cloudant support](https://cloudant.com/support/).

