var http = require('http'),
    OAuth = require('./oauth').OAuth,
    URL = require('url'),
	util = require('util');

function ObjectRequestNodeHttp(oauthCredentials) {
    this.oauthCredentials = oauthCredentials;
}

ObjectRequestNodeHttp.prototype.request = function(method, url, body, headers, cb) {
    //
    //  oauth
    //
    var message = {                 
        action: url,
        method: method,
        parameters: body
    };
    
    OAuth.completeRequest(message, this.oauthCredentials); 
    
    var parsedUrl = URL.parse(url);
	// logger.debug("MyDebugLine, parsedURL: " + util.inspect(parsedUrl));
    
    var req = http.request(
        {
            host: parsedUrl.host.replace(':' + parsedUrl.port, ''),
            port: parsedUrl.port,
            method: method,
            path: parsedUrl.path
        }, function(response){
            var res = {}
            res.data = "";
            res.status = response.statusCode;
            
            response.on("data", function(data){
                res.data += data;
            });
            
            response.on("end", function(){
                var err = null;
                
                try {
                    if (res.status == 200) {
                        res.data = JSON.parse(res.data);
                    }
                } catch(e) {
                    err = e;
                }                
                
                cb(err, res);
            });
        });

    req.setHeader('Authorization', OAuth.getAuthorizationHeader(undefined, message.parameters));  
    req.setHeader('content-type', 'application/json');
    
    for (var header in headers) {
        req.setHeader(header, headers[header]);
    }    
    
    if (body != null) {
        req.write(JSON.stringify(body));    
    }
        
    req.end();
};

exports.ObjectRequestNodeHttp = ObjectRequestNodeHttp;
