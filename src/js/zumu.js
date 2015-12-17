var Zumu = ( function( browserDoc ) {
    "use strict";

    var doc = browserDoc,
        log = function( message ) {

            if ( console !== undefined && console.log ) {

                console.log( message );

            }

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
            this.z = -100;
            this.zoomIncrement = 100;
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

        // Set translate position of content container
        this.setElementPosition( this.x, this.y, this.z );

        return container;

    };

    Zoom.prototype.setElementStyle = function( style ) {

        this.contentContainer.style.cssText += style;

    };

    Zoom.prototype.setElementPosition = function( x, y, z ) {

        var translateStyle = this.buildTranslateStyle( x, y, z ),
            transformStyle = this.buildTransformStyle( translateStyle );

        this.setElementStyle( transformStyle );

    };

    Zoom.prototype.createButton = function( options ) {

        var button = doc.createElement( "div" );

        if ( options ) {

            button.style.cssText += options.style;

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
                )
            }),
            zoomInButton = this.createButton({
                "style": this.buildPositionStyle(
                    "absolute", {
                        "top": 10,
                        "left": 35
                    }
                )
            }),
            zoomResetButton = this.createButton({
                "style": this.buildPositionStyle(
                    "absolute", {
                        "top": 10,
                        "left": 60
                    }
                )
            });

        container.appendChild( zoomOutButton );
        container.appendChild( zoomInButton );
        container.appendChild( zoomResetButton );

        zoomOutButton.className = "zumu-button";
        zoomOutButton.innerHTML = "+";
        zoomInButton.className = "zumu-button";
        zoomInButton.innerHTML = "-";
        zoomResetButton.className = "zumu-button";
        zoomResetButton.innerHTML = "*";

        zoomOutButton.addEventListener( "click", function() {
            self.zoom( self.zoomIncrement );
        });

        zoomInButton.addEventListener( "click", function() {
            self.zoom( -self.zoomIncrement );
        });

        zoomResetButton.addEventListener( "click", function() {
            self.resetZoom();
        });

    };

    Zoom.prototype.zoom = function( val ) {

        if ( this.z + val <= -100 ) {

            this.z += val;
            this.setElementPosition( this.x, this.y, this.z );

        }

    };

    Zoom.prototype.resetZoom = function() {

        this.resetPosition();
        this.setElementPosition( this.x, this.y, this.z );

    };

    Zoom.prototype.resetPosition = function() {

        this.x = 0;
        this.y = 0;
        this.z = -100;

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
        this.setElementPosition( this.x, this.y, this.z );

    };

    Zoom.prototype.moveY = function( val ) {

        this.y += val;
        this.setElementPosition( this.x, this.y, this.z );

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
            ( z ? ( z + "px" ) : 0 ) + ");";

    };

    Zoom.prototype.buildTransformStyle = function( style ) {

        return [
            "transform:" + style,
            "-webkit-transform:" + style,
            "-moz-transform::" + style,
            "-o-transform::" + style
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
                pos && pos.top ?
                    "top:" + pos.top + "px;" : "",
                pos && pos.right ?
                    "right:" + pos.right + "px;" : "",
                pos && pos.left ?
                    "left:" + pos.left + "px;" : "",
                pos && pos.bottom ?
                    "bottom:" + pos.bottom + "px;" : ""
            ].join( "" );

        }

        return posStyle;

    };

    Zoom.prototype.revert = function() {

        if ( this.contentContainer ) {

            // Reset position
            this.resetPosition();
            this.setElementStyle( this.buildTransformStyle( "none;" ) );

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

    Zoom.prototype.resetContainers = function() {

        this.container = document.createElement( "div" );
        this.contentContainer = null;

    };

    return Zoom;

}( document ) );
