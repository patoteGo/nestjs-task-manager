import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
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

    @Post('/signin')
    signIn( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) : Promise<{accessToken: string}>{
        return this.authService.signIn(authCredentialsDto);
    }

  

}
