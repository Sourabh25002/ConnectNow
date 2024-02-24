"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure multer disk storage
const storage = multer_1.default.diskStorage({
    // Set the destination folder for storing uploaded files
    destination: function (req, file, cb) {
        return cb(null, "./public/temp");
    },
    // Set the filename for storing uploaded files
    filename: function (req, file, cb) {
        return cb(null, Date.now() + "-" + file.originalname);
    },
});
// Create a multer instance with the configured storage
exports.upload = (0, multer_1.default)({ storage: storage });
