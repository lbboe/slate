# ![alt tag](images/cloudantbasics_icon.png) Cloudant Basics

If it's your first time here, scan this section before you scroll further. The sections on [Client Libraries](libraries.html#-client-libraries), [API Reference](api.html#-api-reference), and [Guides](guides.html#-guides) assume you know some basic things about Cloudant.

## Database as a Service

As a hosted and managed database-as-a-service (DBaaS),
Cloudant provides an [HTTP API](basics.html#http-api) to your [JSON](#json) data,
and 24-hour operational support and maintenance.
Cloudant is based on [Apache CouchDB](http://couchdb.apache.org/),
and is delivered as a multi-tenant, dedicated, and installed service.

Signing up for a Cloudant account is free and easy:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/GDIiV_wdIJY?rel=0" frameborder="0" allowfullscreen title="Signing up for Cloudant, overview video"></iframe>

Working with Cloudant to create databases and store information is simplified through the user-friendly dashboard, as this overview explains:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/zESROlotu-g?rel=0" frameborder="0" allowfullscreen title="Dashboard overview video"></iframe>

## IBM Bluemix

Cloudant is also available as an [IBM Bluemix service](https://www.ng.bluemix.net/docs/?cm_mmc=dw-_-bluemix-_-ibmsite-_-cloudantdocs).
Bluemix is an open-standards, cloud platform for building, running, and managing applications.
Find out more,
and get started with Bluemix,
at the [home page](https://console.ng.bluemix.net/?cm_mmc=dw-_-bluemix-_-ibmsite-_-cloudantdocs).

## HTTP API
All requests to Cloudant go over the web, which means any system that can speak to the web, can speak to Cloudant. All language-specific libraries for Cloudant are really just wrappers that provide some convenience and linguistic niceties to help you work with a simple API. Many users even choose to use raw HTTP libraries for working with Cloudant.

This overview explains how the HTTP API works:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/HtGlyrosN8M?rel=0" frameborder="0" allowfullscreen title="HTTP API overview video"></iframe>

Several tools are available to help you work with the HTTP API:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/Z3CxsM47a9U?rel=0" frameborder="0" allowfullscreen title="Tools for working with HTTP API, video"></iframe>

Specific details about how Cloudant uses HTTP is provided in the [HTTP topic of the API Reference](http.html).

Cloudant supports the following HTTP request methods:

-   `GET`

    Request the specified item. As with normal HTTP requests, the format of the URL defines what is returned. With Cloudant this can include static items, database documents, and configuration and statistical information. In most cases the information is returned in the form of a JSON document.

-   `HEAD`

    The `HEAD` method is used to get the HTTP header of a `GET` request without the body of the response.

-   `POST`

    Upload data. Within Cloudant's API, `POST` is used to set values, including uploading documents, setting document values, and starting certain administration commands.

-   `PUT`

    Used to put a specified resource. In Cloudant's API, `PUT` is used to create new objects, including databases, documents, views and design documents.

-   `DELETE`

    Deletes the specified resource, including documents, views, and design documents.

-   `COPY`

    A special method that can be used to copy documents and objects.

If the client (such as some web browsers) does not support using these HTTP methods, `POST` can be used instead with the `X-HTTP-Method-Override` request header set to the actual HTTP method.

### Method not allowed error

> Example error message

```json
{
    "error":"method_not_allowed",
    "reason":"Only GET,HEAD allowed"
}
```

If you use an unsupported HTTP request type with a URL that does not support the specified type, a [405](http.html#405) error is returned, listing the supported HTTP methods, as shown in the example.

## JSON
Cloudant stores documents using JSON (JavaScript Object Notion) encoding, so anything encoded into JSON can be stored as a document. Files like images, videos, and audio are called BLObs (binary large objects) and can be stored as attachments within documents.

More information about JSON can be found in the [JSON Guide](json.html).

<div id="FindingData"></div>
## How do I find data?

There are many ways to search for and retrieve data stored in Cloudant.
This overview explains the different techniques,
and how to decide which one to use:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/b0t0uf75WgE?rel=0" frameborder="0" allowfullscreen title="Index and queries overview video"></iframe>

<div id="distributed"></div>
## Distributed
Cloudant's API enables you to interact with a collaboration of numerous machines, called a cluster. The machines in a cluster must be in the same datacenter, but can be within different 'pods' in that datacenter. Using different pods helps improve the High Availability characteristics of Cloudant.

An advantage of clustering is that when you need more computing capacity, you just add more machines. This is often more cost-effective and fault-tolerant than scaling up or enhancing an existing single machine.

For more information about Cloudant and distributed system concepts, see the [CAP Theorem](cap_theorem.html) guide.

## Replication

[Replication](replication.html) is a procedure followed by Cloudant, [CouchDB](http://couchdb.apache.org/), [PouchDB](http://pouchdb.com/), and others. It synchronizes the state of two databases so that their contents are identical.

You can continuously replicate. This means that a target database updates every time the source database changes. Testing for source changes involves ongoing internal calls.
Continuous replication can be used for backups of data, aggregation across multiple databases, or for sharing data.

<aside class="warning">Continuous replication can result in a large number of internal calls. This might affect costs for multi-tenant users of Cloudant systems. Continuous replication is disabled by default.</aside>

## Quorum - writing and reading

When you store data in a distributed database,
where content is stored in more than one node,
how do you know when all nodes have received the data?
Similarly,
when you are reading data,
how do you know that the data from the node replying to your request is the same as a copy of the data stored on other nodes?

Cloudant uses the idea of a '[Quorum](http://en.wikipedia.org/wiki/Quorum_%28distributed_computing%29)' to answer these questions.
A quorum is used to determine whether data has been successfully written or retrieved,
where the number of nodes that confirm and agree on the data written or read must be at least the number specified as 'quorum'.
A more detailed discussion is available [here](document.html#quorum).

<aside class="warning">Quorum settings are fixed for multi-tenant systems,
and cannot be changed.
For help understanding quorum settings and their implications on dedicated Cloudant systems,
contact Cloudant support.</aside>

## Cloudant Local

<a href="http://www-01.ibm.com/support/knowledgecenter/SSTPQH/SSTPQH_welcome.html" target="_blank">IBM Cloudant Data Layer Local Edition (Cloudant Local)</a> is a locally installed version of the Cloudant Database-as-a-Service (DBaaS) offering.

Cloudant Local provides you with the same basic capabilities as the full Cloudant single-tenant offering,
but hosted within your own data center installation.

A more detailed overview of Cloudant Local is <a href="http://www-01.ibm.com/support/knowledgecenter/SSTPQH_1.0.0/com.ibm.cloudant.local.install.doc/topics/clinstall_cloudant_local_overview.html?lang=en-us" target="_blank">available</a>.

The <a href="http://www-01.ibm.com/support/knowledgecenter/SSTPQH_1.0.0/com.ibm.cloudant.local.doc/SSTPQH_1.0.0_welcome.html?lang=en" target="_blank">IBM Knowledge Center</a> provides information on many aspects of Cloudant Local,
including:

- <a href="http://www-01.ibm.com/support/knowledgecenter/SSTPQH_1.0.0/com.ibm.cloudant.local.install.doc/topics/clinstall_install_configure_cloudant_local.html?lang=en" target="_blank">Installation and Configuration</a>
- <a href="http://www-01.ibm.com/support/knowledgecenter/SSTPQH_1.0.0/com.ibm.cloudant.local.install.doc/topics/clinstall_maintenance_tasks_overview.html?lang=en" target="_blank">Maintenance Tasks</a>
- <a href="http://www-01.ibm.com/support/knowledgecenter/SSTPQH_1.0.0/com.ibm.cloudant.local.install.doc/topics/clinstall_tuning_parameters_replication_cases.html?lang=en" target="_blank">Tuning replication parameters</a>
