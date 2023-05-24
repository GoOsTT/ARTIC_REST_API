import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtWorkIdParamDto } from '../dto/get-single-artwork-param.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseSingleArtWorkDto } from '../dto/response-single-artwork.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { GetListArtworkDto } from '../dto/get-list-artwork.dto';

@Injectable()
export class ArtworkService {
  constructor(private readonly httpService: HttpService) {}
  async getSingleArtwork(
    artWorkIdParamDto: ArtWorkIdParamDto,
  ): Promise<ResponseSingleArtWorkDto> {
    const { id } = artWorkIdParamDto;

    try {
      const response = await this.fetchSingleArtwork(Number(id));

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

      const reducedArtworks = this.reducedPayload(artworks.data);

      return reducedArtworks;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('The resource could not be found');
      } else {
        console.log('An error occurred:', error);
      }
    }
  }

  //these functions would normally be repository methods/functions if I'd fetch the artworks froum our database
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

  private reducedPayload = (artworks): ResponseSingleArtWorkDto[] => {
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
