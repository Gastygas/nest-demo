import { Inject, Injectable } from "@nestjs/common";
import { TodosRepository } from "./todos.repository";
import { Repository } from "typeorm";
import { Todo } from "./todos.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TodosService {

    constructor(private todosRepository : TodosRepository,
        @Inject('GASTY_TOKEN') private gastyToken : string,){}
        @InjectRepository(Todo)
        private todosDbRepository: Repository<Todo>
    // getTodos() {
    //     return "MY PASSWORDD!" === this.gastyToken ?
    //     this.todosRepository.getTodo() : 'INVALID ACCESS';
    // }

    getTodos(){
        return this.todosDbRepository.find({
            relations:['files']
        })
    }

    findById(id:number){
        return this.todosDbRepository.findOne({where: {id}, relations:['files']})
    }

    create(todo:Omit<Todo,'id'>){
        return this.todosDbRepository.save(todo)
    }
}