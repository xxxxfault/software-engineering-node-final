"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var TuitSchema = new mongoose_1["default"].Schema({
    tuit: { type: String, required: true },
    postedOn: { type: Date, "default": Date.now },
    postedBy: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "UserModel"
    }
}, { collection: 'tuits' });
exports["default"] = TuitSchema;
