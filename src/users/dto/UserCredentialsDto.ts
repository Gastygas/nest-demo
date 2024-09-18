import { PickType } from "@nestjs/swagger";
import { usersBodyDto } from "./usersBody.dto";

export class UserCredentialsDto extends PickType(usersBodyDto,[
    'email',
    'password'
]){

}