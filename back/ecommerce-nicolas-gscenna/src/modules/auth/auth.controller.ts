import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/logis-user.dto";
import { SignupUserDto } from "./dto/signup-user.dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    @ApiOperation({ summary: 'Estado del módulo de autenticación', description: 'Endpoint informativo actual; todavía devuelve un texto fijo y no realiza una consulta de autenticación.' })
    @ApiOkResponse({ description: 'Texto informativo del módulo.', schema: { example: 'Get all auth' } })
    getAuth() {
        return this.authService.getAuth();
    }
    @Post('signin')
    @ApiOperation({ summary: 'Iniciar sesión', description: 'Valida email y contraseña. Devuelve los datos públicos del usuario y un JWT válido por una hora.' })
    @ApiOkResponse({ description: 'Sesión iniciada.', schema: { example: { user: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Nicolás Scenna', email: 'nico@example.com', phone: 3415551234, address: 'Rosario, Santa Fe', country: 'Argentina', city: 'Rosario' }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } })
    @ApiUnauthorizedResponse({ description: 'Email o contraseña incorrectos.', schema: { example: { statusCode: 401, message: 'Email o contraseña incorrectos', error: 'Unauthorized' } } })
    @ApiBadRequestResponse({ description: 'El body no cumple el formato del DTO.', schema: { example: { alert: 'Se han detectado los siguientes errores en la petición:', errors: [{ property: 'email', constraints: { isEmail: 'email must be an email' } }] } } })
    signin(@Body() loginUserDto: LoginUserDto){
        return this.authService.signIn(loginUserDto);
    }
    @Post('signup')
    @ApiOperation({ summary: 'Registrar usuario', description: 'Crea una cuenta. La contraseña debe cumplir las reglas del DTO y coincidir con confirmPassword.' })
    @ApiCreatedResponse({ description: 'Usuario creado (sin contraseña).', schema: { example: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Nicolás Scenna', email: 'nico@example.com', phone: 3415551234, address: 'Rosario, Santa Fe', country: 'Argentina', city: 'Rosario' } } })
    @ApiBadRequestResponse({ description: 'Datos inválidos o contraseñas distintas.', schema: { example: { statusCode: 400, message: 'Las contraseñas no coinciden', error: 'Bad Request' } } })
    signup(@Body() signupUserDto: SignupUserDto){
        return this.authService.signUp(signupUserDto);
    }
}
