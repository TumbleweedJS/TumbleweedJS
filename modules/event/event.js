/**
 * Created with JetBrains WebStorm.
 * User: Olousouzian
 * Date: 6/11/12
 * Time: 6:29 PM
 * To change this template use File | Settings | File Templates.
 */

/*
 Class Event
 */

var KeyEnum = {
    Backspace : "8",
    Tab : "9",
    Enter : "13",
    Shift : "16",
    Ctrl : "17",
    Alt : "18",
    Pause : "19",
    CapsLock : "20",
    Escape : "27",
    PageUp : "33",
    PageDown : "34",
    End : "35",
    Home : "36",
    LeftArrow : "37",
    UpArrow : "38",
    RightArrow : "39",
    DownArrow : "40",
    Insert : "45",
    Delete : "46",
    0 : "48",
    1 : "49",
    2 : "50",
    3 : "51",
    4 : "52",
    5 : "53",
    6 : "54",
    7 : "55",
    8 : "56",
    9 : "57",
    A : "65",
    B : "66",
    C : "67",
    D : "68",
    E : "69",
    F : "70",
    G : "71",
    H : "72",
    I : "73",
    J : "74",
    K : "75",
    L : "76",
    M : "77",
    N : "78",
    O : "79",
    P : "80",
    Q : "81",
    R : "82",
    S : "83",
    T : "84",
    U : "85",
    V : "86",
    W : "87",
    X : "88",
    Y : "89",
    Z : "90",
    F1 : "112",
    F2 : "113",
    F3 : "114",
    F4 : "115",
    F5 : "116",
    F6 : "117",
    F7 : "118",
    F8 : "119",
    F9 : "120",
    F10 : "121",
    F11 : "122",
    F12 : "123",
    Space : "32"
}


var EventManager = function()
{
    //variables
    var keyDown = new Array();
    var oldKeyDown = new Array();
    var callBack = new Array();

    function Initialize()
    {
        window.onkeydown = UpdateDown;
        window.onkeyup = UpdateUp;
        keyDown.length = 0;
        callBack.length = 0;
        oldKeyDown.length = 0;
    };

    function addCallBack(fun)
    {
        callBack.push(fun);
        return callBack.length;
    };

    function deleteCallBack(funId)
    {
        callBack.splice(funId, 1);
    }

    function UpdateDown(event)
    {
        UpdateArray();

        for(var it = 0; it < keyDown.length; it++)
        {
            if (keyDown[it] == event.keyCode)
                return;
        }
        keyDown.push(event.keyCode);
    };

    function UpdateUp(event)
    {
        UpdateArray();

        for(var it = 0; it < keyDown.length; it++)
        {
            if (keyDown[it] == event.keyCode)
                keyDown.splice(it, 1);
        }
    };

    function isKeyDown(keyCode)
    {
        for(var it = 0; it < keyDown.length; it++)
        {
            if (keyDown[it] == keyCode)
                return true;
        }
        return false;
    }

    function isOldKeyDown(keyCode)
    {
        for(var it = 0; it < oldKeyDown.length; it++)
        {
            if (oldKeyDown[it] == keyCode)
                return true;
        }
        return false;
    }

    function isKeyUp(keyCode)
    {
        return !isKeyDown(keyCode);
    }

    function isKeyPressed(keyCode)
    {
        if (this.isOldKeyDown(keyCode) && this.isKeyUp(keyCode))
        {
            for(var it = 0; it < oldKeyDown.length; it++)
            {
                if (oldKeyDown[it] == keyCode)
                    oldKeyDown.splice(it, 1);
            }
            return true;
        }
        return false;
    }

    function Update()
    {
        for(var it = 0; it < callBack.length; it++)
        {
           callBack[it]();
        }
    };

    function UpdateArray()
    {
        oldKeyDown.length = 0;
        for (var it = 0; it < keyDown.length; it++)
            oldKeyDown.push(keyDown[it]);
    }

    return function()
    {
        this.Initialize = Initialize;
        this.isKeyDown = isKeyDown;
        this.isKeyUp = isKeyUp;
        this.addCallBack = addCallBack;
        this.deleteCallBack = deleteCallBack;
        this.Update = Update;
        this.isKeyPressed = isKeyPressed;
        this.isOldKeyDown = isOldKeyDown;

        this.keyDown = keyDown;
        this.oldKeyDown = oldKeyDown;
    }
}();