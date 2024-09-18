import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsEmail, IsString, IsUUID, MinLength, IsEmpty } from "class-validator";

export class usersBodyDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description:'User name min 3 characters',
        example:'elZurdo'
    })
    name:string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description:'Email has to be a valid email',
        example:'zurdo@gmail.com'
    })
    email:string;

    @IsEmpty()
    @ApiProperty({
        description:'Default is false. you must not include it in the body',
        default:false
    })
    isAdmin:boolean

    /**
     * Has to be a hard passwordasda23
     * @example Strong!Pass123
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    // @ApiProperty({
    //     description:'Has to be a hard password',
    //     example:'Strong!Pass123'
    // })
    password: string
}