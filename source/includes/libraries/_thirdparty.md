## Third party client libraries

<aside class="warning">Third party client libraries are not maintained or supported by Cloudant.</aside>

### Mobile

Working with a Cloudant database: <a href="http://www.tricedesigns.com/2014/11/17/ibm-worklight-powered-native-objective-c-ios-apps/">IBM Worklight Powered Native Objective-C iOS Apps</a> with a Cloudant Adapter.

### C# / .NET

<a href="https://github.com/danielwertheim/mycouch" target="_blank">MyCouch</a> is an asynchronous CouchDB and Cloudant client for .Net.

To install the library, open up the Package manager console, and invoke:

`install-package mycouch.cloudant`

<table>
<tr>
<th>Libraries and Frameworks</th>
<th>Examples and Tutorials</th>
</tr>
<tr>
<td><ul>
<li><a href="https://github.com/danielwertheim/mycouch" target="_blank">MyCouch</a></li>
<li><a href="https://github.com/soitgoes/LoveSeat" target="_blank">LoveSeat</a></li>
<li><a href="https://github.com/foretagsplatsen/Divan" target="_blank">Divan</a></li>
<li><a href="https://github.com/arobson/Relax" target="_blank">Relax</a></li>
<li><a href="http://code.google.com/p/relax-net/" target="_blank">Hammock</a></li>
<li><a href="https://github.com/hhariri/EasyCouchDB" target="_blank">EasyCouchDB</a></li>
<li><a href="http://code.google.com/p/skitsanoswdk/source/browse/#svn%2Ftrunk%2FWDK10%2FWDK.API.CouchDb" target="_blank">WDK.API.CouchDB</a> from <a href="http://kanapeside.com/" target="_blank">Kanapes IDE</a>.</li>
</td>
<td>
<ul><li><a href="https://github.com/cloudant/haengematte/tree/master/c%23" target="_blank">CRUD</a></li></ul>
</td>
</tr>
</table>

### PHP

[Sag](http://www.saggingcouch.com/) is PHP's CouchDB and Cloudant client. [Sag.js](https://github.com/sbisbee/sag-js) is Sag's JavaScript counterpart.

To install, download sag from [http://www.saggingcouch.com/download.php](http://www.saggingcouch.com/download.php) then include the library in your application:

`require_once('./src/Sag.php');`

<table>
<tr>
<th>Libraries and Frameworks</th>
<th>Examples and Tutorials</th>
</tr>
<tr>
<td>
<ul>
<li><a target="_blank" href="http://www.saggingcouch.com/">sag</a></li>
<li><a target="_blank" href="https://github.com/doctrine/couchdb-client">Doctrine CouchDB Client</a></li>
<li><a target="_blank" href="https://github.com/dready92/PHP-on-Couch">PHP-on-Couch</a></li>
</ul>
</td>
<td>
<ul>
<li><a href="https://github.com/cloudant/haengematte/tree/master/php">CRUD</a></li>
</ul>
</td>
</tr>
</table>

### JavaScript

<a href="http://pouchdb.com/" target="_blank">PouchDB</a> is a JavaScript database that can sync with Cloudant, meaning you can make your apps offline-ready just by using PouchDB. For more info, see [our blog post](https://cloudant.com/blog/pouchdb) on PouchDB.

To obtain PouchDB, and for setup details, refer to <a href="http://pouchdb.com/" target="_blank">PouchDB</a>.

<aside class="notice">PouchDB is also available for Node.js: `npm install pouchdb`</aside>

<aside class="notice">PouchDB can also be installed with Bower: `bower install pouchdb`</aside>

<table>
<tr>
<th>Libraries and Frameworks</th>
<th>Examples and Tutorials</th>
</tr>
<tr>
<td><ul>
<li><a href="https://github.com/cloudant-labs/backbone.cloudant" target="_blank">Backbone.cloudant</a> See the <a href="https://cloudant.com/blog/backbone-and-cloudant/" target="_blank">blog post</a> for more information.</li>
<li><a href="http://www.saggingcouch.com/jsdocs.php" target="_blank">sag.js</a></li>
<li><a href="http://pouchdb.com/" target="_blank">PouchDB</a> - JavaScript database for browser, with offline synchronization.</li>
</ul>
</td>
<td>
<ul>
<li><a href="https://github.com/cloudant/haengematte/tree/master/javascript-jquery" target="_blank">CRUD</a> using jQuery.</li>
<li><a href="https://github.com/michellephung/CSVtoCloudant" target="_blank">CSVtoCloudant</a> - UI for importing .csv files into Cloudant. The app can also be accessed <a href="https://michellephung.github.io/CSVtoCloudant/" target="_blank">here</a>.</li>
<li><a href="https://github.com/Mango-information-systems/csv2couchdb" target="_blank">csv2couchdb</a> - UI from Mango Systems to import .csv files to CouchDB/Cloudant.</li>
<li><a href="https://github.com/millayr/songblog" target="_blank">songblog</a> - example app using JQuery.</li>
<li><a href="http://pouchdb.com/getting-started.html" target="_blank">PouchDB Getting Started Guide</a> - example Todo application that syncs from browser to Cloudant or CouchDB.</li>
<li><a href="https://github.com/rajrsingh/locationtracker" target="_blank">locationtracker</a> - example app to record and map location using PouchDB, CouchApp, and Cloudant.</li>
</ul>
</td>
</tr>
</table>

### Ruby

[CouchRest](https://github.com/couchrest/couchrest) is a CouchDB and Cloudant client with extensions for working with Rails using [CouchRest Model](https://github.com/couchrest/couchrest_model).

To install CouchRest, run the command:

`gem install couchrest`

<table>
<tr>
<th>Libraries and Frameworks</th>
<th>Examples and Tutorials</th>
</tr>
<tr>
<td>
<ul>
<li>There are many CouchDB clients listed on <a href="https://www.ruby-toolbox.com/categories/couchdb_clients">Ruby Toolbox</a>.</li>
</ul>
</td>
<td>
<ul>
<li><a href="https://github.com/cloudant/haengematte/tree/master/ruby">CRUD</a></li>
</ul>
</td>
</tr>
</table>
