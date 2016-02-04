## Supported client libraries

### Mobile

The Cloudant Sync library is used to store, index and query local JSON data on a mobile device.
It is also used to synchronise data between many devices.
Synchronisation is controlled by your application.
The library also lets you manage and resolve conflicts easily,
both in the local device or the remote database.

Two versions are available:

- <a target="_blank" href="https://github.com/cloudant/sync-android">Cloudant Sync - Android / JavaSE</a>
- <a target="_blank" href="https://github.com/cloudant/CDTDatastore">Cloudant Sync - iOS</a>

An <a target="_blank" href="https://cloudant.com/product/cloudant-features/sync/">overview</a> of Cloudant Sync is available,
as are details of <a target="_blank" href="https://cloudant.com/cloudant-sync-resources/">resources</a>.

### Java

<a target="_blank" href="https://github.com/cloudant/java-cloudant">java-cloudant</a> is the official Cloudant library for Java. You can add it as a dependency to your maven or gradle builds.

#### Maven dependency details
`<dependency>`<br/>
&nbsp;&nbsp;`<groupId>com.cloudant</groupId>`<br/>
&nbsp;&nbsp;`<artifactId>cloudant-client</artifactId>`<br/>
&nbsp;&nbsp;`<version>1.0.0-beta1</version>`<br/>
`</dependency>`

#### Gradle dependency details

`dependencies {`<br/>
&nbsp;&nbsp;`compile group: 'com.cloudant', name: 'cloudant-client', version:'1.0.0-beta1'`<br/>
`}`

<table>
<tr>
<th>Libraries and Frameworks</th>
<th>Examples and Tutorials</th>
</tr>
<tr>
<td><ul><li><a target="_blank" href="https://github.com/cloudant/java-cloudant">java-cloudant</a></li>
<li><a target="_blank" href="http://code.google.com/p/ektorp/">ektorp</a></li>
<li><a target="_blank" href="http://code.google.com/p/jcouchdb/">jcouchdb</a></li>
<li><a target="_blank" href="https://github.com/isterin/jrelax">jrelax</a></li>
<li><a target="_blank" href="http://www.lightcouch.org/">LightCouch</a></li>
<li><a target="_blank" href="https://ace.ng.bluemix.net/#/store/cloudOEPaneId=store&appTemplateGuid=CloudantJavaBPTemplate&fromCatalog=true">Java Cloudant Web Starter</a> boilerplate for Bluemix.</li></ul>
</td>
<td><ul><li><a target="_blank" href="https://github.com/cloudant/haengematte/tree/master/java">CRUD</a> with HTTP and JSON libraries.</li>
<li><a target="_blank" href="https://github.com/cloudant/haengematte/tree/master/java/CrudWithEktorp">CRUD</a> with ektorp library.</li>
<li><a target="_blank" href="https://cloudant.com/blog/building-apps-using-java-with-cloudant-on-ibm-bluemix/">Building apps using Java with Cloudant on IBM Bluemix</a></li>
<li><a target="_blank" href="http://www.ibm.com/developerworks/cloud/library/cl-multiservicegame-app/index.html?ca=drs-">Build a game app with Liberty, Cloudant, and Single Sign On</a> Bluemix example.</li>
<li><a target="_blank" href="https://developer.ibm.com/bluemix/2014/10/17/building-java-ee-app-ibm-bluemix-using-watson-cloudant/">Building a Java EE app on IBM Bluemix Using Watson and Cloudant</a> Bluemix example along with <a target="_blank" href="https://www.youtube.com/watch?feature=youtu.be&v=9AFMY6m0LIU&app=desktop">YouTube video</a>.</li></ul>
</td>
</tr>
</table>

### Node.js

<a target="_blank" href="https://github.com/cloudant/nodejs-cloudant">nodejs-cloudant</a> is the official Cloudant library for Node.js. You can install it with npm:

`npm install cloudant`

