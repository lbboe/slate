## Cloudant Geospatial

Cloudant Geospatial, or 'Cloudant Geo', combines the advanced geospatial queries of a Geographic Information System (GIS) with the flexibility and scalability of Cloudant's database-as-a-service (DBaaS) capabilities.

Cloudant Geo:

-   Enables web and mobile developers to enhance their applications using geospatial operations that go beyond simple bounding boxes.
-   Integrates with existing GIS applications, so that they can scale to accommodate different data sizes, concurrent users, and multiple locations.
-   Provides a NoSQL capability for GIS applications, so that large streams of data can be acquired from devices, sensors and satellites. This data can then be stored, processed, and syndicated across other web applications.

This overview describes Cloudant Geospatial:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/bFa3uYGY2M0" frameborder="0" allowfullscreen title="Introducing Cloudant Geospatial"></iframe>

### Cloudant Geo overview

Cloudant Geo lets you structure your data using GeoJSON\_ format. Design documents are used to index the data. Just like working with other Cloudant documents, an initial scan works through all the documents in the database, giving you the first index. Subsequent updates to the documents result in incremental updates to the index.

The key advantage of Cloudant Geo is to enable you to identify, specify, or search for documents based on a spatial relationship; in effect using geometry to provide an additional way of expressing the relationship between and within documents.

<div></div>

> Example of relation using a geospatial polygon:

```
relation=contains&g=POLYGON ((-71.0537124 42.3681995 0,-71.054399 42.3675178 0,-71.0522962 42.3667409 0,-71.051631 42.3659324 0,-71.051631 42.3621431 0,-71.0502148 42.3618577 0,-71.0505152 42.3660275 0,-71.0511589 42.3670263 0,-71.0537124 42.3681995 0))
```

An example would be to specify that a document is considered to be 'contained' if it has a geospatial characteristic that fits within a given geospatial polygon, defined by a series of points.

The basic steps for working with geospatial data in Cloudant Geo is as follows:

1.  Include a GeoJSON\_ geometry object in your JSON document. The geometry object can be of any type, including points, lines, or polygons.
2.  Index the geometry object using `st_index`.
3.  Work with the data by querying using various geometries and geometric relationships.

### GeoJSON

