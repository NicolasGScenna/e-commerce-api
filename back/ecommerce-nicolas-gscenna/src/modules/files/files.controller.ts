import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "../auth/auth.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiParam, ApiBody, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Archivos')
@Controller('files')
export class FilesController{
    constructor(private readonly filesService: FilesService){}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Subir imagen de producto', description: 'Requiere JWT. Acepta imágenes JPG, JPEG, PNG o WebP de hasta 200 KiB. La URL segura resultante queda asociada al producto.' })
    @ApiParam({ name: 'id', description: 'UUID del producto que recibirá la imagen.', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary', description: 'Archivo de imagen, máximo 200 KiB (JPG, JPEG, PNG o WebP).' } } } })
    @ApiCreatedResponse({ description: 'Resultado de carga del proveedor de imágenes.', schema: { example: { asset_id: 'abc123', public_id: 'products/abc123', secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.webp', format: 'webp', resource_type: 'image', bytes: 48210 } } })
    @ApiBadRequestResponse({ description: 'Archivo ausente, formato no permitido o tamaño superior a 200 KiB.' })
    @ApiUnauthorizedResponse({ description: 'Falta un token válido.' })
    @UseGuards(AuthGuard)
    @Post('uploadImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@Param('id')id: string,@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize: 200 * 1024}),
                new FileTypeValidator({fileType: /^image\/(jpg|jpeg|png|webp)$/})
            ],
        })
    )file: Express.Multer.File){
        return this.filesService.uploadImage(id,file);
    }
}
