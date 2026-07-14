"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const formSubmit_route_1 = __importDefault(require("./routes/formSubmit.route"));
const jobs_route_1 = __importDefault(require("./routes/jobs.route"));
const company_route_1 = __importDefault(require("./routes/company.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const application_route_1 = __importDefault(require("./routes/application.route"));
const report_route_1 = __importDefault(require("./routes/report.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
// Request logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} — query:`, req.query, "— body keys:", req.body ? Object.keys(req.body) : null);
    next();
});
// Routes
app.use('/', formSubmit_route_1.default);
app.use('/', jobs_route_1.default);
app.use('/api', company_route_1.default);
app.use('/api/user', user_route_1.default);
app.use('/api/applications', application_route_1.default);
app.use('/api', report_route_1.default);
app.use('/api/dashboard', dashboard_route_1.default);
app.get('/', (req, res) => {
    res.send('API running');
});
async function startServer() {
    try {
        await (0, db_1.connectDB)();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
    }
}
startServer();
