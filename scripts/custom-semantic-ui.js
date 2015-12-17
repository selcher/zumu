// Fix menu when passed
$( ".masthead" ).visibility({
    once: false,
    onBottomPassed: function() {
        $( ".fixed.menu" ).transition( "fade in" );
    },
    onBottomPassedReverse: function() {
        $( ".fixed.menu" ).transition( "fade out" );
    }
});

// Create sidebar and attach to menu open
$( ".ui.sidebar" ).sidebar( "attach events", ".toc.item" );

// Create popup tooltip
$( ".ui.icon" ).popup();
