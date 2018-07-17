'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = 'http://localhost:12306';
var user = {
    userName: null,
    code: null,
    coins: null,
    openId: null
};

function getUserName() {
    return new _promise2.default(function (resolve, reject) {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: function success(res) {
                resolve(res);
            },
            fail: function fail(res) {
                reject(res);
            }
        });
    }).then(function (res) {
        return res['userInfo']['nickName'];
    }, function (res) {
        return "小气鬼";
    });
}

function getCode() {
    return new _promise2.default(function (resolve, reject) {
        wx.login({
            //获取code
            success: function success(res) {
                resolve(res);
            }
        });
    }).then(function (res) {
        return res.code;
    });
}

function getInitData(userName, code) {
    return new _promise2.default(function (resolve, reject) {
        wx.request({
            "url": url + '/init',
            "method": "POST",
            "data": {
                "userName": userName,
                "code": code
            },
            "header": {
                "Content-Type": "form-data"
            },
            "success": function success(data) {
                resolve(data);
            }
        });
    }).then(function (data) {
        console.log(data.data);
        return data.data;
    });
}

// initialization
(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var userName, code, data, _ref2;

    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    userName = null, code = null, data = null;
                    _context.next = 3;
                    return _promise2.default.all([getUserName(), getCode()]);

                case 3:
                    _ref2 = _context.sent;
                    userName = _ref2[0];
                    code = _ref2[1];
                    _context.next = 8;
                    return getInitData(userName, code);

                case 8:
                    data = _context.sent;

                    user.userName = userName;
                    user.code = code;
                    user.coins = data.coins;
                    user.openId = data.openId;

                case 13:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}))();

function isReady() {
    return !!user.openId;
}

function update() {
    if (!isReady()) {
        return false;
    }
    wx.request({
        "url": url + '/update',
        "method": "POST",
        "header": {
            "Content-Type": "form-data"
        },
        "data": {
            "coins": user.coins,
            "openId": user.openId
        }
    });
    return true;
}

function getLeaderBoard(N) {
    return new _promise2.default(function (resolve, reject) {
        wx.request({
            "url": url + '/getLeaderBoard',
            "method": "POST",
            "header": {
                "Content-Type": "form-data"
            },
            "data": {
                "number": N
            },
            "success": function success(data) {
                resolve(data);
            }
        });
    }).then(function (data) {
        return data.data;
    });
}

module.exports = {
    "user": user,
    "update": update,
    "getLeaderBoard": getLeaderBoard,
    "isReady": isReady
};
