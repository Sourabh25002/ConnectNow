"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const users_profile_route_1 = __importDefault(require("./routes/users_profile_route"));
const education_route_1 = __importDefault(require("./routes/education_route"));
const work_experience_route_1 = __importDefault(require("./routes/work_experience_route"));
const project_details_route_1 = __importDefault(require("./routes/project_details_route"));
const posts_route_1 = __importDefault(require("./routes/posts_route"));
const post_likes_route_1 = __importDefault(require("./routes/post_likes_route"));
const post_comments_route_1 = __importDefault(require("./routes/post_comments_route"));
const connections_route_1 = __importDefault(require("./routes/connections_route"));
const app = (0, express_1.default)();
const port = process.env.PORT;
// Load environment variables from a .env file
dotenv.config();
// Enable CORS middleware with credentials support
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
// Parse incoming JSON requests with a size limit of 16kb
app.use(express_1.default.json());
// Parse incoming URL-encoded requests with a size limit of 16kb
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express_1.default.static("public"));
// Parse cookies using cookie-parser middleware
app.use((0, cookie_parser_1.default)());
//Self created routes
// Root route
app.get("/", (req, res) => {
    res.send("Hello world!");
});
// Use authentication routes defined in the "authRoute" module
app.use("/auth", auth_route_1.default);
// Use user profile routes defined in the "userProfileRoute" module
app.use("/user", users_profile_route_1.default);
// Use education routes defined in the "educationRoute" module
app.use("/edu", education_route_1.default);
// Use work experience routes defined in the "workExperienceRoute" module
app.use("/work", work_experience_route_1.default);
app.use("/project", project_details_route_1.default);
app.use("/post", posts_route_1.default);
app.use("/like", post_likes_route_1.default);
app.use("/comment", post_comments_route_1.default);
app.use("/follow", connections_route_1.default);
// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
