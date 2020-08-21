import { EntityRepository, Repository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signUp(authCredentialsDto: AuthCredentialsDto) : Promise<void>{
        const { username, password } = authCredentialsDto;
   
        const user = new User();
        user.username = username;
        //esto no es necesario guardarlo
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        // console.log(user.password);
        try {
            await user.save()    
        } catch (error) {
            console.log(error.code);
            if(error.code === '23505') {
                throw new ConflictException('el usuario existe');
            } else {
                throw new InternalServerErrorException();
            }
            
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string>{
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        if(user && await user.validatePassword(password)){
            return user.username;
        } else{ 
            return null;
        }


    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt);
    }
}