import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,

} from "@nestjs/common";

import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { AuthGuard } from "../auth/auth.guard";
import { IdParamDto } from "../../dto/id-param.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { Role } from "../auth/roles.enum";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Productos')
@Controller('products')
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Listar productos', description: 'Devuelve una página de productos con su categoría. Valores predeterminados: page=1 y limit=5.' })
    @ApiQuery({ name: 'page', required: false, type: Number, minimum: 1, example: 1, description: 'Número de página (comienza en 1).' })
    @ApiQuery({ name: 'limit', required: false, type: Number, minimum: 1, example: 5, description: 'Cantidad máxima de productos por página.' })
    @ApiOkResponse({ description: 'Productos de la página solicitada.', schema: { example: [{ id: '550e8400-e29b-41d4-a716-446655440001', name: 'Auriculares inalámbricos', description: 'Auriculares con cancelación de ruido.', price: '149.99', stock: 12, imgUrl: 'https://example.com/headphones.webp', category: { id: '550e8400-e29b-41d4-a716-446655440010', name: 'audio' } }] } })
    getProducts(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
    ) {
        return this.productsService.getProducts(
            Number(page),
            Number(limit),
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener producto', description: 'Busca un producto por su identificador UUID.' })
    @ApiParam({ name: 'id', description: 'UUID del producto.', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiOkResponse({ description: 'Producto encontrado.', schema: { example: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Auriculares inalámbricos', description: 'Auriculares con cancelación de ruido.', price: '149.99', stock: 12, imgUrl: 'https://example.com/headphones.webp', category: { id: '550e8400-e29b-41d4-a716-446655440010', name: 'audio' } } } })
    @ApiNotFoundResponse({ description: 'Producto no encontrado.', schema: { example: { statusCode: 404, message: 'Producto no encontrado', error: 'Not Found' } } })
    async getProductById(
        @Param() params: IdParamDto,
    ) {
        const product = await this.productsService.getProductById(params.id)
        if(!product) throw new NotFoundException ('Producto no encontrado')
        return product;
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear producto', description: 'Requiere un JWT válido. Crea un producto y devuelve su UUID.' })
    @ApiCreatedResponse({ description: 'UUID del producto creado.', schema: { example: '550e8400-e29b-41d4-a716-446655440001' } })
    @ApiBadRequestResponse({ description: 'El body no cumple las reglas de validación.', schema: { example: { alert: 'Se han detectado los siguientes errores en la petición:', errors: [{ property: 'price', constraints: { isNumber: 'price must be a number' } }] } } })
    @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
    @Post()
    @UseGuards(AuthGuard)
    createProduct(
        @Body() product: CreateProductDto,
    ) {
        return this.productsService.createProduct(product);
    }

    @Post('seeder')
    @ApiOperation({ summary: 'Cargar productos de ejemplo', description: 'Inserta los productos predefinidos que todavía no existen. Pensado para inicializar datos de desarrollo.' })
    @ApiCreatedResponse({ description: 'Productos insertados (o lista vacía si no había nuevos).', schema: { example: [{ id: '550e8400-e29b-41d4-a716-446655440001', name: 'Iphone 15', description: 'The best smartphone in the world', price: '199.99', stock: 12 }] } })
    addProducts() {
        return this.productsService.addProducts();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar producto', description: 'Requiere token de administrador. El body admite los campos del producto; según la configuración de validación actual deben enviarse los campos requeridos del DTO.' })
    @ApiParam({ name: 'id', description: 'UUID del producto.', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiOkResponse({ description: 'UUID del producto actualizado.', schema: { example: '550e8400-e29b-41d4-a716-446655440001' } })
    @ApiNotFoundResponse({ description: 'Producto no encontrado.' })
    @ApiBadRequestResponse({ description: 'El body no cumple las reglas de validación.' })
    @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
    @ApiForbiddenResponse({ description: 'El usuario autenticado no tiene rol de administrador.' })
    @Put(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    async updateProduct(
        @Param() params: IdParamDto,
        @Body() product: CreateProductDto,
    ) {
        const productToUpdate = await this.productsService.getProductById(params.id)
        if(!productToUpdate) throw new NotFoundException ('Producto no encontrado')
        return this.productsService.updateProduct(
            params.id,
            product,
        );
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar producto', description: 'Requiere un JWT válido. Elimina el producto indicado.' })
    @ApiParam({ name: 'id', description: 'UUID del producto.', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiOkResponse({ description: 'UUID del producto eliminado.', schema: { example: '550e8400-e29b-41d4-a716-446655440001' } })
    @ApiNotFoundResponse({ description: 'Producto no encontrado.' })
    @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteProduct(
        @Param() params: IdParamDto,
    ) {
        const product = await this.productsService.getProductById(params.id)
        if(!product) throw new NotFoundException ('Producto no encontrado')
        return this.productsService.deleteProduct(params.id);
    }
}
