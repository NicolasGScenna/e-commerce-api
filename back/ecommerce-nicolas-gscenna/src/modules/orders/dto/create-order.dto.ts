import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class OrderProductDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Es el id de un producto',
        example: '550e8400-e29b-41d4-a716-446655440001'
    })
    id: string;
}

export class CreateOrderDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty({
        description:"Es el id de el usuario que va a generar la orden de compra",
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderProductDto)
    @ApiProperty({
        description:'Es un array de los IDS de los productos que se quieren agregar a la orden',
        example:[
            { id: '550e8400-e29b-41d4-a716-446655440001' },
            { id: '550e8400-e29b-41d4-a716-446655440002' },
        ],
      })
    products: OrderProductDto[];
}
