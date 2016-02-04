## Attachments

If you want to store data, use attachments.
Attachments are Binary Large Object ([BLOb](http://en.wikipedia.org/wiki/Binary_large_object)) files contained within documents.
The BLOb is stored in the `_attachments` component of the document.
The BLOb includes data about the attachment name, the type of the attachment, and the actual content represented in BASE64 form.
Examples of BLObs would be images and multimedia.

The content type corresponds to a [MIME type][mime].
For example, if you want to attach a `.jpg` image file to a document,
you specify the attachment MIME type as `image/jpeg`.


<aside class="warning">As a best practice, keep attachments small in size and number because attachments can impact performance.</aside>

### Create / Update

> Example instruction for creating or updating an attachment:

```http
PUT /$DATABASE/$DOCUMENT_ID/$ATTACHMENT?rev=$REV HTTP/1.1
Content-Type: $$ATTACHMENT_MIME_TYPE
```

```shell
curl https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID/$ATTACHMENT?rev=$REV \
     -X PUT \
     -H "Content-Type: $ATTACHMENT_MIME_TYPE" \
     --data-binary @$ATTACHMENT_FILEPATH
```

```javascript
var nano = require('nano');
var fs = require('fs');
var account = nano("https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com");
var db = account.use($DATABASE);

fs.readFile($FILEPATH, function (err, data) {
  if (!err) {
    db.attachment.insert($DOCUMENT_ID, $ATTACHMENT, data, $ATTACHMENT_MIME_TYPE, {
      rev: $REV
    }, function (err, body) {
      if (!err)
        console.log(body);
    });
  }
});
```

To create a new attachment at the same time as creating a new document,
include the attachment as an '[inline](#inline)' component of the JSON content.

To create a new attachment on an existing document,
or to update an attachment on a document,
make a PUT request with the document's latest `_rev` to `https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID/$ATTACHMENT`.
The attachment's [content type][mime] must be specified using the `Content-Type` header.
The `$ATTACHMENT` value is the name by which the attachment is associated with the document.

<aside>You can create more than one attachment for a document;
simply ensure that the `$ATTACHMENT` value for each attachment is unique within the document.</aside>

<div></div>

> Example response:

```json
{
  "id" : "FishStew",
  "ok" : true,
  "rev" : "9-247bb19a41bfd9bfdaf5ee6e2e05be74"
}
```

The response contains the document ID and the new document revision. Note that attachments do not have their own revisions. Instead, updating or creating an attachment changes the revision of the document it is attached to.

### Read

> Example instruction for reading an attachment:

```http
GET /$DATABASE/$DOCUMENT_ID/$ATTACHMENT HTTP/1.1
```

```shell
curl https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID/$ATTACHMENT \
     -u $USERNAME >blob_content.dat
# store the response content into a file for further processing.
```

```javascript
var nano = require('nano');
var account = nano("https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com");
var db = account.use($DATABASE);

db.attachment.get($DOCUMENT_ID, $FILENAME, function (err, body) {
  if (!err) {
    console.log(body);
  }
});
```

To retrieve an attachment,
make a GET request to `https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID/$ATTACHMENT`.
The body of the response is the raw content of the attachment.

### Delete

> Example instruction for deleting an attachment:

```http
DELETE /$DATABASE/$DOCUMENT_ID/$ATTACHMENT?rev=$REV HTTP/1.1
```

```shell
curl https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID/$ATTACHMENT?rev=$REV \
     -u $USERNAME \
     -X DELETE
```

```javascript
var nano = require('nano');
var account = nano("https://$USERNAME:$PASSWORD@$USERNAME.cloudant.com");
var db = account.use($DATABASE);

db.attachment.destroy($DOCUMENT_ID, $FILENAME, $REV, function (err, body) {
  if (!err) {
    console.log(body);
  }
});
```

To delete an attachment, make a DELETE request with the document's latest `_rev` to `https://$USERNAME.cloudant.com/$DATABASE/$DOCUMENT_ID/$ATTACHMENT`.
If you do not supply the latest `_rev`,
the response is a [409 error](basics.html#http-status-codes).

<div></div>

> Example response:

```json
{
  "ok": true,
  "id": "DocID",
  "rev": "3-aedfb06537c1d77a087eb295571f7fc9"
}
```

If the deletion is successful, the response contains `"ok": true`, and the ID and new revision of the document.

### Inline

> Example JSON content that includes an inline attachment of a jpeg image:

```json
{
  "_id":"document_with_attachment",
  "_attachments":
  {
    "name_of_attachment":
    {
      "content_type":"image/jpeg",
      "data": "iVBORw0KGgoAA... ...AASUVORK5CYII="
    }
  }
}
```

Inline attachments are attachments included as part of the JSON content.

[mime]: http://en.wikipedia.org/wiki/Internet_media_type#List_of_common_media_types