[GeoJSON format](http://geojson.org/geojson-spec.html) data is used to express a variety of geographic data structures, including:

-   `Point`
-   `LineString`
-   `Polygon`
-   `MultiPoint`
-   `MultiLineString`
-   `MultiPolygon`

A GeoJSON document is simply a JSON document containing three distinct key:value sections:

#### `type`

This is a simple key:value pair. It must be present, and must contain the value `Feature`.

#### `geometry`

This section must contain two fields.

The `type` field holds a GeoJSON object value such as `Point`, `LineString` or `Polygon`.

The `coordinates` field holds an array of latitude and longitude values.

#### `properties`

This section holds any other data you wish to store in the GeoJSON document. It is not required by Cloudant Geo.

<div></div>

> Example GeoJSON document:

```json
{
  "_id": "79f14b64c57461584b152123e38a6449",
  "_rev": "1-e6b5ca2cd8047747ca07cf36d290a4c8",
  "geometry": {
    "coordinates": [
  -71.13687953,
  42.34690635
    ],
    "type": "Point"
  },
  "properties": {
    "compnos": "142035014",
    "domestic": false,
    "fromdate": 1412209800000,
    "main_crimecode": "MedAssist",
    "naturecode": "EDP",
    "reptdistrict": "D14",
    "shooting": false,
    "source": "boston"
  },
  "type": "Feature"
}
```

More information about GeoJSON, including the full specification, is available at <http://geojson.org/>.

### Creating a Cloudant Geo Index

To make it easier to work with Cloudant Geo documents, it is best practice to create a separate design document, specifically for Cloudant Geo. For example, you could create a design document with the `_id` value `"_design/geodd"`.

Within that design document, you create an object called `st_indexes` to hold one or more Cloudant Geo index definitions.

This overview explains how to build and query a Cloudant Geospatial index:<br/>
<iframe width="480" height="270" src="https://www.youtube.com/embed/JqZOcp0pox4" frameborder="0" allowfullscreen title="Building and Querying a Cloudant Geospatial index"></iframe>

#### `geoidx`: An example Cloudant Geo index

> Example Cloudant Geo design document, containing an index:

```json
{
  "_id": "_design/geodd",
  "views": {},
  "language": "javascript",
  "st_indexes": {
    "geoidx": {
  "index": "function(doc)
  {
      if (doc.geometry && doc.geometry.coordinates) {
        st_index(doc.geometry);
      }
    }"
    }
  }
}
```

For example, you might create a Cloudant Geo design document containing an index called `geoidx`. The index is a simple Javascript function that checks for the presence of a valid geometry object in the document, and if found ensures that the document is included in the `st_index` Cloudant Geo index.

### Geospatial indexing

There are a number of different algorithms for indexing geospatial data. Some are simple to understand and implement, but are not fast at producing results.

The algorithm used by Cloudant Geo is [R\*\_tree](http://en.wikipedia.org/wiki/R*_tree). Although it has a slightly higher resource requirement for building the index, the resulting index offers much better performance in responding to queries.

### Querying a Cloudant Geo index

> The basic format for a Cloudant Geo API call:

```
/<database>/_design/<name>/_geo/<geoindexname>?<query-parameters>
```

The fundamental API call for utilizing Cloudant Geo has a simple format.

The valid `<query-parameters>` are as follows:

<table>
<colgroup>
<col width="18%" />
<col width="81%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Parameter</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>bookmark</code></td>
<td align="left">Allows you to page through the results. The default is 25 results.</td>
</tr>
<tr class="even">
<td align="left"><code>ellipse</code></td>
<td align="left">Specify a latitude, a longitude, and two radii: <code>rangex</code> and <code>rangey</code>. The distance is measured in meters.</td>
</tr>
<tr class="odd">
<td align="left"><code>format=geojson</code></td>
<td align="left">Causes the output of the query to be in <a href="http://geojson.org/geojson-spec.html">GeoJSON format</a>. If this parameter is omitted, the default format is standard Cloudant output.</td>
</tr>
<tr class="even">
<td align="left"><code>g</code></td>
<td align="left">Specify a geometry value <code>g</code>. Requires a geometric relationship <code>relation</code>.</td>
</tr>
<tr class="odd">
<td align="left"><code>include_docs</code></td>
<td align="left">Add the entire document as a document object, and include it in the output results.</td>
</tr>
<tr class="even">
<td align="left"><code>limit</code></td>
<td align="left">An integer to limit the number of results returned. The default is 100. The maximum is 200. A value larger than 200 is an error.</td>
</tr>
<tr class="odd">
<td align="left"><code>radius</code></td>
<td align="left">Specify a latitude, a longitude, and a radius. The distance is measured in meters.</td>
</tr>
<tr class="even">
<td align="left"><code>relation</code></td>
<td align="left">Specify a geometric relationship. Used in conjunction with <code>ellipse</code>, <code>g</code>, or <code>radius</code> parameters.</td>
</tr>
<tr class="odd">
<td align="left"><code>stale=ok</code></td>
<td align="left">Speed up responses by not waiting for index building or update to complete.</td>
</tr>
</tbody>
</table>

### Geospatial relationships

Cloudant Geo works with geospatial relationships. These define the different ways in which two geospatial objects are connected with each other, if indeed they are connected at all. For example, if you and a colleague live in different towns, there is no geospatial connection. However, if you live on different streets within the same town, then at the town level there is a connection, but not at the street level.

Cloudant Geo supports the following standard geospatial relationships, applied to two distinct geospatial objects A and B:

<table>
<colgroup>
<col width="16%" />
<col width="83%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Relation</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>bbox A envelope</code></td>
<td align="left">True if the geometry of A is entirely within the envelope specified in the relation.</td>
</tr>
<tr class="even">
<td align="left"><code>A contains B</code></td>
<td align="left">True if the geometry of B is entirely within the geometry of A.</td>
</tr>
<tr class="odd">
<td align="left"><code>A crosses B</code></td>
<td align="left"><dl>
<dt>True if:</dt>
<dd><ul>
<li>The intersection of the two geometries is a value with dimensions within that of the two geometries, <em>and</em></li>
<li>The maximum dimension of the intersection value includes points that are within both the geometries, <em>and</em></li>
<li>The intersection value is not equal to either of the two geometries.</li>
</ul>
</dd>
</dl></td>
</tr>
<tr class="even">
<td align="left"><code>A disjoint B</code></td>
<td align="left">True if the two geometries do not touch or intersect.</td>
</tr>
<tr class="odd">
<td align="left"><code>A equals B</code></td>
<td align="left">True if the two geometries are the same.</td>
</tr>
<tr class="even">
<td align="left"><code>A intersects B</code></td>
<td align="left">True if the two geometries intersect.</td>
</tr>
<tr class="odd">
<td align="left"><code>A overlaps B</code></td>
<td align="left"><dl>
<dt>True if:</dt>
<dd><ul>
<li>The two geometries have some, but not all, points in common, <em>and</em></li>
<li>The points in common form the same kind of shape as A and B, for example a polygon.</li>
</ul>
</dd>
</dl></td>
</tr>
<tr class="even">
<td align="left"><code>A touches B</code></td>
<td align="left">True if and only if the common points of the two geometries are found only at the boundaries of the geometries.</td>
</tr>
<tr class="odd">
<td align="left"><code>A within B</code></td>
<td align="left">True if all the points of A lie entirely within the geometry of B.</td>
</tr>
</tbody>
</table>

### Geometries

Cloudant Geo describes geometries using the `g` query parameter. The geometry can be any 'Well Known Text' (WKT) or 'Well Know Binary' (WKB) object. You can then specify the relationship you want to use when querying the documents in your database. For example, you might specify a polygon object that describes a housing district. You could then query your document database for people residing within that district, by requesting all documents where the place of residence is *contained* within the polygon object.

<div></div>

> Example of a `point` object:

```
point(-71.0537124 42.3681995)
```

> Example of a `polygon` object:

```
polygon((-71.0537124 42.3681995 0,-71.054399 42.3675178 0,-71.0522962 42.3667409 0,-71.051631 42.3659324 0,-71.051631 42.3621431 0,-71.0502148 42.3618577 0,-71.0505152 42.3660275 0,-71.0511589 42.3670263 0,-71.0537124 42.3681995 0))
```

There are several standard geometric objects, including:

-   `point`
-   `polygon`
-   `multipoint`
-   `linestring`
-   `multilinestring`
-   `multipolygon`
-   `geometrycollection`
-   `circularstring`
-   `compoundcurve`
-   `curvepolygon`
-   `multicurve`
-   `multisurface`
-   `curve`
-   `surface`
-   `polyhedralsurface`
-   `tin` (Triangulated Irregular Network)
-   `triangle`

### Example: Querying a Cloudant Geo index

<br>This overview shows an example of how Cloudant Geospatial works:</br>
<iframe width="480" height="270" src="https://www.youtube.com/embed/o683QPKFEa4" frameborder="0" allowfullscreen title="Cloudant Geospatial in action"></iframe>

#### Simple circle

> Example query to find documents that have a geospatial position within a circle:

```
https://sampleac.cloudant.com/sampledb/_design/geodd/_geo/geoidx
?radius=10
&lon=-71.07959
&lat=42.3397
&relation=contains
&format=geojson
```

> Example response to the query:

```json
{
  "bookmark": "g2wAAAABaA....  ...lS19_ztq",
  "type": "FeatureCollection",
  "features": [
    {
  "id": "79f14b64c57461584b152123e38a8e8b",
  "geometry": {
    "type": "Point",
    "coordinates": [-71.07958956,42.33967135]
  },
  "properties": {}
    }
  ]
}
```

An example of using Cloudant Geo would be to find documents that are considered to have a geospatial position within a given geographic circle. This might be useful to determine insurance customers who live close to a known flood plain.

To specify the circle, you would provide:

-   Latitude
-   Longitude
-   Circle radius, specified in meters

The query would then compare the geometry of each document in the index with the specified circle. The comparison is performed according the relation you request in the query. So, to find all documents that fall within the circle, you would use the relation `contains`.

<div></div>

#### A polygon query

A more complex example is where you specify a polygon as the geomtric object of interest. A polygon is simply any object defined by a series of connected points, where none of the connections (the lines between the points) cross any of the other connections.

> Example query to find documents that have a geospatial position within a polygon:

```
https://sampleac.cloudant.com/sampledb/_design/geodd/_geo/geoidx
?relation=overlaps
&format=geojson
&g=POLYGON ((-71.0537124 42.3681995 0,-71.054399 42.3675178 0,-71.0522962 42.3667409 0,-71.051631 42.3659324 0,-71.051631 42.3621431 0,-71.0502148 42.3618577 0,-71.0505152 42.3660275 0,-71.0511589 42.3670263 0,-71.0537124 42.3681995 0))
```

> Example response to the query:

``` json
{
  "bookmark": "g2wAAAABaA... ...L5zTjZq",
  "type": "FeatureCollection",
  "features": [
    {
  "id": "79f14b64c57461584b152123e38d6349",
  "geometry": {
    "type": "Point",
    "coordinates": [-71.05107956,42.36510634]
  },
  "properties": {}
    },
    {
  "id": "79f14b64c57461584b152123e3924516",
  "geometry": {
    "type": "Point",
    "coordinates": [-71.05204477,42.36674199]
  },
  "properties": {}
    }
  ]
}
```

As an example, we might provide a polygon description as the geometric object, and then request that the query return details of documents within the database that overlap with the polygon.
