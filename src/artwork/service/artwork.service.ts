import {
  Injectable,
  NotFoundException,
  Scope,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ArtWorkIdParamDto } from '../dto/get-single-artwork-param.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseSingleArtWorkDto } from '../dto/response-single-artwork.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { GetListArtworkDto } from '../dto/get-list-artwork.dto';
import { PostBuyArtworkDto } from '../dto/post-buy-artwork.dto';
import { ResponseArtworkPurchaseDto } from '../dto/response-buy-artwork.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../auth/entity/user.entity';
import { ArtworkEntity } from '../../auth/entity/artwork.entity';
import { GetUserArtWorkDto } from '../dto/get-user-artwork.dto';
import { Request } from 'express';
import { UserType } from '../../auth/enums/UserType.enum';

@Injectable({ scope: Scope.REQUEST })
export class ArtworkService {
  constructor(
    @InjectRepository(ArtworkEntity)
    private readonly artworkRepository: Repository<ArtworkEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly httpService: HttpService,
  ) {}
  async getSingleArtwork(
    artWorkIdParamDto: ArtWorkIdParamDto,
  ): Promise<ResponseSingleArtWorkDto> {
    const { artworkId } = artWorkIdParamDto;

    try {
      const response = await this.fetchSingleArtwork(Number(artworkId));

      return {
        id: response.data.id || 'Unknown',
        author: response.data.author || 'Unknown',
        title: response.data.title || 'Unknown',
        thumbnail: response.data.thumbnail || 'Unknown',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('The resource could not be found');
      } else {
        console.log('An error occurred:', error);
      }
    }
  }

  async getPaginatedArtworkList(
    getListArtworkDto: GetListArtworkDto,
  ): Promise<ResponseSingleArtWorkDto[]> {
    const { page, limit } = getListArtworkDto;

    try {
      const artworks = await this.fetchPaginatedArtworkList(page, limit);

      const reducedArtworks = this.createArtworkResponse(artworks.data);

      return reducedArtworks;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('The resource could not be found');
      } else {
        console.log('An error occurred:', error);
      }
    }
  }

  async purchaseArtWork(
    postBuyArtwork: PostBuyArtworkDto,
  ): Promise<ResponseArtworkPurchaseDto | string> {
    const { artworkId } = postBuyArtwork;
    const { user } = this.request as any;

    //check if the user is able to purhcase any artwork
    //for now this check is implemented here, but would most likely put into a middleware of a guard for reusability
    const currentUser = await this.userRepository.findOne({
      where: {
        email: user.username,
      },
    });

    if (currentUser.canPurchase === UserType.CANNOT_BUY) {
      throw new UnauthorizedException('User has no permission to buy artwork.');
    }

    //check if the artwork specified with id already exists in the db, if it is return "The artwork has already been purhcased"
    const found = await this.artworkRepository.findOne({
      where: {
        museumId: artworkId,
      },
    });

    if (found) {
      throw new BadRequestException('Artwork has already been purchased.');
    }

    try {
      //fetch the artwork by id with this.getSingleArtwork
      const artwork = await this.fetchSingleArtwork(artworkId);

      //map the fetched data into an ArtworkEntity
      const purchasedArtwork = new ArtworkEntity();
      purchasedArtwork.museumId = artwork.data.id;
      purchasedArtwork.description =
        artwork.data.thumbnail.alt_text || 'Unkwnown';
      purchasedArtwork.name = artwork.data.title || 'Unknown';
      purchasedArtwork.owner = currentUser;

      //save the artwork to the user into the db
      const saved = await this.artworkRepository.save(purchasedArtwork);

      //return the single artwork's meta data
      if (saved) {
        return saved;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('The resource could not be found');
      } else {
        console.log('An error occurred:', error);
      }
    }
  }

  async listArtworkOfUser(
    getUserArtWork: GetUserArtWorkDto,
  ): Promise<ArtworkEntity[] | []> {
    const { id } = getUserArtWork;

    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['artworks'],
    });

    if (!user) {
      throw new NotFoundException('No user was found with this id.');
    }

    //if a user exists, and the user does not own any artwork the response will be an empty array, this return
    // could be also a string with a different status message, this is really up to the frontend implementations and
    //I feel like would be better discussed but for now it returns an empty array
    // this would not make the frontend code obsolete when lets say they want to iterate through the response
    // we could set up tRPC too to have cnsistent types between front and backend
    return user.artworks;
  }

  //these functions would normally be repository methods/functions if I'd fetch the artworks from our database
  private async fetchSingleArtwork(id: number) {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://api.artic.edu/api/v1/artworks/${id}`).pipe(
        catchError(() => {
          throw new NotFoundException('The resource could not be found');
        }),
      ),
    );

    if (data) {
      return data;
    } else {
      throw new NotFoundException('The resource could not be found');
    }
  }

  private async fetchPaginatedArtworkList(
    pageNumber: number,
    pageSize: number,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${pageSize}`,
        )
        .pipe(
          catchError(() => {
            throw new NotFoundException('The resource could not be found');
          }),
        ),
    );

    if (data) {
      return data;
    } else {
      throw new NotFoundException('The resource could not be found');
    }
  }

  private createArtworkResponse = (artworks): ResponseSingleArtWorkDto[] => {
    return artworks.map((artwork): ResponseSingleArtWorkDto => {
      const { id, author, title, thumbnail } = artwork;
      return {
        id: id || 'Unknown',
        author: author || 'Unknown',
        title: title || 'Unknown',
        thumbnail: thumbnail || 'Unknown',
      };
    });
  };
}
