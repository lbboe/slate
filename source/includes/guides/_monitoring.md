## Monitoring a Cloudant cluster

A key part of ensuring best performance,
or troubleshooting any problems,
is monitoring the affected system.
You want to be able to answer the question:
"In what way has the system behavior changed as a result of any configuration or application modifications?"
To answer the question,
you need data.
The data comes from monitoring the system.

Monitoring the system while it replicates can be performed using the `_active_tasks` endpoint,
which is described in more detail [here](managing_tasks.html).

For more detailed system information,
you make use of the cluster monitoring API,
"knockwurst".

### Monitoring metrics overview

When monitoring the cluster,
you can obtain data about how it is performing.
Details such as the number of HTTP requests processed per second,
or how many documents are processed per second,
can all be obtained through the monitoring API.

The API can be invoked only by an administrative user,
and is applied to a specific monitoring endpoint.
For example,
if you wanted to monitor the number of documents processed by a map function each second,
you would direct the request to the `map_doc` endpoint.
A full list of the available endpoints is [available](monitoring.html#monitoring-endpoints).

The data returned is provided in JSON format by default.
You can specify a `raw` format if you prefer.

### Syntax of the monitoring request

All requests to the monitoring API have the following form:

`curl -u [ADMIN_USER] https://[ADMIN USER].cloudant.com/_api/v2/monitoring/[END_POINT]?cluster=[CLUSTER][&format=(json|raw)]`

The fields are described in the following table:

Field | Meaning
------|--------
`ADMIN_USER` | The account name. Must have administrative privileges.
`END_POINT` | The [aspect](monitoring.html#monitoring_endpoints) of the cluster you want to monitor.
`CLUSTER` | The cluster you are interested in.

#### Results format

By default,
the monitoring results are returned in `JSON` format.
If you prefer,
you can choose to receive the results in `raw` format.

The results include a text string that identifies the metric stored on the server providing the API capability,
for example `sumSeries(net.cloudant.mycustomer001.db*.df.srv.used)`.

The information in the results consists of cluster-level data from the last five minutes,
recorded at 15 second intervals. 

<div></div>

#### With `format=json` (default)

> Example monitoring request for disk use data returned in `JSON` format:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/disk_use?cluster=myclustername&format=json
```

> Example result after requesting disk use data in `JSON` format:

```json
[
	{
		"target": "sumSeries(net.cloudant.mycustomer001.db*.df.srv.used)",
		"datapoints": [
			[523562172416.0, 1391019360],
			[524413976576.0, 1391019420],
			[519036682240.0, 1391019480],
			[518762102784.0, 1391019540],
			[523719393280.0, 1391019600]
		]
	},
	{
		"target": "sumSeries(net.cloudant.mycustomer001.db*.df.srv.free)",
		"datapoints": [
			[6488926978048.0, 1391019360],
			[6487768301568.0, 1391019420],
			[6493145661440.0, 1391019480],
			[6493420257280.0, 1391019540],
			[4330660167680.0, 1391019600]
		]
	}
]
```

Unless you specify otherwise,
the metric data returned is in JSON format.
Each value returned consists of [datapoint, timestamp] values.

<div></div>

#### With `format=raw`

> Example monitoring request for disk use data returned in `raw` format:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/disk_use?cluster=myclustername&format=raw
```

> Example result after requesting disk use data in `raw` format:

```
sumSeries(net.cloudant.mycustomer001.db*.df.srv.used),1391019780,1391020080,60|344708448256.0,345318227968.0,346120126464.0,346716471296.0,175483256832.0
sumSeries(net.cloudant.mycustomer001.db*.df.srv.free),1391019780,1391020080,60|6.49070326579e+12,6.4896982057e+12,6.48884414054e+12,6.48801589658e+12,4.32277107507e+12
```

The text string (for example `sumSeries(net.cloudant.mycustomer001.db*.df.srv.used)`) is the name of the metric.
The next two numbers are the start and end times,
expressed as UTC epoch seconds.
The final number is the step size in seconds.

The numbers after the `|` character contain the metric data obtained from your chosen end point.
For example,
requesting metric data from the disk use end point returns the output from a `df` command,
with the disk use expressed as bytes stored.

### Monitoring endpoints

> Obtaining a list of the currently supported monitoring end points:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring
```

> Example response, listing the available monitoring end points:

```json
{
	"targets": [
		"rps",
		"kv_emits",
		"rate/status_code",
		"rate/verb",
		"disk_use",
		"node_peak_cpu",
		"run_queue",
		"uptime",
		"map_doc_v2",
		"memory",
		"node_disk_free_srv",
		"map_doc",
		"smoosh_channels/slack_dbs",
		"smoosh_channels/upgrade_dbs",
		"smoosh_channels/ratio_dbs",
		"smoosh_channels/ratio_views",
		"smoosh_channels/slack_views",
		"smoosh_channels/upgrade_views",
		"wps",
		"rps_v2",
		"rate_v2/status_code",
		"rate_v2/verb",
		"os_proc_count",
		"response_time",
		"wps_v2",
		"kv_emits_v2",
		"disk_use_v2",
		"response_time_v2",
		"node_disk_use_srv",
		"process_count"
	]
}
```

To list all of the currently supported monitoring end points,
make a request to the `monitoring` endpoint.

The following table lists the supported monitoring endpoints provided by the API:

Endpoint | Description
---------|------------
`disk_use` | The disk use, as measured by a `df` command.
`kv_emits` | The number of `key:value` emits per second.
`map_doc` | The number of documents processed by a map function, per second.
`rate/status_code` | The rate of requests, grouped by status code.
`rate/verb` | The rate of requests, grouped by HTTP verb.
`response_time` | The average response time to a request, measured in ms.
`rps` | The number of reads per second.
`wps` | The number of writes per second.

### Examples of monitoring requests

<div></div>

#### disk_use

> Example of a `disk_use` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/disk_use?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `disk_use` monitoring request:

```json
{
  "start": 1435935759,
  "end": 1435936059,
  "target_responses": [
    {
      "target": "myclustername Used disk space (bytes)",
      "datapoints": [
        [
          6855438336.0,
          1435935780
        ],
        [
          null,
          1435935795
        ],
        [
          null,
          1435935810
        ],
...
        [
          null,
          1435936065
        ]
      ]
    },
    {
      "target": "myclustername Free disk space (bytes)",
      "datapoints": [
        [
          7141069422592.0,
          1435935780
        ],
        [
          null,
          1435935795
        ],
        [
          null,
          1435935810
        ],
...
        [
          null,
          1435936065
        ]
      ]
    }
  ],
  "granularity": "15sec"
}
```

<div></div>

#### kv_emits

> Example of a `kv_emits` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/kv_emits?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `kv_emits` monitoring request:

```json
{
  "start": 1436194248,
  "end": 1436194548,
  "target_responses": [
    {
      "target": "myclustername Key:value pairs emitted per second from map functions",
      "datapoints": [
        [
          0.0,
          1436194230
        ],
        [
          0.0,
          1436194245
        ],
        [
          0.8000000000001819,
          1436194260
        ],
...
        [
          null,
          1436194515
        ]
      ]
    }
  ],
  "granularity": "15sec"
}
```

<div></div>

#### map_doc

> Example of a `map_doc` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/map_doc?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `map_doc` monitoring request:

```json
{
  "start": 1436194475,
  "end": 1436194775,
  "target_responses": [
    {
      "target": "myclustername Documents per second through map functions",
      "datapoints": [
        [
          0.0,
          1436194480
        ],
        [
          0.5,
          1436194495
        ],
        [
          0.4000000000005457,
          1436194510
        ],
...
        [
          0.0,
          1436194765
        ]
      ]
    }
  ],
  "granularity": "15sec"
}
```

<div></div>

#### rate/status_code

> Example of a `rate/status_code` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/rate/status_code?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `rate/status_code` monitoring request:

```json
{
  "start": 1436194902,
  "end": 1436195202,
  "target_responses": [
    {
      "target": "myclustername 2xx",
      "datapoints": [
        [
          null,
          1436194910
        ],
        [
          36.0,
          1436194920
        ],
...
        [
          0.0,
          1436195200
        ]
      ]
    },
    {
      "target": "myclustername 3xx",
      "datapoints": [
        [
          null,
          1436194910
        ],
        [
          0.0,
          1436194920
        ],
...
        [
          null,
          1436195200
        ]
      ]
    },
    {
      "target": "myclustername 4xx",
      "datapoints": [
        [
          null,
          1436194910
        ],
        [
          0.0,
          1436194920
        ],
...
        [
          0.0,
          1436195200
        ]
      ]
    },
    {
      "target": "myclustername 5xx",
      "datapoints": [
        [
          null,
          1436194910
        ],
        [
          0.0,
          1436194920
        ],
...
        [
          null,
          1436195200
        ]
      ]
    }
  ],
  "granularity": "15sec"
}
```

<div></div>

#### rate/verb

> Example of a `rate/verb` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/rate/verb?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `rate/verb` monitoring request:

```json
{
  "start": 1436195497, 
  "end": 1436195797, 
  "target_responses": [
    {
      "target": "myclustername GET", 
      "datapoints": [
        [
          null, 
          1436195500
        ], 
        [
          36.0, 
          1436195510
        ], 
...
        [
          49.5, 
          1436195790
        ]
      ]
    }, 
    {
      "target": "myclustername POST", 
      "datapoints": [
        [
          null, 
          1436195500
        ], 
        [
          0.0, 
          1436195510
        ], 
...
        [
          0.0, 
          1436195790
        ]
      ]
    }, 
    {
      "target": "myclustername PUT", 
      "datapoints": [
        [
          null, 
          1436195500
        ], 
        [
          0.0, 
          1436195510
        ], 
...
        [
          0.0, 
          1436195790
        ]
      ]
    }, 
    {
      "target": "myclustername DELETE", 
      "datapoints": [
        [
          null, 
          1436195500
        ], 
        [
          0.0, 
          1436195510
        ], 
...
        [
          0.0, 
          1436195790
        ]
      ]
    }, 
    {
      "target": "myclustername COPY", 
      "datapoints": [
        [
          null, 
          1436195500
        ], 
        [
          0.0, 
          1436195510
        ], 
...
        [
          0.0, 
          1436195790
        ]
      ]
    }, 
    {
      "target": "myclustername HEAD", 
      "datapoints": [
        [
          null, 
          1436195500
        ], 
        [
          0.0,  +$
          1436195510
        ], 
...
        [
          0.0, 
          1436195790
        ]
      ]
    }
  ], 
  "granularity": "15sec"
}
```

<div></div>

#### response_time

> Example of a `response_time` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/response_time?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `response_time` monitoring request:

```json
{
  "start": 1436195645,
  "end": 1436195945,
  "target_responses": [],
  "granularity": "15sec"
}
```

<div></div>

#### rps

> Example of an `rps` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/rps?cluster=myclustername&format=json
```

> Example results (abbreviated) from an `rps` monitoring request:

```json
{
  "start": 1436195908,
  "end": 1436196208,
  "target_responses": [
    {
      "target": "myclustername Document Reads Per Second",
      "datapoints": [
        [
          0.20000000001164153,
          1436195910
        ],
        [
          0.10000000000582077,
          1436195925
        ],
...
        [
          null,
          1436196195
        ]
      ]
    }
  ],
  "granularity": "15sec"
}
```

<div></div>

#### wps

> Example of a `wps` monitoring request:

```
curl -u myusername https://myusername.cloudant.com/_api/v2/monitoring/wps?cluster=myclustername&format=json
```

> Example results (abbreviated) from a `wps` monitoring request:

```json
{
  "start": 1436195999,
  "end": 1436196299,
  "target_responses": [
    {
      "target": "myclustername Document Writes Per Second",
      "datapoints": [
        [
          1.2999999999992724,
          1436196000
        ],
        [
          0.5,
          1436196015
        ],
...
        [
          null,
          1436196285
        ]
      ]
    }
  ],
  "granularity": "15sec"
}
```

