import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersDbService } from "../usersDb.service";
import { User } from "../users.entity";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken'

describe('authService',() =>{
    let mockUsersService : Partial<UsersDbService>
    let authService:AuthService

    const mockUser : Partial<User> = {
        name: 'lars2023',
        createdAt:'01/01/2024',
        password:"123456",
        email:'lars@gmail.com.ar',
        isAdmin:false,
    }

    beforeEach(async() => {
        mockUsersService = {
            getUserByEmail: () => Promise.resolve(undefined),
            saveUser:(user:Omit<User,'id'>): Promise<User> => Promise.resolve({
                ...user,
                isAdmin:false,
                id:"1234fs-234sd-24csfd-34sdft"
            })
        };
        const mockJwtService = {
            sign: (payload) => jwt.sign(payload,"testSecret")
        }
        const module = await Test.createTestingModule({
            providers:[
                AuthService,
                {provide: JwtService,
                 useValue: mockJwtService},
                {
                provide:UsersDbService,
                useValue:mockUsersService,
                },
        ],
        }).compile();

        authService = module.get<AuthService>(AuthService);

    })

    it("Create an instance of AuthService", async() =>{
        expect(authService).toBeDefined()
    })

    
    it('signUp() creates a new user with an encripted password', async() => {
        const user = await authService.singUp(mockUser)
        expect(user).toBeDefined();
        expect(user.password).not.toEqual(mockUser.password)
    })

    it("SignUp() throws an error if te email is already in use",async() => {
        mockUsersService.getUserByEmail = async(email:string) =>
             Promise.resolve(mockUser as User)
            
        try {
                await authService.singUp(mockUser as User);
            } catch (error) {
                expect(error.message).toEqual("Email already exists")
            }
        
    });

    it('signIn() returns an error if the password is invalid',async()=>{
        mockUsersService.getUserByEmail = (email:string) => 
            Promise.resolve(mockUser as User)

        try {
            await authService.singIn(mockUser.email, 'INVALID PASSWORD')
        } catch (error) {
            expect(error.message).toEqual("Invalid Password")
        }
    });

    it('signIn() returns an error if the user is not found', async() => {
        try {
            await authService.singIn(mockUser.email, mockUser.password)
            
        } catch (error) {
            expect(error.message).toEqual('Email not found')
        }
    })

    it('signIn() return an object with a message and token if the user is found and the password is valid', async() =>{
        const mockUserVariant = {
            ...mockUser,
            password: await bcrypt.hash(mockUser.password,10)
        };
        mockUsersService.getUserByEmail = (email:string) =>
             Promise.resolve(mockUserVariant as User)

        const response = await authService.singIn(
            mockUser.email,
            mockUser.password
        )

        expect(response).toBeDefined()
        expect(response.token).toBeDefined()
        expect(response.succes).toEqual('User logged in succesfully')
    });

})
