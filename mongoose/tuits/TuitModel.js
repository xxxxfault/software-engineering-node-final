"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var TuitSchema_1 = require("./TuitSchema");
var TuitModel = mongoose_1["default"].model("TuitModel", TuitSchema_1["default"]);
exports["default"] = TuitModel;