<table>
<tr>
<th>Libraries and Frameworks</th>
<th>Examples and Tutorials</th>
</tr>
<tr>
<td>
<ul>
<li>
<a target="_blank" href="https://github.com/cloudant/nodejs-cloudant">nodejs-cloudant</a> (<a target="_blank" href="https://www.npmjs.org/package/cloudant">npm</a>)</li>
<a target="_blank" href="https://github.com/sbisbee/sag-js">sag-js</a> which also works in the browser. See <a target="_blank" href="http://www.saggingcouch.com/">saggingcouch</a> for more detail.</li>
<li>
<a target="_blank" href="https://github.com/dscape/nano">nano</a> is a minimalist implementation.</li>
<li>
<a target="_blank" href="https://github.com/danwrong/restler">restler</a> delivers the best performance but is really barebones.</li>
<li>
<a target="_blank" href="http://cloudhead.io/cradle">cradle</a> is a high-level client is also available if you absolutely need ease of use at the cost of lower performance.</li>
<li><a target="_blank" href="https://github.com/ddemichele/cane_passport">cane_passport</a> - Cloudant Angular Node Express with Bootstrap.</li>
<li><a target="_blank" href="https://github.com/cloudant-labs/express-cloudant">express-cloudant</a> - a template for Node.js Express framework also using PouchDB and Grunt.</li>
<li><a target="_blank" href="https://ace.ng.bluemix.net/#/store/cloudOEPaneId=store&appTemplateGuid=nodejscloudantbp&fromCatalog=true">Node.js Cloudant DB Web Starter</a> - boilerplate for Bluemix.</li>
<li><a target="_blank" href="https://ace.ng.bluemix.net/#/store/cloudOEPaneId=store&appTemplateGuid=mobileBackendStarter&fromCatalog=true">Mobile Cloud</a> - boiler plate for Bluemix (Node.js, Security, Push, and Mobile Data/Cloudant)</li>
</ul>
</td>
<td>
<ul>
<li><a target="_blank" href="https://github.com/cloudant/haengematte/tree/master/nodejs">CRUD</a></li>
<li><a target="_blank" href="https://cloudant.com/blog/using-cloudant-with-node-js/">Using Cloudant with Node.js</a></li>
<li><a target="_blank" href="https://github.com/garbados/Cloudant-Uploader">Cloudant-Uploader</a> - utility to upload .csv files to Cloudant.</li>
<li><a target="_blank" href="https://github.com/glynnbird/couchimport">couchimport</a> - utility to import csv or tsv files into CouchDB or Cloudant</li>
<li><a target="_blank" href="http://thoughtsoncloud.com/2014/07/getting-started-ibm-bluemix-node-js/">Getting started with IBM Bluemix and Node.js</a></li>
<li><a target="_blank" href="https://gigadom.wordpress.com/2014/08/15/a-cloud-medley-with-ibm-bluemix-cloudant-db-and-node-js/">A Cloud medley with IBM Bluemix, Cloudant DB and Node.js</a></li>
<li><a target="_blank" href="http://www.ibm.com/developerworks/cloud/library/cl-guesstheword-app/index.html?ca=drs-">Build a simple word game app using Cloudant on Bluemix</a> - uses Node.js</li>
<li><a target="_blank" href="https://www.twilio.com/blog/2012/09/building-a-real-time-sms-voting-app-part-1-node-js-couchdb.html">Building a Real-time SMS Voting App</a> - six-part series using Node.js, Twilio, and Cloudant.</li>
<li><a target="_blank" href="http://msopentech.com/blog/2013/12/19/tutorial-building-multi-tier-windows-azure-web-application-use-cloudants-couchdb-service-node-js-cors-grunt-2/">Building a Multi-Tier Windows Azure Web application</a> - uses Cloudant, Node.js, CORS, and Grunt.</li>
<li><a target="_blank" href="http://www.ibm.com/developerworks/library/ba-remoteservpi-app/index.html">Do it yourself: Build a remote surveillance app using Bluemix, Cloudant, and Raspberry Pi.</a></li>
</ul>
</td>
</tr>
</table>
