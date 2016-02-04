## Transactions in Cloudant

> Example shopping app documents:

```json
{
  "type": "purchase",
  "item": "...",
  "account": "...",
  "quantity": 2,
  "unit_price": 99.99
}

{
  "type": "payment",
  "account": "...",
  "value": 199.98
}
```

In a shopping app, purchases must reflect charges and a change in inventory. However, if one of those processes fails while others succeed, your information becomes inconsistent. While previous revisions of your documents might be lost to [compaction](http://en.wikipedia.org/wiki/Data_compaction), regularly holding on to older data can slow things down.

The easiest way to achieve consistency is *not* update documents at all.

In the case of the shopping app, instead insert documents like the examples provided.

<div></div>

> Example view to calculate a running total:

```json
{
  "views": {
    "totals": {
      "map": function(doc){
        if(doc.type === 'purchase'){
          emit(doc.account, doc.quantity * doc.unit_price);
        }else{
          if(doc.type === 'payment'){
            emit(doc.account, -doc.value);
          } 
        }
      },
      "reduce": "_sum"
    }
  }
}
```

`item` and `account` are IDs for other objects in your database. To calculate a running total for an account, we would use a [view](creating_views.html) like the example provided.

Calling this view with the `group=true&key={account}` options gives you a running balance for a particular account. To give refunds, insert a document with values to balance out the transaction.

Logging events and aggregating them to determine an object's state is called [event sourcing](http://martinfowler.com/eaaDev/EventSourcing.html). It can provide SQL-like transactional [atomicity](#acid_atomic) even in a [NoSQL database](basics.html#json) like Cloudant.

### Event Sourcing

In event sourcing, the database's [atomic](#acid_atomic) unit is the document, which means if a document fails to write, it should never leave the database in an inconsistent state.

Documents should be understood as a sum of their interactions instead of merely their current state. In the case of the shopping app, this would be representing an account as every transaction logged within it instead of just its current balance.

### Grouping Transactions

> Example array with multiple IDs:

```json
{
  "uuids": [
    "320afa89017426b994162ab004ce3383",
    "320afa89017426b994162ab004ce3b09",
    "320afa89017426b994162ab004ce4083"
  ]
}
```

The `_uuids` ([UUIDs](http://en.wikipedia.org/wiki/Universally_unique_identifier)) endpoint can be used to maintain purchases as individual documents when they are purchased through a shopping cart in a single transaction.

By default, `https://$USERNAME.cloudant.com/_uuids` returns one ID. An array of multiple IDs can be called with `_uuids?count=$NUMBER`, so `?count=3` would return something like the example provided.

<div></div>

> Example of shared transaction `_id`:

```json
{
  "views": {
    "transactions": {
      "map": function(doc){
        if(doc.type === 'purchase'){
          emit(doc.transaction_id, null);
        }
      }
    }
  }
}
```

These arrays can be used to generate a shared transaction `_id` which allows you to retrieve them as a group later. A view for this might look something like the example provided.

A `_view/transactions?key={transaction_id}&include_docs=true` query retrieves every change associated with a transaction.

### Mapping Data into Events

> Example document to be mapped to another database:

```json
{
  "account_id": "...",
  "balance": "...",
  "transaction_history": [{
    "date": "...",
    "item": "...",
    "quantity": "...",
    "unit_price": 100
  },{
    "date": "...",
    "transaction_id": "...",
    "destination_account": "...",
    "change": 50
  }]
}
```

> Example view to map a document to another database:

```json
{
  "views": {
    "events": {
      "map": function(doc){
        for(var i in doc.transaction_history){
          var transaction = doc.transaction_history[i];
          emit({
            from: doc.account_id,
            to: transaction.destination_account,
            transaction_id: transaction.transaction_id,
            date: transaction.date
          }, transaction.change);
        }
      },
      "dbcopy": "events"
    }
  }
}
```

> Example document in the events database, describing the mapping performed by a view:

```json
{
  "key": {
    "from": "...",
    "to": "...",
    "transaction_id": "...",
    "date": "..."
  },
  "value": 100
}
```
The `dbcopy` map can be used to migrate data into events, and then output them to another database, in order to better accommodate event sourcing.

A document can be mapped into another database using a [view](creating_views.html). The mapping also generates a document in the events database.
