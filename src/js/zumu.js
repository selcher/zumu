var Zumu = ( function( browserDoc ) {
    "use strict";

    var doc = browserDoc,
        log = function( message ) {

            if ( console !== undefined && console.log ) {

                console.log( message );

            }

        },
        isUndefined = function( val ) {

            return val === undefined || val === null;

        };

    /**
     * Class: Zoom
     */
    function Zoom() {

        var instance = null;

        if ( this instanceof Zoom ) {

            this.container = doc.createElement( "div" );
            this.contentContainer = null;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.scale = 1;
            this.zoomIncrement = 0.1;
            this.moveIncrement = 10;

            instance = this;

        } else {

            instance = new Zoom();

        }

        return instance;

    }

    Zoom.prototype.init = function( contentContainer ) {

        if ( this.contentContainer ) {

            log( "ZumuJS: HTML Element already initialized." );

        } else if ( contentContainer ) {

            this.contentContainer = contentContainer;

            var container = this.initContainer(
                this.container, contentContainer );

            this.addZoomButtons( container );

            this.addKeyListeners( container );

        } else {

            log( "ZumuJS: Initialization failed. No HTML Element passed." );

        }

    };

    Zoom.prototype.initContainer = function( container, contentContainer ) {

        // Insert container into content container parent
        // but make sure to insert it at its current position
        contentContainer.parentElement.insertBefore(
            container, contentContainer.nextSibling );

        // Then insert content container into container
        container.appendChild( contentContainer );

        // Set perspective on container
        var size = contentContainer.getBoundingClientRect();

        container.className = "zumu-container";
        container.style.cssText += [
            this.buildPerspectiveStyle( "800px" ),
            this.buildSizeStyle( size.width, size.height )
        ].join( "" );

        // set tabindex to capture keyboard events
        container.setAttribute( "tabindex", 0 );

        // Reset scale and translate position of content container
        this.resetZoom();

        return container;

    };

    Zoom.prototype.createButton = function( options ) {

        var button = doc.createElement( "div" );

        if ( options ) {

            button.style.cssText += options.style;
            button.className = options.class;
            button.innerHTML = options.html;
            button.addEventListener( "click", options.click );

        }

        return button;

    };

    Zoom.prototype.addZoomButtons = function( container ) {

        var self = this,
            zoomOutButton = this.createButton({
                "style": this.buildPositionStyle(
                    "absolute", {
                        "top": 10,
                        "left": 10
                    }
                ),
                "class": "zumu-button",
                "html": "+",
                "click": function() {
                    self.zoom( self.zoomIncrement );
                }
            }),
            zoomInButton = this.createButton({
                "style": this.buildPositionStyle(
                    "absolute", {
                        "top": 10,
                        "left": 35
                    }
                ),
                "class": "zumu-button",
                "html": "-",
                "click": function() {
                    self.zoom( -self.zoomIncrement );
                }
            }),
            zoomResetButton = this.createButton({
                "style": this.buildPositionStyle(
                    "absolute", {
                        "top": 10,
                        "left": 60
                    }
                ),
                "class": "zumu-button",
                "html": "*",
                "click": function() {
                    self.resetZoom();
                }
            });

        container.appendChild( zoomOutButton );
        container.appendChild( zoomInButton );
        container.appendChild( zoomResetButton );

    };

    Zoom.prototype.setContentContainerStyle = function( style ) {

        this.contentContainer.style.cssText += style;

    };

    Zoom.prototype.updateTransform = function( scale, translate ) {

        var transformStyle = this.buildTransformStyle( scale, translate );

        this.setContentContainerStyle( transformStyle );

    };

    Zoom.prototype.zoom = function( val ) {

        this.scale += val;
        this.updateTransform();

    };

    Zoom.prototype.resetZoom = function() {

        this.resetPosition();
        this.resetScale();
        this.updateTransform();

    };

    Zoom.prototype.resetPosition = function() {

        this.x = 0;
        this.y = 0;
        this.z = 0;

    };

    Zoom.prototype.resetScale = function() {

        this.scale = 1;

    };

    Zoom.prototype.addKeyListeners = function( container ) {

        var self = this;

        // Prevent browser scroll when focus is on container
        document.addEventListener( "keydown", function( e ) {

            if ( doc.activeElement === container ) {

                e.preventDefault();
                return false;

            }

            return true;

        });

        container.addEventListener( "keydown", function( e ) {

            var keyCode = e.keyCode;

            self.addZoomKeyListeners( keyCode );
            self.addMoveKeyListeners( keyCode );

            e.preventDefault();

            return false;

        } );

    };

    Zoom.prototype.addZoomKeyListeners = function( keyCode ) {

        // i = zoom in
        if ( keyCode === 73 ) {
            this.zoom( this.zoomIncrement );
        }

        // o = zoom out
        if ( keyCode === 79 ) {
            this.zoom( -this.zoomIncrement );
        }

        // r = reset zoom
        if ( keyCode === 82 ) {
            this.resetZoom();
        }

    };

    Zoom.prototype.addMoveKeyListeners = function( keyCode ) {

        // 37 = left
        if ( keyCode === 37 ) {
            this.moveX( -this.moveIncrement );
        }

        // 39 = right
        if ( keyCode === 39 ) {
            this.moveX( this.moveIncrement );
        }

        // 38 = up
        if ( keyCode === 38 ) {
            this.moveY( -this.moveIncrement );
        }

        // 40 = down
        if ( keyCode === 40 ) {
            this.moveY( this.moveIncrement );
        }

    };

    Zoom.prototype.moveX = function( val ) {

        this.x += val;
        this.updateTransform();

    };

    Zoom.prototype.moveY = function( val ) {

        this.y += val;
        this.updateTransform();

    };

    Zoom.prototype.buildPerspectiveStyle = function( val ) {

        return [
            "perspective:" + val + ";",
            "-webkit-perspective:" + val + ";",
            "-moz-perspective:" + val + ";",
            "-o-perspective:" + val + ";",
            "perspective-origin:center;"
        ].join( "" );

    };

    Zoom.prototype.buildTranslateStyle = function( x, y, z ) {

        return "translate3d(" +
            ( x ? ( x + "px" ) : 0 ) + "," +
            ( y ? ( y + "px" ) : 0 ) + "," +
            ( z ? ( z + "px" ) : 0 ) + ")";

    };

    Zoom.prototype.buildScaleStyle = function( scale ) {

        return 'scale(' + scale + ',' + scale + ')';

    };

    Zoom.prototype.buildTransformStyle = function( scale, translate ) {

        var transformStyle = this.buildTransformValueStyle( scale, translate );

        return this.buildTransformPrefixStyle( transformStyle );

    };

    Zoom.prototype.buildTransformValueStyle = function( scale, translate ) {

        var newScale = isUndefined( scale ) ? this.scale : scale,
            newTranslate = isUndefined( translate ) ? {} : translate,
            scaleStyle = this.buildScaleStyle( newScale ),
            translateStyle = this.buildTranslateStyle(
                isUndefined( newTranslate.x ) ? this.x : newTranslate.x,
                isUndefined( newTranslate.y ) ? this.y : newTranslate.y,
                isUndefined( newTranslate.z ) ? this.z : newTranslate.z
            );

        return scaleStyle + " " + translateStyle + ";";

    };

    Zoom.prototype.buildTransformPrefixStyle = function( transformStyle ) {

        return [
            "transform:" + transformStyle,
            "-webkit-transform:" + transformStyle,
            "-moz-transform:" + transformStyle,
            "-o-transform:" + transformStyle
        ].join( "" );

    };

    Zoom.prototype.buildSizeStyle = function( width, height ) {

        return [
            width !== undefined ? "width:" + width + "px;" : "",
            height !== undefined ? "height:" + height + "px;" : ""
        ].join( "" );

    };

    Zoom.prototype.buildPositionStyle = function( type, pos ) {

        var posStyle = "";

        if ( type === "relative" ) {

            posStyle = "position:relative;";

        } else if ( type === "absolute" ) {

            posStyle = [
                "position:absolute;",
                pos && isUndefined( pos.top ) ?
                    "" : "top:" + pos.top + "px;",
                pos && isUndefined( pos.right ) ?
                    "" : "right:" + pos.right + "px;",
                pos && isUndefined( pos.left ) ?
                    "" : "left:" + pos.left + "px;",
                pos && isUndefined( pos.bottom ) ?
                    "" : "bottom:" + pos.bottom + "px;"
            ].join( "" );

        }

        return posStyle;

    };

    Zoom.prototype.revert = function() {

        if ( this.contentContainer ) {

            // Reset position and scale
            this.resetPosition();
            this.resetScale();
            this.resetTransform();

            // Move content container outside container
            // but make sure content container stays at current position
            this.container.parentElement.insertBefore(
                this.contentContainer, this.container.nextSibling );

            // Remove content container
            if ( this.container.remove ) {

                this.container.remove();

            } else {

                this.container.parentElement.removeChild( this.container );

            }

            this.resetContainers();

        } else {

            log( "ZumuJS: Initialize before calling revert." );

        }

    };

    Zoom.prototype.resetTransform = function() {

        this.setContentContainerStyle(
            this.buildTransformPrefixStyle( "none;" )
        );

    };

    Zoom.prototype.resetContainers = function() {

        this.container = document.createElement( "div" );
        this.contentContainer = null;

    };

    return Zoom;

}( document ) );
