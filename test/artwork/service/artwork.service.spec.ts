import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ArtworkService } from '../../../src/artwork/service/artwork.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { ResponseSingleArtWorkDto } from '../../../src/artwork/dto/response-single-artwork.dto';
import { GetListArtworkDto } from '../../../src/artwork/dto/get-list-artwork.dto';

describe('ArtworkService', () => {
  let artworkService: ArtworkService;
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpService();
    artworkService = new ArtworkService(httpService);
  });

  describe('getSingleArtwork', () => {
    it('should return a single artwork when a valid id is provided', async () => {
      // Mock the httpService.get() method
      const artworkId = 1;
      const mockResponse = {
        data: {
          id: artworkId,
          author: 'Author 1',
          title: 'Artwork 1',
          thumbnail: 'thumbnail-url-1',
        },
      };
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(mockResponse);

      // Make the request
      const result = await artworkService.getSingleArtwork({ id: artworkId });

      // Expectations
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://api.artic.edu/api/v1/artworks/${artworkId}`,
      );
    });

    it('should throw NotFoundException when no artwork is found with the provided id', async () => {
      // Mock the httpService.get() method to throw NotFoundException
      const artworkId = 1;
      jest
        .spyOn(httpService, 'get')
        .mockRejectedValueOnce(new NotFoundException('Artwork not found'));

      // Expect the method to throw NotFoundException
      await expect(
        artworkService.getSingleArtwork({ id: artworkId }),
      ).rejects.toThrowError(NotFoundException);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://api.artic.edu/api/v1/artworks/${artworkId}`,
      );
    });
  });
});
