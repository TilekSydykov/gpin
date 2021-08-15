const util = require("./util")
module.exports = {
    getSpec: (modelName)=>{
        return `import { Test, TestingModule } from '@nestjs/testing';
import { ${ util.capitalizeFirstLetter(modelName)}Controller } from './${modelName}.controller';

describe('${ util.capitalizeFirstLetter(modelName)}Controller', () => {
  let controller: ${ util.capitalizeFirstLetter(modelName)}Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${ util.capitalizeFirstLetter(modelName)}Controller],
    }).compile();

    controller = module.get<${ util.capitalizeFirstLetter(modelName)}Controller>(${ util.capitalizeFirstLetter(modelName)}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
`
    },
    getModule: (modelName)=>{
        return `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ${ util.capitalizeFirstLetter(modelName)}Service } from './${modelName}.service';
import { ${ util.capitalizeFirstLetter(modelName)}Controller } from './${modelName}.controller';
import { ${ util.capitalizeFirstLetter(modelName)}, ${ util.capitalizeFirstLetter(modelName)}Schema } from './schema/${modelName}.schema';

@Module({
  providers: [${ util.capitalizeFirstLetter(modelName)}Service],
  controllers: [${ util.capitalizeFirstLetter(modelName)}Controller],
  imports: [
    MongooseModule.forFeature([{ name: ${ util.capitalizeFirstLetter(modelName)}.name, schema: ${ util.capitalizeFirstLetter(modelName)}Schema}])
  ],
})
export class ${ util.capitalizeFirstLetter(modelName)}Module {}
`
    },
    getController: modelName => {
        return `import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,Post,Put,} from '@nestjs/common';
import { Create${ util.capitalizeFirstLetter(modelName)}Dto } from './dto/create-${modelName}.dto';
import { Update${ util.capitalizeFirstLetter(modelName)}Dto } from './dto/update-${modelName}.dto';
import { ${ util.capitalizeFirstLetter(modelName)}Service } from './${modelName}.service';
import { ${ util.capitalizeFirstLetter(modelName)} } from './schema/${modelName}.schema';

@Controller('${modelName}')
export class ${ util.capitalizeFirstLetter(modelName)}Controller {
  constructor(private readonly ${modelName}Service: ${ util.capitalizeFirstLetter(modelName)}Service) {}

  @Get()
  getAll(): Promise<${ util.capitalizeFirstLetter(modelName)}[]> {
    return this.${modelName}Service.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() create${ util.capitalizeFirstLetter(modelName)}Dto: Create${ util.capitalizeFirstLetter(modelName)}Dto): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Service.create(create${ util.capitalizeFirstLetter(modelName)}Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Service.remove(id);
  }

  @Put(':id')
  update(
    @Body() update${ util.capitalizeFirstLetter(modelName)}Dto: Update${ util.capitalizeFirstLetter(modelName)}Dto, 
    @Param('id') id: string,
  ): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Service.update(id, update${ util.capitalizeFirstLetter(modelName)}Dto);
  }
}
`
    },
    getService: modelName => {
        return `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Create${ util.capitalizeFirstLetter(modelName)}Dto } from './dto/create-${modelName}.dto';
import { ${ util.capitalizeFirstLetter(modelName)}, ${ util.capitalizeFirstLetter(modelName)}Document } from './schema/${modelName}.schema';
import { Update${ util.capitalizeFirstLetter(modelName)}Dto } from './dto/update-${modelName}.dto';

@Injectable()
export class ${ util.capitalizeFirstLetter(modelName)}Service {
  constructor(@InjectModel(${ util.capitalizeFirstLetter(modelName)}.name) private ${modelName}Model: Model<${ util.capitalizeFirstLetter(modelName)}Document>) {
  }

  async getAll(): Promise<${ util.capitalizeFirstLetter(modelName)}[]> {
    return this.${modelName}Model.find().exec();
  }

  async getById(id: string): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Model.findById(id);
  }

  async create(productDto: Create${ util.capitalizeFirstLetter(modelName)}Dto): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    const newProduct = new this.${modelName}Model(productDto);
    return newProduct.save();
  }

  async remove(id: string): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Model.findByIdAndRemove(id);
  }

  async update(id: string, ${modelName}Dto: Update${ util.capitalizeFirstLetter(modelName)}Dto): Promise<${ util.capitalizeFirstLetter(modelName)}> {
    return this.${modelName}Model.findByIdAndUpdate(id, ${modelName}Dto, { new: true });
  }
}`
    },
    getModelSchema: (model, modelName) => {
        let fields = ''
        for (const fieldsKey in model.fields) {
            fields += `  @Prop()\n  ${fieldsKey}: ${model.fields[fieldsKey].type};\n`
        }
        return `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ${ util.capitalizeFirstLetter(modelName)}Document = ${ util.capitalizeFirstLetter(modelName)} & Document;

@Schema()
export class ${ util.capitalizeFirstLetter(modelName)} {
${fields}}

export const ${ util.capitalizeFirstLetter(modelName)}Schema = SchemaFactory.createForClass(${ util.capitalizeFirstLetter(modelName)});
`
    },
    getCreateDTO: (model, modelName) => {
        let fields = ''
        for (const fieldsKey in model.fields) {
            fields += `  readonly ${fieldsKey}: ${model.fields[fieldsKey].type};\n`
        }
        return `export class Create${ util.capitalizeFirstLetter(modelName)}Dto {
${fields}}
`
    },
    getUpdateDTO: (model, modelName) => {
        let fields = ''
        for (const fieldsKey in model.fields) {
            fields += `  readonly ${fieldsKey}: ${model.fields[fieldsKey].type};\n`
        }
        return `export class Update${ util.capitalizeFirstLetter(modelName)}Dto {
${fields}}
`
    }
}