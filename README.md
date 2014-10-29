redis-imc
===

In-Memory Cache REST API on Redis Database. 


Projects
---

#### List projects

```
GET /_projects
Content-Type: application/json
```

Returns array of projects

```
{
	"type": "result",
	"result":
		[
			"project1",
			"project2",
			...
		]
}
```

#### Add Project

```
PUT /_projects
Content-Type: application/json
```

Request body:

```
{"name": "PROJECT_NAME"}
```
	 
#### Remove Project

```	
DELETE /PROJECT_NAME
Content-Type: application/json
```

Returns _true_ if project was deleted or _false_ if failed to delete

```
{
	"type": "result",
	"result": true|false
}
```

#### Project details. 

```
GET /{project}/_details
Content-Type: application/json
```

Returns number of caches within a project

```
{
	"type": "result",
	"result":
		{
			"caches": 123456
		}
}
```

Returns number of caches in selected project


Caches
---


#### List caches within a project

```
GET /{project}/_caches
Content-Type: application/json
```
	
#### Add cache into a project

```
PUT /{project}/_caches
Content-Type: application/json
```

Request body:

```
{"name": "CACHE_NAME"}
```
	
#### Remove cache from a project

```
DELETE /{project}/{cache}
Content-Type: application/json
```

Returns _true_ if cache was deleted or _false_ if failed to delete

```
{
	"type": "result",
	"result": true|false
}
```
	
#### Cache details. 

```
GET /{project}/{cache}/_details
Content-Type: application/json
```

Returns number of items registered within a cache

```
{
	"type": "result",
	"result":
		{
			"items": number_of_items
		}
}
```
	

Items
---


#### Get an item from a cache

```
GET /{project}/{cache}/{item}
Content-Type: application/json
```

Returns content of the requested item

```
{
	"type": "result",
	"result": "value"
}
```

#### Create an item in a cache

```
PUT /{project}/{cache}/_items
Content-Type: application/json
```
You need to pass JSON object with _name_ of the item, its _value_ and specify _overwrite_ to set a new value to the existing item, so it will overwrite it, otherwise, if _overwrite_ set to _false_ or not present, it will fire an error that item already exists.

Request body:

```
{
	"name": "CACHE_NAME",
	"value": "VALUE"|VALUE
	"overwrite": true|false
}
``` 

Returns true if item was created or false if creation failed

```
{
	"result": true|false
}
```

#### Delete an item from cache

```
DELETE /{project}/{cache}/{item}
Content-Type: application/json
```

Returns true if item was deleted or false if deletion failed or item was not found

```
{
	"result": true|false
}
```

#### Increment item value

```
POST /{project}/{cache}/{item}
Content-Type: application/json
```

Request body:

```
{"increment": 1}
``` 

Returns new value of the item

```
{
	"result": old_value +increment
}
```
