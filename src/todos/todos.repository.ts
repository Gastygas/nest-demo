import { Injectable } from "@nestjs/common";

@Injectable({})
export class TodosRepository {
    private todos = [
        {
            id:1,
            title:"Todo 1",
            description:"Todo 1",
            isCompleted:false,
        },
        {
            id:2,
            title:"Todo 2",
            description:"Todo 2",
            isCompleted:false,
        },
        {
            id:3,
            title:"Todo 3",
            description:"Todo 3",
            isCompleted:false,
        },
        {
            id:4,
            title:"Todo 4",
            description:"Todo 4",
            isCompleted:false,
        },
    ];

    async getTodo() {
        return this.todos
    }

}