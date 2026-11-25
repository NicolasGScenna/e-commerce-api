import { Controller, Get, Post } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController{
    constructor(private readonly categoriesService: CategoriesService){}

    @Get()
    @ApiOperation({ summary: 'Listar categorías', description: 'Devuelve todas las categorías disponibles.' })
    @ApiOkResponse({ description: 'Categorías disponibles.', schema: { example: [{ id: '550e8400-e29b-41d4-a716-446655440010', name: 'smartphone' }, { id: '550e8400-e29b-41d4-a716-446655440011', name: 'monitor' }] } })
    getCategories(){
        return this.categoriesService.getCategories()
    }
    
    @Post('seeder')
    @ApiOperation({ summary: 'Cargar categorías de ejemplo', description: 'Crea las categorías predefinidas que aún no existen. Endpoint de inicialización de datos de desarrollo.' })
    @ApiCreatedResponse({ description: 'Categorías disponibles luego de ejecutar la carga.', schema: { example: [{ id: '550e8400-e29b-41d4-a716-446655440010', name: 'smartphone' }, { id: '550e8400-e29b-41d4-a716-446655440011', name: 'monitor' }] } })
    addCategories(){
        return this.categoriesService.addCategories([
      { name: 'smartphone' },
      { name: 'monitor' },
      { name: 'keyboard' },
      { name: 'mouse' },
    ])
    }
}
