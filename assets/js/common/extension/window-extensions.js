/**
 * リサイズした時の処理を登録
 * @param onCompleted 完了時の処理 
 */
Window.prototype.registerOnResized = function( onCompleted ) {
    const LIST = Bepro._onResizedWindowList;

    LIST.push( onCompleted );
    if ( LIST.length > 1 ) return;

    const INTERVAL  = 300;
    const onResized = function() {
        LIST.forEach( function( value ) { value(); } );
    };

    const observingEvent = Bepro.createObservingEvent( INTERVAL, null, null, onResized );
    window.addEventListener( 'resize', observingEvent );
};