import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { IdParamDto } from '../../dto/id-param.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios', description: 'Requiere JWT de administrador. Devuelve una página de usuarios sin contraseñas. Valores predeterminados: page=1 y limit=5.' })
  @ApiQuery({ name: 'page', required: false, type: Number, minimum: 1, example: 1, description: 'Número de página (comienza en 1).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, minimum: 1, example: 5, description: 'Cantidad máxima de usuarios por página.' })
  @ApiOkResponse({ description: 'Usuarios de la página solicitada.', schema: { example: [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Nicolás Scenna', email: 'nico@example.com', phone: 3415551234, address: 'Rosario, Santa Fe', country: 'Argentina', city: 'Rosario' }] } })
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido o usuario sin rol de administrador.' })
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  async getUsers(@Query('page')page: string='1',@Query('limit')limit: string='5') {
    return this.usersService.getUsers(Number(page),Number(limit));
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario', description: 'Requiere JWT. Devuelve los datos públicos y un resumen de sus órdenes.' })
  @ApiParam({ name: 'id', description: 'UUID del usuario.', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOkResponse({ description: 'Usuario encontrado, sin contraseña ni indicador administrativo.', schema: { example: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Nicolás Scenna', email: 'nico@example.com', phone: 3415551234, address: 'Rosario, Santa Fe', country: 'Argentina', city: 'Rosario', orders: [{ id: '550e8400-e29b-41d4-a716-446655440020', date: '2026-11-24T15:00:00.000Z' }] } } })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUsersById(@Param()params: IdParamDto){
    const user = await this.usersService.getUserById(params.id)
    if(!user) throw new NotFoundException ('Usuario no encontrado')
    return user;
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Requiere JWT. Actualiza los datos del usuario indicado; el DTO requiere todos sus campos obligatorios.' })
  @ApiParam({ name: 'id', description: 'UUID del usuario.', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOkResponse({ description: 'UUID del usuario actualizado.', schema: { example: '550e8400-e29b-41d4-a716-446655440000' } })
  @ApiBadRequestResponse({ description: 'El body no cumple las reglas de validación.', schema: { example: { alert: 'Se han detectado los siguientes errores en la petición:', errors: [{ property: 'email', constraints: { isEmail: 'email must be an email' } }] } } })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(@Param()params: IdParamDto,@Body() user: CreateUserDto){
    const userToUpdate = await this.usersService.getUserById(params.id)
    if(!userToUpdate) throw new NotFoundException ('Usuario no encontrado')
    return this.usersService.updateUser(params.id,user);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Requiere JWT. Elimina el usuario indicado.' })
  @ApiParam({ name: 'id', description: 'UUID del usuario.', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOkResponse({ description: 'UUID del usuario eliminado.', schema: { example: '550e8400-e29b-41d4-a716-446655440000' } })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param()params: IdParamDto){
    const user = await this.usersService.getUserById(params.id)
    if(!user) throw new NotFoundException ('Usuario no encontrado')
    return this.usersService.deleteUser(params.id);
  }
}
