/**
 * 順に実行
 * @param onExecute 実行する時の処理
 */
HTMLCollection.prototype.forEach = function( onExecute ) {
    const COUNT = this.length;

    for ( let i = 0; i < COUNT; i++ ) {
        onExecute( this[i], i );
    }
};

/**
 * クラスを含んでいる場合、インデックスを取得
 * @param   className クラス名
 * @return  インデックス
 */
HTMLCollection.prototype.getIndexIfContaingClass = function( className ) {
    const COUNT = this.length;

    for ( let i = 0; i < COUNT; i++ ) {
        let classList = this[i].classList;
        if ( classList.contains( className ) ) return i;
    }

    return null;
};