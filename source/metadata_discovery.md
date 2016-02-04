---
title: Cloudant Documentation - Metadata Discovery

language_tabs:
  - http 
  - shell: curl
#  - javascript: node.js
#  - python

toc_footers:
  - <a href="https://cloudant.com/">Cloudant</a>
  - <a href="https://cloudant.com/sign-up/">Sign up</a> / <a href="https://cloudant.com/sign-in/">Sign in</a>
  - <a href="http://stackoverflow.com/questions/tagged/cloudant">Cloudant on StackOverflow</a>
  - <a href='http://github.com/tripit/slate'>Documentation Powered by Slate</a>
  - <a href="https://github.com/cloudant-labs/slate">Documentation Source</a>

includes:
 
---

## Metadata Discovery

Metadata indexes allow you to learn about schemas of JSON documents in a database. It describes what kind of documents are present in a database as a collection of document fields with data types and frequencies. 

### Creating a metadata index

#### Create filter functions

> Filter function to index all documents in a database

```
function(doc) {
 	return true;
}
```

> Filter function to index only documents where the value of the diet field is 'omnivore'.

```
function(doc) {
 	return doc.diet == 'omnivore';
}
```

To create an index, you supply a filter function, which is used to decide which documents to add to the index and which documents to ignore. To do that, the function takes a document as an argument and return true, if the document should be included in the index and false otherwise.

<div> </div> 

#### Save the filter functions in a design document

> Adding a design document with filter functions

```shell
curl -X PUT "https://$ACCOUNT.cloudant.com/$DATABASE/_design/metadata" -H 'Content-Type: application/json' -d '@filter.json'
# where filter.json contains the following document:
```

```http
PUT /$DATABASE/_design/metadata HTTP/1.1
Host: $ACCOUNT.cloudant.com
Content-Type: application/json

```

```json
{
  "_id":"_design/metadata",
  "schemas": {
    "allAnimals": {
      "filter":"function(doc) { return true; }"
    },
    "omnivores": {
      "filter":"function(doc) { return doc.diet == 'omnivore'; }"
    }
  }
}
```

Once you have written the filter function, you store them in a design document. The design document contains a `schema` field where each field defines a schema with a `filter` field for the filter function.

### Querying an index

> Querying the allAnimals index

```shell
curl -X GET "https://examples.cloudant.com/animaldb/_design/metadata/_schema/allAnimals"
```

```http
GET /animaldb/_design/metadata/_schema/allAnimals HTTP/1.1
HOST examples.cloudant.com
```

> Querying the omnivores index

```shell
curl -X GET "https://examples.cloudant.com/animaldb/_design/metadata/_schema/omnivores"
```

```http
GET /animaldb/_design/metadata/_schema/omnivores HTTP/1.1
HOST examples.cloudant.com
```

When the filter function is in place, any document that meets the filter criteria is added to the index. A modified document changes the index immediately and a deleted document is removed from the index.

To query the index, you make a `GET` request to `/$DATABASE/$DESIGNDOC/_schema/$SCHEMANAME?schema=all`, inserting the names of the database, the design document, and the schema to query. Optionally, you can add the `schema` query parameter to control the output format.

<div> </div>

#### The `schema` parameter

> Querying the allAnimals index with `schema=all`

```shell
curl -X GET "https://examples.cloudant.com/animaldb/_design/metadata/_schema/allAnimals?schema=all"
```

```http
GET /animaldb/_design/metadata/_schema/allAnimals?schema=all HTTP/1.1
HOST examples.cloudant.com
```

> Querying the allAnimals index with `schema=union`

```shell
curl -X GET "https://examples.cloudant.com/animaldb/_design/metadata/_schema/allAnimals?schema=union"
```

```http
GET /animaldb/_design/metadata/_schema/allAnimals?schema=union HTTP/1.1
HOST examples.cloudant.com
```

The `schema` parameter controls how detailed the output will be.

 - `all` (default): returns an array of objects, where each object represents a distinct schema.
 - `union`: returns a single object that combines multiple schemas into a union output by adding them together. For example `curl -X GET https://examples.cloudant.com/animaldb/_design/metadata/_schema/omnivores?schema=union`

### Schema variation

Before we describe the output we want to discuss the issue of schema variation. In general, schema variation exists if any two documents have a different set of attributes. There are two types of schema variation:

1. Global: Different documents implement different schemas (e.g. `{'product': ...}` and `{'customer': ...}`). The query parameter `schema` can be used to either merge the different schemas into one (using `?schema=union`) or list all schemas individually (using `?schema=all`).
2. Local: Different data types are used for values in the same attribute (e.g. `'age': 30` vs. `'age': 'unknown'`). Here the index lists all used data types for the attribute values together with the frequency (how many values have this data type)

### Index output

