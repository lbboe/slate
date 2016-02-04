## Changing the port number for http communication

 * Edit `/opt/cloudant/etc/local.ini` and add `port = 12345` to the `chttpd` section, e.g.:

```
	[chttpd]
	port = 12345
```

 * Restart cloudant: `sv restart cloudant`

## Changing the port number for node-to-node communication

Assuming the new port number is 9999:

* Open `/opt/cloudant/etc/vm.args` in an editor.

 * Change the `inet_dist_listen_min` and `inet_dist_listen_max` values from:

```
	# Limit the allowable port range for distributed Erlang
    -kernel inet_dist_listen_min 9000
    -kernel inet_dist_listen_max 9000
```
To:
```
	# Limit the allowable port range for distributed Erlang
	-kernel inet_dist_listen_min 9999
	-kernel inet_dist_listen_max 9999
```
Where `9999` should be the same port number as the one specified using the enableports.sh script.

 * Make the above change on every node in the cluster.

 * Restart cloudant local on every node in the cluster `sv restart cloudant` so that cloudant local picks up the change.

# Changing the port number for epmd

Note that when running weatherreport or remsh it will be necessary to set the environment variable `ERL_EPMD_PORT` to the new port number, otherwise those commands will fail.

Assuming the new port number is 4370:

 * Add `export ERL_EPMD_PORT=4370` to `/etc/sv/cloudant/run` (before the last line in the file)

 * Add `export ERL_EPMD_PORT=4370` to `/etc/sv/clouseau/run` (before the last line in the file)

 * Add `export ERL_EPMD_PORT=4370` to `/opt/cloudant/bin/erl_call_cloudant` (before the last line in the file)

 * Edit `/opt/cloudant/etc/clouseau.policy`:

Change:

`  permission java.net.SocketPermission "127.0.0.1:4369", "connect,resolve";

To:

`  permission java.net.SocketPermission "127.0.0.1:4370", "connect,resolve";

 * Apply the above changes to all nodes

 * On each node, stop cloudant, clouseau and epmd:
```
	sv stop cloudant
	sv stop clouseau
	pkill epmd
```

 * On each node, start cloudant and clouseau (epmd is started automatically):
```
	sv start cloudant
	sv start clouseau
```

 * Verify the processes are now using the expected ports:

```
	$ ERL_EPMD_PORT=4370 /opt/cloudant/erts-6.1/bin/epmd -names
	epmd: up and running on port 4370 with data:
	name clouseau at port 52862
	name cloudant at port 9999
```

# Health warnings

I don't think it is possible to make this change without incurring downtime for the entire cluster so it is probably best just to stop cloudant local on all the nodes, then start cloudant local on all the nodes. You could try rebooting cloudant local on each node in sequence but I expect this will result in bad things happening as the nodes would be trying to communicate on different ports until all nodes had picked up the change.

Also, are we supporting these changes or advising the customer the changes are at their own risk? Currently there is no guarantee that we won't overwrite these changes in an upgrade and therefore revert them to the default port numbers (which would probably result in confusion and downtime).
