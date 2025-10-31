import { NextFunction, Request, Response, type Express } from "express";
import { authRouter, ChatRouter, commentRouter, postRouter, userRouter } from "./module";
import { connectDB } from "./DB";
import { AppError } from "./utilis";
import cors from "cors";

export function bootstrap(app: Express, express: any) {

    connectDB();

    app.use(express.json());
    app.use(cors({ origin: "*" }))
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/post", postRouter);
    app.use("/comment", commentRouter)
    app.use("/chat", ChatRouter)




    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "Page not found", success: false });
    })

    app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
        return res.status(error.statusCode).json({ message: error.message, success: false, errorDetails: error.errorDetails })
    })
}