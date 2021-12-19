if ( typeof Bg === 'undefined' ) var Bg = {};

/**
 * 関数を管理するオブジェクト
 */
Bg.FunctionManager = Bepro.createSingleton( function() {
    // 定数
    const _RESERVED_WORD_CHECKER = new Bg.ReservedWordChecker;

    // 変数
    let _infoList = _getBuildInInfos();

    /**
     * 組み込み関数の情報を取得
     * @returns 組み込み関数の情報
     */
    function _getBuildInInfos() {
        return {
            show                : { isBuiltIn: true, func: new Bg.ShowFunction              },
            clear               : { isBuiltIn: true, func: new Bg.ClearFunction             },
            wait                : { isBuiltIn: true, func: new Bg.WaitFunction              },
            is_pushing_up_key   : { isBuiltIn: true, func: new Bg.IsPushingUpKeyFunction    },
            is_pushing_down_key : { isBuiltIn: true, func: new Bg.IsPushingDownKeyFunction  },
            is_pushing_left_key : { isBuiltIn: true, func: new Bg.IsPushingLeftKeyFunction  },
            is_pushing_right_key: { isBuiltIn: true, func: new Bg.IsPushingRightKeyFunction },
            is_clicking         : { isBuiltIn: true, func: new Bg.IsClickingFunction        },
            is_touching         : { isBuiltIn: true, func: new Bg.IsTouchingFunction        },
            get_hours           : { isBuiltIn: true, func: new Bg.GetHoursFunction          },
            get_minutes         : { isBuiltIn: true, func: new Bg.GetMinutesFunction        },
            get_seconds         : { isBuiltIn: true, func: new Bg.GetSecondsFunction        },
        };
    }

    /**
     * 登録
     * @param {any} func 関数
     */
    function _register( func ) {
        const NAME = func.getName();

        if ( NAME === Bg.ENTRY_POINT_NAME ) {
            const INFOS = func.getArgumentInfos();

            if ( INFOS.length > 0 ) {
                Bg.MessageList.ARGUMENTS_ARE_UNNECESSARY_IN_MAIN_FUNCTION.throwError();
            }
        }

        if ( _exists( NAME ) ) {
            Bg.MessageList.DUPLICATED_FUNCTION_NAMES
                .format( NAME )
                .throwError()
            ;
        }

        if ( _RESERVED_WORD_CHECKER.isMatchedAny( NAME ) ) {
            Bg.MessageList.DUPLICATED_FUNCTION_NAME_AND_RESERVED_WORD
                .format( NAME )
                .throwError()
            ;
        }

        _infoList[NAME] = { 
            isBuiltIn   : false,
            func        : func,
        };
    }

    /**
     * 全て登録解除
     */
    function _unregisterAll() {
        _infoList = _getBuildInInfos();
    }

    /**
     * 関数の情報を取得
     * @param   {any} name 名前
     * @returns 関数の情報
     */
    function _getInfo( name ) {
        const INFO = _infoList[name];

        return INFO.isBuiltIn ? 
            { isBuiltIn: INFO.isBuiltIn, func: INFO.func } :
            { isBuiltIn: INFO.isBuiltIn, func: INFO.func.clone() }
        ;
    }

    /**
     * 関数が存在するか判断する値を取得
     * @param   {any} name 名前
     * @returns 関数が存在するか判断する値
     */
    function _exists( name ) {
        return _infoList.hasOwnProperty( name );
    }

    return {
        register            : _register,
        unregisterAll       : _unregisterAll,
        getInfo             : _getInfo,
        exists              : _exists,
    };
} );
