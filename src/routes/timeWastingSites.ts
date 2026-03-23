import type { FastifyInstance } from "fastify";
import {
    getUserTimeWastingSites,
    addUserTimeWastingSite,
} from "../controllers/timeWastingSiteController.js";

export default async function timeWastingSiteRoutes(app: FastifyInstance) {
    app.get(
        "/",
        { preHandler: [app.authenticate], schema: { security: [{ bearerAuth: [] }] } },
        getUserTimeWastingSites
    );

    app.post(
        "/",
        { preHandler: [app.authenticate], schema: { security: [{ bearerAuth: [] }] } },
        addUserTimeWastingSite
    );
}