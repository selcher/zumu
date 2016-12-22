# ZumuJS

[![npm version](https://badge.fury.io/js/zumujs.svg)](https://badge.fury.io/js/zumujs)
[![Build Status](https://travis-ci.org/selcher/zumu.svg?branch=master)](https://travis-ci.org/selcher/zumu)
<a href="https://david-dm.org/selcher/zumu?type=dev"><img src="https://david-dm.org/selcher/zumu/dev-status.svg" alt="devDependency Status"></a>

Make web elements zoomable!

## Demo

Online demo is available [here](https://selcher.github.io/zumu/).

## Getting Started

* Include in Your HTML

```html
<link rel="stylesheet" type="text/css" href="zumu.min.css">
<script src="zumu.min.js"></script>
```

* Initialize Zumu on an HTML Element

```javascript
var htmlElement = document.getElementById( "id of element" );
var zumu = new Zumu();

zumu.init( htmlElement );
```

## User Guide

#### Key Shortcuts:

* i = zoom in
* o = zoom out
* r = reset zoom
* arrow keys = move
