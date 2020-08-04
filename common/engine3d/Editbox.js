(function () {
    if (!(cc && cc.EditBoxComponent)) {
        return;
    }

    const EditBoxComp = cc.EditBoxComponent;
    const js = cc.js;
    const KeyboardReturnType = EditBoxComp.KeyboardReturnType;
    const MAX_VALUE = 65535;
    let _currentEditBoxImpl = null;

    function getKeyboardReturnType (type) {
        switch (type) {
            case KeyboardReturnType.DEFAULT:
            case KeyboardReturnType.DONE:
                return 'done';
            case KeyboardReturnType.SEND:
                return 'send';
            case KeyboardReturnType.SEARCH:
                return 'search';
            case KeyboardReturnType.GO:
                return 'go';
            case KeyboardReturnType.NEXT:
                return 'next';
        }
        return 'done';
    }

    function MiniGameEditBoxImpl () {
        this._delegate = null;
        this._editing = false;

        this._eventListeners = {
            onKeyboardInput: null,
            onKeyboardConfirm: null,
            onKeyboardComplete: null,
        };
    }

    js.extend(MiniGameEditBoxImpl, EditBoxComp._EditBoxImpl);
    EditBoxComp._EditBoxImpl = MiniGameEditBoxImpl;

    Object.assign(MiniGameEditBoxImpl.prototype, {
        init (delegate) {
            if (!delegate) {
                cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },

        beginEditing () {
            // In case multiply register events
            if (_currentEditBoxImpl === this) {
                return;
            }
            let delegate = this._delegate;
            // handle the old keyboard
            if (_currentEditBoxImpl) {
                let currentImplCbs = _currentEditBoxImpl._eventListeners;
                currentImplCbs.onKeyboardComplete();

                __globalAdapter.updateKeyboard && __globalAdapter.updateKeyboard({
                    value: delegate.string,
                });
            }
            else {
                this._showKeyboard();
            }

            this._registerKeyboardEvent();

            this._editing = true;
            _currentEditBoxImpl = this;
            delegate._editBoxEditingDidBegan();
        },

        endEditing () {
            this._hideKeyboard();
            let cbs = this._eventListeners;
            cbs.onKeyboardComplete && cbs.onKeyboardComplete();
        },

        _registerKeyboardEvent () {
            let self = this;
            let delegate = this._delegate;
            let cbs = this._eventListeners;

            cbs.onKeyboardInput = function (res) {
                if (delegate._string !== res.value) {
                    delegate._editBoxTextChanged(res.value);
                }
            }

            cbs.onKeyboardConfirm = function (res) {
                delegate._editBoxEditingReturn();
                let cbs = self._eventListeners;
                cbs.onKeyboardComplete && cbs.onKeyboardComplete();
            }

            cbs.onKeyboardComplete = function () {
                self._editing = false;
                _currentEditBoxImpl = null;
                self._unregisterKeyboardEvent();
                delegate._editBoxEditingDidEnded();
            }

            __globalAdapter.onKeyboardInput(cbs.onKeyboardInput);
            __globalAdapter.onKeyboardConfirm(cbs.onKeyboardConfirm);
            __globalAdapter.onKeyboardComplete(cbs.onKeyboardComplete);
        },

        _unregisterKeyboardEvent () {
            let cbs = this._eventListeners;

            if (cbs.onKeyboardInput) {
                __globalAdapter.offKeyboardInput(cbs.onKeyboardInput);
                cbs.onKeyboardInput = null;
            }
            if (cbs.onKeyboardConfirm) {
                __globalAdapter.offKeyboardConfirm(cbs.onKeyboardConfirm);
                cbs.onKeyboardConfirm = null;
            }
            if (cbs.onKeyboardComplete) {
                __globalAdapter.offKeyboardComplete(cbs.onKeyboardComplete);
                cbs.onKeyboardComplete = null;
            }
        },

        _showKeyboard () {
            let delegate = this._delegate;
            let multiline = (delegate.inputMode === EditBoxComp.InputMode.ANY);
            __globalAdapter.showKeyboard({
                defaultValue: delegate.string,
                maxLength: delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength,
                multiple: multiline,
                confirmHold: false,
                confirmType: getKeyboardReturnType(delegate.returnType),
                success (res) {

                },
                fail (res) {
                    cc.warn(res.errMsg);
                }
            });
        },

        _hideKeyboard () {
            __globalAdapter.hideKeyboard({
                success (res) {

                },
                fail (res) {
                    cc.warn(res.errMsg);
                },
            });
        },
    });
})();

