import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersDbService {
 
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ){}

    saveUser(user:Partial<User>){
        return this.usersRepository.save(user)
    }

    getUserBydId(id: string) {
        return this.usersRepository.findOne({where: {id}})

    }
    getUserByName(name: string) {
        return this.usersRepository.findOne({where: {name}})

    }
    getUsers() {
        return this.usersRepository.find();
    }
 
    getUserByEmail(email:string) {
        return this.usersRepository.findOne({ where: {email}});
    }
}