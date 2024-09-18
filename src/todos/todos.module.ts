import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { TodosRepository } from "./todos.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./todos.entity";
import { FilesService } from "./files.service";
import { File } from "./files.entity";

const ACCESS = "MY PASSWORDD!"

@Module({
    imports:[TypeOrmModule.forFeature([Todo,File])],
    providers:[TodosService,TodosRepository,FilesService,
        {
            provide:'GASTY_TOKEN',
            useValue: ACCESS
        },
    ],
    controllers:[TodosController]
})
export class TodosModule{}