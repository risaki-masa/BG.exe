/**
 * 奇数か判断する値を取得
 * @return 奇数か判断する値
 */
Number.prototype.isOdd = function( value ) {
    return this % 2 === 1;
};

/**
 * 順に実行
 * @param onExecute 実行する時の処理
 */
Number.prototype.forEach = function( onExecute ) {
    for ( let i = 0; i < this; i++ ) onExecute( i ); 
};

/**
 * 除算して、整数に変換
 * @param   divisor 除数
 * @return  除算した整数値
 */
Number.prototype.divideAndToInteger = function( divisor ) {
    return parseInt( this / divisor );
};

/**
 * 除算して、切り上げ
 * @param   divisor 除数
 * @return  除算して、切り上げした整数値
 */
Number.prototype.divideAndCeil = function( divisor ) {
    return Math.ceil( this / divisor )
};