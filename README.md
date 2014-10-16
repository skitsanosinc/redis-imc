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
[
	"project1",
	"project2",
	...
]
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
DELETE /_projects
Content-Type: application/json
```

Request body:

```
{"name": "PROJECT_NAME"}
```

Caches
---

http://hostname/{_project_}/_caches

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
DELETE /{project}/_caches
Content-Type: application/json

BODY:
{"name": "CACHE_NAME"}
```
	
#### Cache details. 

```
GET /{project}/{cache}/_details
Content-Type: application/json
```
Returns

```
[
	{
		"cache_name": {"size": 123456}
	}
]
```
	

Items
---

http://hostname/{_project_}/{_cache_}/_items

#### Get an item from a cache

```
GET /{project}/{cache}/{item}
Content-Type: application/json
```

Returns

```
{
	"data": "value",
}
```

#### Create an item in a cache

```
PUT /{project}/{cache}
Content-Type: application/json
```

Request body:

```
{
	"name": "CACHE_NAME",
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
DELETE /{project}/_caches
Content-Type: application/json
```

Request body:

```
{"name": "ITEM_NAME"}
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
{"value": 1}
``` 

Returns new value of the item

```json
{
	"result": old_value +increment
}
```
