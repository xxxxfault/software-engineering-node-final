"use strict";
exports.__esModule = true;
var AccountType_1 = require("./AccountType");
var MaritalStatus_1 = require("./MaritalStatus");
var User = /** @class */ (function () {
    function User(id, username, password) {
        this.username = '';
        this.password = '';
        this.firstName = null;
        this.lastName = null;
        this.email = '';
        this.profilePhoto = null;
        this.headerImage = null;
        this.accountType = AccountType_1["default"].Personal;
        this.maritalStatus = MaritalStatus_1["default"].Single;
        this.biography = null;
        this.dateOfBirth = null;
        this.joined = new Date();
        this.location = null;
        this.id = id;
        this.username = username;
        this.password = password;
    }
    Object.defineProperty(User.prototype, "uName", {
        get: function () { return this.username; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "pass", {
        get: function () { return this.password; },
        enumerable: false,
        configurable: true
    });
    return User;
}());
exports["default"] = User;
