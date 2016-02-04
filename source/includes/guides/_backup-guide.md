## Back up your data

IBM Cloudant creates three copies of each document and stores it on three different servers in a cluster to ensure high availability. This practice is the default for all Cloudant users. Even when your data is replicated in triplicate, it is still  important to back it up.

You can lose access to your data in more than one way. For example, if a hurricane destroys your data center and all three nodes are in that location, you lose your data. You can prevent the loss of your data in a disaster by replicating your data to a cluster (dedicated or multi-tenant) in a different geographic location. However, if a faulty application deletes or overwrites the data in your database, duplicate data is not helpful.

Database backups protect your data against potential loss or corruption. Cloudant’s replication creates a database backup and stores it on a Cloudant cluster. You can restore data, entire databases or specific JSON documents, from these backups to your production cluster.

With Cloudant, a database backup stores your database content to a checkpoint. It is possible to ‘roll back' to a specific checkpoint. The checkpoint is not specific to a precise time. Instead, it is a record of the database after specific changes occurred during the backup period. In this way, a backup can preserve the state of your database at a selected time.


### Enabling your account for backups

To enable backups with your IBM Cloudant database, you must request a backup task. The Cloudant Support team creates a backup task. You cannot create the backup task on your own. The backup task requires additional processes, and Support must enable enough storage capacity to handle the backup activities.

To enable backups, follow these steps.

1.	Call IBM Cloudant Support to create a backup task for enabling backups.
2.	Provide the following information.
  - Target cluster for backups.
  - Preferred backup task name, for example `towed_vehicles_backup`.
  - List of accounts and databases to backup, `towed_vehicles`. Backup is currently limited to 50 databases per customer.
  - Frequency for running backups. Cloudant requires 24 hours between each backup. It is not possible to request a specific time for a backup to begin.
3.	Support enables backups, schedules backup operations, and verifies the initial backup runs.

###Incremental backups

At this point, there is no obvious, out-of-the-box solution for backing up a cloud database. You can replicate the database to a dated backup database. This method works and is easy to do. But if the database is big and you need backups for multiple points in time, like seven daily backups and four weekly ones, you end up storing a complete copy in each new backup database, which equals massive disk usage. Incremental backups are a good solution for storing only the documents that have changed since the last backup.

Initially, you perform a backup of the entire database. After the first backup, you run daily, incremental backups, backing up only what has changed in the database since the last backup. This replication becomes a daily backup.

<aside class="warning">You can configure a backup to trigger at regular intervals. However, each interval must be 24 hours or more. In other words, you can run daily backups but not hourly backups.</aside>

####Setup

Incremental backups save only the delta between backups. Every 24 hours, the source database is repeatedly replicated to a target database. Replication uses sequence values to identify the documents changed during that 24-hour period. The backup operation uses replication to get and store a checkpoint. This checkpoint is another database with an internal name. The backup operation creates the name from a combination of the date and the backup task name. This name makes it easier to identify checkpoints during the recovery or roll up process.

The replication process starts with another database with a `since_seq` parameter. The `since_seq` parameter indicates where the last replication stopped. The following steps show how to set up incremental backups.

1.	Find the ID of the checkpoint document for the last replication. It is stored in the  `_replication_id` field of the replication document in the `_replicator` database.
2.	Open the checkpoint document at `/<database>/_local/<_replication_id>`, where `<_replication_id>` is the ID you found in the previous step and `<database>` is the name of the source or the target database. The document usually exists on both databases but might only exist on one.
3.	Search for the `recorded_seq` field of the first element in the history array.
4.	Start replicating to a new database.  
5.	Set the `since_seq` field in the replication document to the value of the `recorded_seq` field.


### Roll ups

A roll up combines daily backups into weekly, rolled up databases. These roll up databases combine the daily deltas into a coarser time slice. Weekly databases roll up into monthly databases, and monthly databases roll up into yearly databases. You manage roll up frequencies and settings via the Backup Task.

You can request the following intervals for roll ups:
- Daily - Combine daily checkpoints into a weekly checkpoint.
- Weekly - Combine weekly checkpoints into a monthly checkpoint.
- Monthly - Combine monthly checkpoints into a yearly checkpoint.

