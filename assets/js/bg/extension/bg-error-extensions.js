/**
 * 表示
 */
Error.prototype.show = function() {
    alert( this.message );
    console.log( this );
};