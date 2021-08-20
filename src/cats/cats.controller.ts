import { Param } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Controller('cats')
export class CatsController {
  cats = {
    marmalade: { breed: 'ginger' },
  };

  @Get()
  findAllPaths(): { [name: string]: { [atribute: string]: string } } {
    return this.cats;
  }

  @Get('breed/:breed')
  catsOfBreedPath(
    @Param('breed') breed,
  ): Array<{ [name: string]: { [atribute: string]: string } }> {
    const catsOfBreed = [];
    for (const cat in this.cats) {
      if (this.cats[cat].breed == breed) {
        const catOfBreed = {};
        catOfBreed[cat] = this.cats[cat];
        catsOfBreed.push(catOfBreed);
      }
    }

    if (catsOfBreed.length != 0) return catsOfBreed;
    throw new HttpException(
      `cats of breed ${breed} don't exist in the db https://http.cat/404`,
      HttpStatus.NOT_FOUND,
    );
  }

  @Post('add')
  addCat(@Body() body): string {
    if (this.cats[body.catname] != undefined) {
      throw new HttpException(
        `${body.catname} already exists https://http.cat/409`,
        HttpStatus.CONFLICT,
      );
    }

    this.cats[body.catname] = body.info;
    return body.catname + ' added';
  }

  @Delete('delete')
  removeCat(@Body() body): string {
    if (this.cats[body.catname] == undefined) {
      throw new HttpException(
        `${body.catname} does not exist https://http.cat/404`,
        HttpStatus.NOT_FOUND,
      );
    }

    delete this.cats[body.catname];
    return body.catname + ' deleted';
  }
}
