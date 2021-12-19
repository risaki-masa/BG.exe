/**
 * クラスを追加
 * @param {*} name 名前
 */
Element.prototype.addClass = function( name ) {
    this.classList.add( name );
};

/**
 * クラスを除く
 * @param {*} name 名前
 */
Element.prototype.removeClass = function( name ) {
    this.classList.remove( name );
};

/**
 * クラスを切り替え
 * @param beforeName    前の名前
 * @param afterName     後の名前
 */
Element.prototype.switchClass = function( beforeName, afterName ) {
    this.removeClass( beforeName );
    this.addClass( afterName );
};

/**
 * クラスを逆の状態に切り替え
 * @param beforeName    前の名前
 * @param afterName     後の名前
 */
Element.prototype.toggleClass = function( name ) {
    this.classList.toggle( name );
};

/**
 * スクロールの平行方向の位置を取得
 * @return スクロールの平行方向の位置
 */
Element.prototype.getScrollPositionX = function() {
    return this.scrollLeft;
};

/**
 * スクロールの垂直方向の位置を取得
 * @return スクロールの垂直方向の位置
 */
Element.prototype.getScrollPositionY = function() {
    return this.scrollTop;
};

/**
 * スクロールの垂直方向の最大位置を取得
 * @return スクロールの垂直方向の最大位置
 */
Element.prototype.getScrollMaxPositionY = function() {
    return this.scrollHeight - this.clientHeight;
};

/**
 * スクロールの垂直方向の位置を設定
 * @param position スクロールの垂直方向の位置
 */
Element.prototype.setScrollPositionY = function( position ) {
    this.scrollTop = position;
};

/**
 * スクロールの位置を設定
 * @param positionX スクロールの平行方向の位置
 * @param positionY スクロールの垂直方向の位置
 */
Element.prototype.setScrollPosition = function( positionX, positionY ) {
    this.scrollLeft = positionX;
    this.scrollTop  = positionY;
};

/**
 * スタイルシートの値を取得
 * @param   propertyName プロパティ名
 * @return  スタイルシートの値
 */
Element.prototype.getStylesheetValue = function( propertyName ) {
    const STYLE = window.getComputedStyle( this );
    const VALUE = STYLE.getPropertyValue( propertyName );

    return VALUE;
};

/**
 * 整数値としてスタイルシートの値を取得
 * @param   propertyName プロパティ名
 * @return  スタイルシートの値
 */
Element.prototype.getStylesheetValueAsInteger = function( propertyName ) {
    return this.getStylesheetValue( propertyName ).toInteger();
};

/**
 * 整数値としてスタイルシートの高さを取得
 * @return スタイルシートの高さ
 */
Element.prototype.getHeightOfStylesheetAsInteger = function() {
    const HEIGHT = this.getStylesheetValueAsInteger( 'height' );
    if ( !Bepro.isIE() ) return HEIGHT;

    // IEの高さはパディングが除かれた値となるため、パディングを加算する
    const PADDING_TOP       = this.getStylesheetValueAsInteger( 'padding-top' );
    const PADDING_BOTTOM    = this.getStylesheetValueAsInteger( 'padding-bottom' );

    return HEIGHT + PADDING_TOP + PADDING_BOTTOM;
};

/**
 * 全ての子要素を除く
 */
Element.prototype.removeAllChilds = function() {
    this.textContent = null;
};