These requests are one-off requests and do not repeat automatically. If you request a daily roll up to create a weekly checkpoint and you want another weekly checkpoint the following week, you must request a daily roll up again.

<aside class="warning">A roll up does not remove the original checkpoints. To conserve space when databases are rolled up, remove the input databases that the roll up uses. If you request a daily roll up, the daily checkpoints still exist. To remove the rolled-up checkpoints and save storage costs, request a backup cleanup.</aside>


### Restores

To restore a database from a backup, you replicate each incremental backup to a new database starting with the latest increment. Replicating from the latest incremental backup first is faster because updated documents are only written to the target database once. However, this order is not required.


### An example
This example shows how to create databases to use backup, run a full backup, set up and run an incremental backup, and restore backups.

> Constants used in this guide

```shell
# save base URL and the content type in shell variables
$ url='https://<username>:<password>@<username>.cloudant.com'
$ ct='Content-Type: application-json'
```

Let's say you need to back up one database. You want to create a full backup on Monday and an incremental backup on Tuesday. You can use the curl and [jq](http://stedolan.github.io/jq/) commands to run these operations. Of course, any http client will work.

<div> </div>

#### Step 1: Create three databases

> Create three databases to use with this example

```shell
$ curl -X PUT "${url}/original"
$ curl -X PUT "${url}/backup-monday"
$ curl -X PUT "${url}/backup-tuesday"
```

```http
PUT /original HTTP/1.1
```

```http
PUT /backup-monday HTTP/1.1
```

```http
PUT /backup-tuesday HTTP/1.1
```

You create three databases: one original and one for Monday and Tuesday.

<div> </div>

#### Step 2: Create the `_replicator` database

> Create the `_replicator` database

```shell
$ curl -X PUT "${url}/_replicator"
```

```http
PUT /_replicator HTTP/1.1
```

If it does not exist, create the `_replicator` database.

<div> </div>

#### Step 3: Back up the entire database

> Run a full backup on Monday

```http
PUT /_replicator/backup-monday HTTP/1.1
Content-Type: application/json
```

```shell
$ curl -X PUT "${url}/_replicator/backup-monday" -H "$ct" -d @backup-monday.json
# where backup-monday.json has the following contents:
```

```json
{
  "_id": "backup-monday",
  "source": "${url}/original",
  "target": "${url}/backup-monday"
}
```

On Monday, back up your data for the first time and replicate
everything from `original` to `backup-monday`.


<div> </div>

#### Step 4: Get checkpoint ID

> Get checkpoint ID to run an incremental backup

```http
GET /_replicator/backup-monday HTTP/1.1
```

```shell
$ replication_id=$(curl "${url}/_replicator/backup-monday" | jq -r '._replication_id')
```

On Tuesday, things get more complicated. To start the incremental backup, you need two values: checkpoint ID and `recorded_seq`. These values mark where the last backup ended and indicate where to start the next incremental backup.

The checkpoint ID value is stored in the `_replication_id` field in the replication document in the `_replicator` database. After you get these values, you can run the incremental backup.

<div> </div>

#### Step 5: Get `recorded_seq` value

> Get `recorded_seq` from original database

```http
GET /original/_local/${replication_id} HTTP/1.1
```

```shell
$ recorded_seq=$(curl "${url}/original/_local/${repl_id}" | jq -r '.history[0].recorded_seq')
```
After you get the checkpoint ID, you use it to get the `recorded_seq` value from the first element of the history array in the `/_local/${replication_id}` document in the original database.

<div> </div>

#### Step 6: Run an incremental backup

> Start Tuesday's incremental backup

```http
PUT /_replicator/backup-tuesday HTTP/1.1
Content-Type: application/json
```

```shell
$ curl -X PUT "${url}/_replicator/backup-tuesday" -H "${ct}" -d @backup-tuesday.json
# where backup-tuesday.json contains the following:
```

```json
{
  "_id": "backup-tuesday",
  "source": "${url}/original",
  "target": "${url}/backup-tuesday",
  "since_seq": "${recorded_seq}"
}
```

