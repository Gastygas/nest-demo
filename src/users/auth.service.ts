import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { UsersDbService } from "./usersDb.service";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { Role } from "../roles/roles.enum";

@Injectable()
export class AuthService{
    constructor(
        private readonly userService: UsersDbService,
        private readonly jwtService: JwtService
    ){}

    async singUp(user: Partial<User>){
        const dbUser = await this.userService.getUserByEmail(user.email)
        if(dbUser){
            throw new BadRequestException("Email already exists")
        }
        
        const hashedPassword = await bcrypt.hash(user.password,10);
        if(!hashedPassword) throw new BadRequestException('password could not be hashed')
         
        return this.userService.saveUser({...user,password: hashedPassword})

        // return {succes: "User created succesfully!"}
    }

    async singIn(email:string,password:string){

        const userDb = await this.userService.getUserByEmail(email)
        if(!userDb) throw new BadRequestException("Email not found")

        const isPasswordValid= await bcrypt.compare(password, userDb.password)
        if(!isPasswordValid) throw new BadRequestException("Invalid Password")
        
        const userPayload = {
            sub: userDb.id,
            id: userDb.id,
            email:userDb.email,
            roles:[userDb.isAdmin ? Role.Admin : Role.User]
        }
        const token = this.jwtService.sign(userPayload)

        return { succes: 'User logged in successfully',token}
    }

}