if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputManager = Bepro.createSingleton( function() {
    // 変数
    let _isPushingUpKey     = false;
    let _isPushingDownKey   = false;
    let _isPushingLeftKey   = false;
    let _isPushingRightKey  = false;
    let _isClicking         = false;
    let _isTouching         = false;

    _onRegisters();

    /**
     * 登録する時の処理
     */
    function _onRegisters() {
        const onRegisterPushingkeyEvents = function() {
            const onSet = function( key, isPushing ) {
                switch ( key ) {
                    case 'ArrowUp'      : _isPushingUpKey       = isPushing; break;
                    case 'ArrowDown'    : _isPushingDownKey     = isPushing; break;
                    case 'ArrowLeft'    : _isPushingLeftKey     = isPushing; break;
                    case 'ArrowRight'   : _isPushingRightKey    = isPushing; break;
                }
            };

            const onKeyDown = function( event ) { onSet( event.key, true    ); };
            const onKeyUp   = function( event ) { onSet( event.key, false   ); };

            window.addEventListener( 'keydown'  , onKeyDown );
            window.addEventListener( 'keyup'    , onKeyUp   );
        };

        const onRegisterClickingEvent = function() {
            window.addEventListener( 'mousedown', function() { _isClicking = true;  } );
            window.addEventListener( 'mouseup'  , function() { _isClicking = false; } );
        }

        const onRegisterTouchingEvent = function() {
            const OPTION = Bepro.getPassiveOption();
            
            window.addEventListener( 'touchstart'  , function() { _isTouching = true;  }, OPTION );
            window.addEventListener( 'touchend'    , function() { _isTouching = false; }, OPTION );
        }

        onRegisterPushingkeyEvents();
        onRegisterClickingEvent();
        onRegisterTouchingEvent();
    }

    function _resetAll() {
        _isPushingUpKey     = false;
        _isPushingDownKey   = false;
        _isPushingLeftKey   = false;
        _isPushingRightKey  = false;
        _isClicking         = false;
        _isTouching         = false;
    }

    return {
        isPushingUpKey      : function() { return _isPushingUpKey;      },
        isPushingDownKey    : function() { return _isPushingDownKey;    },
        isPushingLeftKey    : function() { return _isPushingLeftKey;    },
        isPushingRightKey   : function() { return _isPushingRightKey;   },
        isClicking          : function() { return _isClicking;          },
        isTouching          : function() { return _isTouching;          },
        resetAll            : _resetAll,
    };
} ); 


