/**
 * 押した時の処理を登録
 * @param onPushed 押した時の処理
 */
Element.prototype.registerOnPushed = function( onPushed ) {
    let     isTouching  = false;
    const   OPTION      = Bepro.getPassiveOption();

    const onTouched = function() {
        if ( !isTouching ) return;

        onPushed();
        isTouching = false;
    };

    this.addEventListener( 'touchstart' , function() { isTouching = true;  }, OPTION );
    this.addEventListener( 'touchmove'  , function() { isTouching = false; }, OPTION );
    this.addEventListener( 'touchend'   , onTouched                         , OPTION );
};

/**
 * ホバー時の処理を登録
 * @param onStarted 開始時の処理
 * @param onEnded   終了時の処理
 */
Element.prototype.registerOnHover = function( onStarted, onEnded ) {
    const OPTION = Bepro.getPassiveOption();

    this.addEventListener( 'touchstart' , onStarted , OPTION );
    this.addEventListener( 'touchend'   , onEnded   , OPTION );
};
