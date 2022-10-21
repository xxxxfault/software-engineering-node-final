"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var UserSchema_1 = require("./UserSchema");
var UserModel = mongoose_1["default"].model("UserModel", UserSchema_1["default"]);
exports["default"] = UserModel;
