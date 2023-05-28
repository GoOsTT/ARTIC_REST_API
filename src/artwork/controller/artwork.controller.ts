import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  NotFoundException,
  Post,
  UnauthorizedException,
  Body,
  BadRequestException,
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
import { PostBuyArtworkDto } from '../dto/post-buy-artwork.dto';
import { ResponseArtworkPurchaseDto } from '../dto/response-buy-artwork.dto';
import { GetUserArtWorkDto } from '../dto/get-user-artwork.dto';
import { ArtworkEntity } from '../../auth/entity/artwork.entity';

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
  @Get(':artworkId')
  async getSingleArtwork(
    @Param() artWorkIdParamDto: ArtWorkIdParamDto,
  ): Promise<ResponseSingleArtWorkDto> {
    const selectedArtwork = await this.artWorkService.getSingleArtwork(
      artWorkIdParamDto,
    );

    return selectedArtwork;
  }

  @ApiOperation({
    summary: '',
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
  @Get('/owner/:id')
  async listArtworkOfUser(
    @Param() getUserArtWork: GetUserArtWorkDto,
  ): Promise<ArtworkEntity[] | []> {
    const artWorkOwnedByUser = await this.artWorkService.listArtworkOfUser(
      getUserArtWork,
    );

    return artWorkOwnedByUser;
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

  @ApiOperation({
    summary: 'Purchase an artwork for the acvite user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Response will contain meta data of the artwork purchased',
    type: ResponseArtworkPurchaseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to purchase.',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 404,
    description: 'No artwork was found by the specified id.',
    type: NotFoundException,
  })
  @ApiResponse({
    status: 400,
    description: 'Artwork has already been purchased.',
    type: BadRequestException,
  })
  @UseGuards(AuthGuard)
  @Post('/purchase')
  async purchaseArtWork(
    @Body() postBuyArtwork: PostBuyArtworkDto,
  ): Promise<ResponseArtworkPurchaseDto | string> {
    const purchaseResponse = await this.artWorkService.purchaseArtWork(
      postBuyArtwork,
    );
    return purchaseResponse;
  }
}
