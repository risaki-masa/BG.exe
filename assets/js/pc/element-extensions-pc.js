/**
 * 押した時の処理を登録
 * @param onPushed 押した時の処理
 */
Element.prototype.registerOnPushed = function( onPushed ) {
    this.addEventListener( 'click', onPushed );
};

/**
 * ホバー時の処理を登録
 * @param onStarted 開始時の処理
 * @param onEnded   終了時の処理
 */
Element.prototype.registerOnHover = function( onStarted, onEnded ) {
    this.addEventListener( 'mouseover'  , onStarted );
    this.addEventListener( 'mouseout'   , onEnded   );
};
