import { Controller, Delete, Get, Post, Put, HttpCode, Res, Req, Param, Query, Body, Headers, UseGuards, UseInterceptors, ParseUUIDPipe, HttpException, HttpStatus, NotFoundException, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { IUser } from "./user.interface";
import { AuthGuard } from "../guards/auth.guards";
import { DateAdderInterceptor } from "../interceptors/date-adder.intercepto";
import { UsersDbService } from "./usersDb.service";
import { usersBodyDto } from "./dto/usersBody.dto";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinSizeValidatorPipe } from "../pipes/min-size-validator.pipe";
import { AuthService } from "./auth.service";
import { UserCredentialsDto } from "./dto/UserCredentialsDto";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../roles/roles.enum";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller("users")
// @UseGuards(AuthGuard)
export class UsersController{
    constructor(private readonly userService: UsersService,
        private readonly usersDbService: UsersDbService,
        private readonly cloudinaryService : CloudinaryService,
        private readonly authService: AuthService,
    ){}

    @Get()
    getUsers(@Query('name') name?: string){
       if(name) {
        return this.usersDbService.getUserByName(name)
       }
       return this.usersDbService.getUsers()
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    getUserProfile(@Req() request: Express.Request & {user: any},){
      
        console.log(request.user);
        
        return 'perfil del usuario'
    }

    @ApiBearerAuth()
    @Post('profile/images')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(MinSizeValidatorPipe)
    @UseGuards(AuthGuard)
    getUserProfileImage(@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({
                    maxSize:1000000,
                    message:"El archivo debe ser menor a 100kb"
                }),
                new FileTypeValidator({
                    fileType:/(jpg|jpeg|png|webp)$/
                })
            ]
        })
    ) file: any){
        return this.cloudinaryService.uploadImage(file)
        
    }

    // @HttpCode(418)
    @Get('coffee')
    getCoffe(){
        try {
            throw new Error()
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.I_AM_A_TEAPOT,
                    error: 'Envio de cafe fallido'
                },
                HttpStatus.I_AM_A_TEAPOT
            );
        }
        // return 'I am a tetera, cannot make coffee  '
    }
    @Get('admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    getAdmin(){
        return 'Ruta protected'
    }

    @Get('message')
    getMessage(@Res() response: Response){
        response.status(201).send('The secret message')
    }

    @Get('auth0/protected')
    getAuth0Protected(@Req() req:Request){
        console.log(req.oidc.accessToken)
        return JSON.stringify(req.oidc.user)
    }

    @Get('request')
    getRequest( @Req() request: Request){
        return `Your params are ${request.ip}`
    }

    @Get(':id') //si o si los ":"y despues el params
    async getUserById(@Param('id', ParseUUIDPipe) id: string){ 
    //Decorador Param(parametros), le pasamos el parametro que buscamos como argumento
        const user = await this.usersDbService.getUserBydId(id)
        if(!user){
            throw new NotFoundException('User not Found')
        }
        return user
    }




    @Post('signup')
    @UseInterceptors(DateAdderInterceptor)
    createUser(
        @Body() user: usersBodyDto,
        @Req() request: Request & { now: string} ){
        
        return this.authService.singUp({...user,createdAt:request.now})
    }

    @Post("signin")
    async signin(
        @Body() user: UserCredentialsDto
    ){
        return await this.authService.singIn(user.email,user.password)
    }

    @Put()
    updateUser(){
        return 'Modify user'
    }


    @Delete()
    deleteUser(){
    }


}