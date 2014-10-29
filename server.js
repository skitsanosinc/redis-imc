/**
 * redis-imc REST API Server
 * Created by skitsanos on 11/10/2014.
 */

String.prototype.replaceAll = function (f, r)
{
	return this.replace(new RegExp(f, 'g'), r);
};

String.prototype.startsWith = function (str)
{
	return (this.indexOf(str) === 0);
};

var fs = require('fs');
var http = require('http');
var url = require('url');
var redis = require('redis');
var Hashes = require('jshashes');

//routes
var _projectsRoute = require('routes/_projects.js');
var _cachesRoute = require('routes/_caches.js');
var _itemsRoute = require('routes/_items.js');

var dbHost = 'localhost';
var dbServerIsOnline = true;
var pulseClient = redis.createClient(6379, dbHost);

pulseClient.on('error', function (err)
{
	dbServerIsOnline = false;
});

pulseClient.on('ready', function (err)
{
	dbServerIsOnline = true;
});

pulseClient.on('idle', function ()
{
	//dbServerIsOnline = true;
	//console.log('idle');
	//console.log(dbServerIsOnline)
});

setInterval(function ()
{
	pulseClient.ping(function (err, reply)
	{
		dbServerIsOnline = reply == 'PONG';
	});
}, 500);

http.createServer(function (request, response)
{
	var urlParts = url.parse(request.url, true);
	var urlPath = urlParts.pathname.split('/');
	var command = urlPath[1];

	//Application handlers
	var app = {
		title: 'redis-imcache v.1.0.0',

		api: {
			redis: redis.createClient(6379, dbHost)
		},

		io: {
			basedir: function ()
			{
				return __dirname;
			},

			readFile: function (path, options)
			{
				return fs.readFileSync(path);
			},

			fileExists: function (path)
			{
				return fs.existsSync(path);
			},

			fileExtension: function (filename)
			{
				var ext = path.extname(filename || '').split('.');
				return ext[ext.length - 1];
			}
		},

		utils: {
			serveContent: function (path, contentType)
			{
				var body = app.io.readFile(path);
				response.writeHead(200, {
					'Content-Length': body.length,
					'Content-Type': contentType
				});
				response.write(body);
				response.end();
			},

			serveRAW: function (data, contentType)
			{
				response.writeHead(200, {
					'Content-Type': contentType
				});
				response.write(data);
				response.end();
			},

			serveJson: function (type, content)
			{
				app.utils.serveRAW(JSON.stringify({type: type, result: content}), 'application/json');
			},

			serveError: function (code, message)
			{
				response.writeHead(code, {
					'Content-Length': message.length,
					'Content-Type': 'text/html'
				});
				response.write(message);
				response.end();
			},

			getRandomPassword: function (length)
			{
				var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
				var pass = '';
				for (var i = 0; i < length; ++i)
				{
					var x = Math.floor(Math.random() * 62);
					pass += chars.charAt(x);
				}
				return pass;
			},

			isValidContentType: function ()
			{
				return !(request.headers['content-type'] != undefined && !(request.headers['content-type'].startsWith('application/json')));
			},

			parseRequestBody: function (callback)
			{
				var requestBody = '';
				request.addListener('data', function (chunk)
				{
					requestBody += chunk;
					//kill all requests bigger than 1Kb
					if (requestBody.length > 1024)
					{
						// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
						request.connection.destroy();
					}
				});

				request.on('end', function ()
				{
					try
					{
						callback(requestBody);
					}
					catch (e)
					{
						app.utils.serveJson('error', e.message);
					}
				});
			},

			parseJSON: function (d)
			{
				try
				{
					return JSON.parse(d);
				}
				catch (ex)
				{
					return null;
				}
			}
		}
	};

	app.api.redis.on('error', function (err)
	{
		dbServerIsOnline = false;
	});

	//Request processing
	if (dbServerIsOnline)
	{
		console.log(urlParts.path);
		console.log(urlPath);

		var projectId = urlPath[1];
		var cacheId = urlPath[2];
		var itemId = urlPath[3];

		switch (command)
		{
			case 'crossdomain.xml':
				//app.utils.serveContent('crossdomain.xml', 'text/x-cross-domain-policy');
				break;

			default:
				//projects handling
				console.log(urlPath.length);
				switch (urlPath.length)
				{
					case 2: //service end-points handling
						if (urlParts.path == '/')
						{
							app.utils.serveJson('info', app.title);
						}
						else
						{
							new _projectsRoute(request, response, app);
						}
						break;

					case 3: //handling {project}/{cache|method}
						new _cachesRoute(request, response, app);
						break;

					case 4: //handling {project}/{cache}/{item}
						new _itemsRoute(request, response, app);
						break;

					default:
						app.utils.serveJson('info', app.title);
						break;
				}
				break;
		}
	}
	else
	{
		app.utils.serveJson('error', 'Database Server is offline');
	}

}).listen(process.env.PORT || process.env.VMC_APP_PORT || 1338, null);
