import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

// aqui envia el /auth/signup que se definen en los decoradores 
@Controller('auth')
export class AuthController {
    
    constructor(
        private authService: AuthService,
    ){}

    @Post('/signup')
    siguUp( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) : Promise<void>{
        return this.authService.signUp(authCredentialsDto);
        

    }

}
