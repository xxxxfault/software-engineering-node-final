"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema_1 = __importDefault(require("./UserSchema"));
const UserModel = mongoose_1.default.model("UserModel", UserSchema_1.default);
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map