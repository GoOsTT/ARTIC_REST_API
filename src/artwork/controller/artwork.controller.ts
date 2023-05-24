import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ArtworkService } from '../service/artwork.service';
import { ArtWorkIdParamDto } from '../dto/get-single-artwork-param.dto';
import { ResponseSingleArtWorkDto } from '../dto/response-single-artwork.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth-guard';
import { GetListArtworkDto } from '../dto/get-list-artwork.dto';

@ApiTags('Artwork')
@ApiBearerAuth()
@Controller('artwork')
export class ArtworkController {
  constructor(private readonly artWorkService: ArtworkService) {}

  @ApiOperation({
    summary: 'Fetching a single artwork from the Art Institute of Chicago API.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Response will contain a single artwork from the Art Institute of Chicago API.',
    type: ResponseSingleArtWorkDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No artwork was found by the specified id.',
    type: NotFoundException,
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getSingleArtwork(
    @Param() artWorkIdParamDto: ArtWorkIdParamDto,
  ): Promise<ResponseSingleArtWorkDto> {
    const selectedArtwork = await this.artWorkService.getSingleArtwork(
      artWorkIdParamDto,
    );

    return selectedArtwork;
  }

  @ApiOperation({
    summary: 'Fetching a list of artworks defined by page and amount per page.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Response will contain a list of artwork from the Art Institute of Chicago API.',
    type: ResponseSingleArtWorkDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'No artwork was found by the specified id.',
    type: NotFoundException,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getPaginatedArtworkList(
    @Query() getListArtworkDto: GetListArtworkDto,
  ): Promise<ResponseSingleArtWorkDto[]> {
    const artWorkList = await this.artWorkService.getPaginatedArtworkList(
      getListArtworkDto,
    );

    return artWorkList;
  }
}
