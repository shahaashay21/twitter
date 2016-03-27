/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the login if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return the home page if the url is wrong', function(done){
		http.get('http://localhost:3000/home', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

	it('should login', function(done) {
		request.post(
			    'http://localhost:3000/checklogin',
			    { form: { username: 'divya_shah22@yahoo.com',password:'divyashah' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('should create new tweet', function(done) {
		request.post(
			    'http://localhost:3000/reg',
			    { form: { fname: 'test',lname:'test', email: 'shah.divya222@gmail.com', pass: 'divyashah' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});
