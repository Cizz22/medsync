
# MedsyncStreamConfiguration

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**syncMode** | [**SyncMode**](SyncMode.md) |  | 
**destinationSyncMode** | [**DestinationSyncMode**](DestinationSyncMode.md) |  | 
**cursorField** | **kotlin.collections.List&lt;kotlin.String&gt;** | Path to the field that will be used to determine if a record is new or modified since the last sync. This field is REQUIRED if &#x60;sync_mode&#x60; is &#x60;incremental&#x60;. Otherwise it is ignored. |  [optional]
**primaryKey** | **kotlin.collections.List&lt;kotlin.collections.List&lt;kotlin.String&gt;&gt;** | Paths to the fields that will be used as primary key. This field is REQUIRED if &#x60;destination_sync_mode&#x60; is &#x60;*_dedup&#x60;. Otherwise it is ignored. |  [optional]
**aliasName** | **kotlin.String** | Alias name to the stream to be used in the destination |  [optional]
**selected** | **kotlin.Boolean** | If this is true, the stream is selected with all of its properties. For new connections, this considers if the stream is suggested or not |  [optional]
**suggested** | **kotlin.Boolean** | Does the connector suggest that this stream be enabled by default? |  [optional]
**fieldSelectionEnabled** | **kotlin.Boolean** | Whether field selection should be enabled. If this is true, only the properties in &#x60;selectedFields&#x60; will be included. |  [optional]
**selectedFields** | [**kotlin.collections.List&lt;SelectedFieldInfo&gt;**](SelectedFieldInfo.md) | Paths to the fields that will be included in the configured catalog. This must be set if &#x60;fieldSelectedEnabled&#x60; is set. An empty list indicates that no properties will be included. |  [optional]