Now that you have the checkpoint ID and `recorded_seq`, you can start Tuesday's  incremental backup.

<div> </div>

#### Step 7: Restore the Monday backup

> Restore from the `backup-monday` database

```http
PUT /_replicator/restore-monday HTTP/1.1
Content-Type: application/json
```

```shell
$ curl -X PUT "${url}/_replicator/restore-monday" -H "$ct" -d @restore-monday.json
# where restore-monday.json contains the following:
```

```json
{
  "_id": "restore-monday",
  "source": "${url}/backup-monday",
  "target": "${url}/restore",
  "create-target": true  
}
```

To restore from a backup, replicate the initial full backup, and any incremental backups, to a new database. To restore Monday's state, replicate from the `backup-monday` database.

<div> </div>

#### Step 8: Restore the Tuesday backup

> Restore Tuesday's backup with the latest changes first

```http
PUT /_replicator/restore-tuesday HTTP/1.1
Content-Type: application/json
```

```shell
$ curl -X PUT "${url}/_replicator/restore-tuesday" -H "$ct" -d @restore-tuesday.json
# where restore-tuesday.json contains the following json document:
```

```json
{
  "_id": "restore-tuesday",
  "source": "${url}/backup-tuesday",
  "target": "${url}/restore",
  "create-target": true  
}
```

> Restore Tuesday's backup with Monday's backup last

```http
PUT /_replicator/restore-monday HTTP/1.1
Content-Type: application/json
```

```shell
$ curl -X PUT "${url}/_replicator/restore-monday" -H "$ct" -d @restore-monday.json
# where restore-monday.json contains the following json document:
```

```json
{
  "_id": "restore-monday",
  "source": "${url}/backup-monday",
  "target": "${url}/restore"
}
```

If you want to restore Tuesday's state instead, replicate from `backup-tuesday` and then from `backup-monday`. If you use this order, documents updated on Tuesday will only need to be written to the target database once.

<div> </div>

### Using the Dashboard

You can review the status and history of backups using the Dashboard.

  - View the status of the last backup, including date and time.
  - View the history of all backup replications that have run for a specific backup operation.
  - View a list of backup document versions by date and time.
  - View a current document and diff of any backed up version.
  - Restore document to backed up version.

Cloudant Support can help you with restores, status, and problems with backups.

  - Restore an entire database or a specific document from backup.
  - Ask about the status of a backup.
  - Log issues with backups.
  - Cleanup backup checkpoints that have rolled up and combined with a higher-level checkpoint.

### Best practices

While the previous information outlines the basic backup process, each application needs its own requirements and strategies for backups. Here are a few best practices you might want to keep in mind.

#### Scheduling backups

Replication jobs can significantly increase the load on a cluster. If you are backing up several databases, it is best to stagger the replication jobs for different times or to a time when the cluster is less busy.

##### Changing the IO priority of a backup

> Setting the IO priority

```json
{
  "source": {
    "url": "https://user:pass@example.com/db",
    "headers": {
      "x-cloudant-io-priority": "low"
    }
  },
  "target": {
    "url": "https://user:pass@example.net/db",
    "headers": {
      "x-cloudant-io-priority": "low"
    }
  }
}
```

You can change the priority of backup jobs by adjusting the settings in the `x-cloudant-io-priority` field.
1.	In the target, change the `headers` object.
2.	In the source, change the replication document to "low".


<div id="design-documents"> </div>

#### Backing up design documents

If you backup design documents, the backup operation creates indexes on the backup destination. This practice slows down the backup process and uses unnecessary amounts of disk space. If you don't require indexes on your backup system, use a filter function with your replications to filter out design documents. You can also use this filter function to filter out other documents that are not required.

#### Backing up multiple databases

If your application uses one database per user, or allows each user to create several databases, you need to create a backup job for each new database. Make sure that your replication jobs do not begin at the same time.

### Need help?

Replication and backups can be tricky. If you get stuck,
check out the [replication guide](./replication_guide.html),
talk to us on IRC (#cloudant on freenode), or email <a href="mailto:support@cloudant.com">support</a>.
