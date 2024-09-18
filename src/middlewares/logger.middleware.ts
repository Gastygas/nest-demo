import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


//si no es un middleware global, es un injectable,sino lo exporto como una func normal
@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Estas ejecutando un metodo ${req.method}
            en la ruta ${req.url}`);
        next()
    }
}

export function loggerGlobal(req: Request, res: Response, next: NextFunction){
        console.log(`Estas ejecutando un metodo ${req.method}
            en la ruta ${req.url}`);
        next()
}
