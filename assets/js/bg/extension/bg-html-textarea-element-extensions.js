/**
 * 修正情報を設定
 * @param info 情報
 */
HTMLTextAreaElement.prototype.setRevisionInfo = function( info ) {
    this.value = info.value;
    
    this.setSelectionRange( info.selectionStart, info.selectionEnd );
    this.setScrollPosition( info.scrollPositionX, info.scrollPositionY );
};
