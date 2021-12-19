Number.isInteger = Number.isInteger || function( value ) {
    const IS_INTEGER = 
        typeof value === "number" && 
        isFinite( value ) && 
        Math.floor( value ) === value
    ;

    return IS_INTEGER;
};

NodeList.prototype.forEach = NodeList.prototype.forEach || function( onExecute, thisArg ) {
    thisArg     = thisArg || window;
    const COUNT = this.length;

    for ( let i = 0; i < COUNT; i++ ) {
        onExecute.call( thisArg, this[i], i, this );
    }
};