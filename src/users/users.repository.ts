import { Injectable } from "@nestjs/common";
import { IUser } from "./user.interface";

@Injectable()
export class UsersRepository {
    private users: IUser[] = [
        {
            id:1,
            name:"Zurdo",
        },
        {
            id:2,
            name:"Gordop",
        },
        {
            id:3,
            name:"Ingrid",
        },
    ];
    
    async getUsers(){
        return this.users
    };
    
    async getById(id: number) {
        return this.users.find((user) => user.id === id)
    }
    async getByName(name: string) {
        return this.users.find((user) => user.name === name);
    }

    async createUser(user: Omit < IUser, 'id' >):Promise <IUser> {
        const id = this.users.length + 1;
        this.users = [...this.users, {id, ...user}]
        return {id, ...user};
    }
};