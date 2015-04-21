/* global SockJS, scrollback, uid, assert, FB */
/* jshint mocha: true */

describe("Action: INIT:", function(){
	var socket;
	beforeEach(function(done){
		socket = new SockJS(scrollback.host+"/socket");
		socket.onopen=function(){done();};
	});
	afterEach(function(done){
		socket.close();
		done();
	});

	it("With sane properties", function(done){
		var sessionId = "web://"+uid();
		var init = {
		"id": sessionId,
		"type": "init",
		"to": "me",
		"suggestedNick": "anklebiter",
		"session": "web://"+uid(),
		"resource": uid(),
		"origin": {
			domain: "scrollback.io", 
			verified: true }
		};
		socket.onmessage = function(message){
			message = JSON.parse(message.data);
			assert(message.type!='error', "Init failed!");
			done();
		};
		socket.send(JSON.stringify(init));
	});

	it("Without 'session'", function(done){
		var init = {
		"id": uid(),
		"type": "init",
		"to": "me",
		"resource": uid(),
		"origin": {
					domain: "scrollback.io", 
					verified: true }
		};
		socket.onmessage = function(message){
			message = JSON.parse(message.data);
			assert(message.type=='error', "INIT without session happened!");
			done();
		};
		socket.send(JSON.stringify(init));
	});

	it("With existing 'session'", function(done){
		var pSocket = new SockJS(scrollback.host+"/socket");
		var sessionId = "web://"+uid();
		var user;
		pSocket.onopen=function(){
			var init = {
			"id": uid(),
			"session": "web://"+sessionId,
			"type": "init",
			"to": "me",
			"resource": uid(),
			"origin": {
						domain: "scrollback.io", 
						verified: true }
			};
			pSocket.onmessage = function(message){
				message = JSON.parse(message.data);
				user = message.user;
				var init = {
				"id": uid(),
				"session": "web://"+sessionId,
				"type": "init",
				"to": "me",
				"resource": uid(),
				"origin": {
							domain: "scrollback.io", 
							verified: true }
				};
				socket.onmessage = function(message){
					message = JSON.parse(message.data);
					// Expected: Get back existing USER object
					assert(message.user.id === user.id, "INIT with existing 'session' ID happened!");
					done();
				};
				socket.send(JSON.stringify(init));
			};
			pSocket.send(JSON.stringify(init));
		};
		pSocket.close();
		done();
	});

	it("With invalid characters in 'suggestedNick'", function(done){
				var init = {
				"id": uid(),
				"suggestedNick":'!#$%9some_invalid_nick',
				"type": "init",
				"to": "me",
				"resource": uid(),
				"origin": {
							domain: "scrollback.io", 
							verified: true }
				};
				socket.onmessage = function(message){
					message = JSON.parse(message.data);
					assert(message.type=='error', "INIT with invalid suggestedNick was created!");
					done();
				};
				socket.send(JSON.stringify(init));
	});

	it("With existing 'session' and 'suggestedNick'", function(){});

	it("Facebook login with valid auth token", function(done){
		function statusChanged(response) {
			if (response.status === 'connected') {
					var sessionId = "web://"+uid();
					var init = {
					"auth": {
						"facebook": response.authResponse.accessToken
					},
					"id": sessionId,
					"type": "init",
					"to": "me",
					"suggestedNick": "gustavsDachshund",
					"session": "web://"+uid(),
					"resource": uid(),
					"origin": {
						domain: "scrollback.io", 
						verified: true }
					};
					socket.onmessage = function(message){
						message = JSON.parse(message.data);
						assert(message.type!='error', "Facebook login failed!");
						done();
					};
					socket.send(JSON.stringify(init));
			}
			else {
				FB.login(statusChanged);
			}
		}
		FB.init({
			appId      : '834799843281318',
			xfbml      : false,
			version    : 'v2.3'
		});
		FB.getLoginStatus(statusChanged);
	});

	// it("Google+ login with valid auth token", function(){});
	// it("Google+ login with invalid auth token", function(){});
	// it("Persona login with valid auth token", function(){});
	// it("Persona login with invalid auth token", function(){});
});
