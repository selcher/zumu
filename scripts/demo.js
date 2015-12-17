var grid = document.getElementById( "grid" );
var zumuInstance = new Zumu();

document.getElementById( "init-zumu" ).onclick = function( e ) {

    zumuInstance.init( grid );

};

document.getElementById( "revert-zumu" ).onclick = function( e ) {

    zumuInstance.revert();

}
