import {initTRPC} from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context().create({
    transformer: superjson,
    errorFormatter({shape}) {
        return shape;
    },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
