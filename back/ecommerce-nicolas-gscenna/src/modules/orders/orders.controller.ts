import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { IdParamDto } from "../../dto/id-param.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Órdenes')
@Controller('orders')
export class OrdersController{
    constructor(private readonly ordersService: OrdersService){}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear orden de compra', description: 'Requiere un JWT válido. Todos los productos deben existir y tener stock. Cada producto incluido descuenta una unidad de stock; los IDs repetidos se consolidan.' })
    @ApiCreatedResponse({ description: 'Orden creada con usuario, fecha y detalle.', schema: { example: { id: '550e8400-e29b-41d4-a716-446655440020', date: '2026-11-24T15:00:00.000Z', user: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Nicolás Scenna', email: 'nico@example.com' }, orderDetails: [{ id: '550e8400-e29b-41d4-a716-446655440021', price: '149.99', products: [{ id: '550e8400-e29b-41d4-a716-446655440001', name: 'Auriculares inalámbricos', price: '149.99' }] }] } } })
    @ApiBadRequestResponse({ description: 'Uno o más productos no existen o no tienen stock.' })
    @ApiNotFoundResponse({ description: 'Usuario indicado no encontrado.' })
    @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
    @UseGuards(AuthGuard)
    @Post()
    addOrder(@Body() createOrderDto: CreateOrderDto){
        return this.ordersService.addOrder(createOrderDto)
    };

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener orden', description: 'Requiere un JWT válido. Devuelve la orden con usuario y productos asociados.' })
    @ApiParam({ name: 'id', description: 'UUID de la orden.', example: '550e8400-e29b-41d4-a716-446655440020' })
    @ApiOkResponse({ description: 'Orden encontrada.', schema: { example: { id: '550e8400-e29b-41d4-a716-446655440020', date: '2026-11-24T15:00:00.000Z', user: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Nicolás Scenna', email: 'nico@example.com' }, orderDetails: [{ id: '550e8400-e29b-41d4-a716-446655440021', price: '149.99', products: [{ id: '550e8400-e29b-41d4-a716-446655440001', name: 'Auriculares inalámbricos' }] }] } } })
    @ApiNotFoundResponse({ description: 'Orden no encontrada.' })
    @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
    @UseGuards(AuthGuard)
    @Get(':id')
    async getOrder(@Param()params : IdParamDto){
        const order = await this.ordersService.getOrder(params.id)
        if(!order) throw new NotFoundException ('Orden de compra no encontrada')
        return order;
    }
}
