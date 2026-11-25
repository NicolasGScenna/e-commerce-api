import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class IdParamDto{
    @ApiProperty({ description: 'Identificador UUID del recurso.', example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
    @IsUUID()
    id:string;
}