The elements contained in the schema index are:

 * `object` an array of schemas returned by the index 

   * `__attributes` a set of named attributes contained in a schema
   * `__type` a known attribute value data type (String, Float, Integer, Boolean) or userdefined for a complex attribute or an unknown attribute data type 
   * `__freq` the number of times we count attribute values with this type
   * `__length` the maximum value length (applies only to String attributes)
   * `__repeated` equals true if the attribute is a JSON array, false otherwise

#### Output with `schema=union`

```json
    [
    {
        "object": [
            {
                "__type": "userdefined",
                "__freq": 4,
                "__attributes": {
                    "diet": [
                        {
                            "__type": "String",
                            "__freq": 4,
                            "__length": 8,
                            "__repeated": false
                        }
                    ],
                    "class": [
                        {
                            "__type": "String",
                            "__freq": 4,
                            "__length": 6,
                            "__repeated": false
                        }
                    ],
                    "wiki_page": [
                        {
                            "__type": "String",
                            "__freq": 4,
                            "__length": 46,
                            "__repeated": false
                        }
                    ],
                    "latin_name": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 19,
                            "__repeated": false
                        }
                    ],
                    "max_length": [
                        {
                            "__type": "Float",
                            "__freq": 4,
                            "__repeated": false
                        }
                    ],
                    "min_length": [
                        {
                            "__type": "Float",
                            "__freq": 3,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 1,
                            "__repeated": false
                        }
                    ],
                    "max_weight": [
                        {
                            "__type": "Float",
                            "__freq": 2,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 2,
                            "__repeated": false
                        }
                    ],
                    "min_weight": [
                        {
                            "__type": "Float",
                            "__freq": 2,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 2,
                            "__repeated": false
                        }
                    ],
                    "_rev": [
                        {
                            "__type": "String",
                            "__freq": 4,
                            "__length": 34,
                            "__repeated": false
                        }
                    ],
                    "_id": [
                        {
                            "__type": "String",
                            "__freq": 4,
                            "__length": 8,
                            "__repeated": false
                        }
                    ]
                },
                "__repeated": false
            }
        ]
    }
	]
```

This response is produced by querying the index with `?schema=union`. 

<div> </div>

#### Output with `schema=all`

```json
    [
    {
        "object": [
            {
                "__type": "userdefined",
                "__freq": 1,
                "__attributes": {
                    "_id": [
                        {
                            "__type": "String",
                            "__freq": 1,
                            "__length": 8,
                            "__repeated": false
                        }
                    ],
                    "_rev": [
                        {
                            "__type": "String",
                            "__freq": 1,
                            "__length": 34,
                            "__repeated": false
                        }
                    ],
                    "wiki_page": [
                        {
                            "__type": "String",
                            "__freq": 1,
                            "__length": 46,
                            "__repeated": false
                        }
                    ],
                    "min_weight": [
                        {
                            "__type": "Float",
                            "__freq": 1,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 1,
                            "__repeated": false
                        }
                    ],
                    "max_weight": [
                        {
                            "__type": "Float",
                            "__freq": 1,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 1,
                            "__repeated": false
                        }
                    ],
                    "min_length": [
                        {
                            "__type": "Float",
                            "__freq": 1,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 0,
                            "__repeated": false
                        }
                    ],
                    "max_length": [
                        {
                            "__type": "Float",
                            "__freq": 1,
                            "__repeated": false
                        }
                    ],
                    "class": [
                        {
                            "__type": "String",
                            "__freq": 1,
                            "__length": 6,
                            "__repeated": false
                        }
                    ],
                    "diet": [
                        {
                            "__type": "String",
                            "__freq": 1,
                            "__length": 8,
                            "__repeated": false
                        }
                    ]
                },
                "__repeated": false
            }
        ]
    },
    {
        "object": [
            {
                "__type": "userdefined",
                "__freq": 3,
                "__attributes": {
                    "_id": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 8,
                            "__repeated": false
                        }
                    ],
                    "_rev": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 34,
                            "__repeated": false
                        }
                    ],
                    "wiki_page": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 46,
                            "__repeated": false
                        }
                    ],
                    "min_weight": [
                        {
                            "__type": "Float",
                            "__freq": 2,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 2,
                            "__repeated": false
                        }
                    ],
                    "max_weight": [
                        {
                            "__type": "Float",
                            "__freq": 2,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 2,
                            "__repeated": false
                        }
                    ],
                    "min_length": [
                        {
                            "__type": "Float",
                            "__freq": 2,
                            "__repeated": false
                        },
                        {
                            "__type": "Integer",
                            "__freq": 1,
                            "__repeated": false
                        }
                    ],
                    "max_length": [
                        {
                            "__type": "Float",
                            "__freq": 3,
                            "__repeated": false
                        }
                    ],
                    "latin_name": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 19,
                            "__repeated": false
                        }
                    ],
                    "class": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 6,
                            "__repeated": false
                        }
                    ],
                    "diet": [
                        {
                            "__type": "String",
                            "__freq": 3,
                            "__length": 8,
                            "__repeated": false
                        }
                    ]
                },
                "__repeated": false
            }
        ]
    }
	]
```

This response is produced by querying the index with `?schema=all`. 

