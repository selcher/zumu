'use strict';

var should = require('chai').should(),
	jsdom = require('jsdom').jsdom;

// Setup globals (window, document)
// before importing zumujs
var doc = jsdom( '<html><body></body></html>' );
var win = doc.parentWindow;

global.document = doc;
global.window = win;

var Zumu = require('../src/js/zumu.js');

describe('zumujs', () => {
	it('is a constructor', () => {
		(typeof Zumu).should.equal('function');
	});
});

describe('instance', () => {
	it('has init method', () => {
		var zum = new Zumu({});
		(typeof zum.init).should.equal('function');
	});

	it('has revert method', () => {
		var zum = new Zumu({});
		(typeof zum.revert).should.equal('function');
	});
});
