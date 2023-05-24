import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkController } from '../../../src/artwork/controller/artwork.controller';
import { ArtworkService } from '../../../src/artwork/service/artwork.service';
import { ResponseSingleArtWorkDto } from '../../../src/artwork/dto/response-single-artwork.dto';
import { NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

//The test cases are following the AAA appraoach

//I usually mock these values and also mock return values of 3rd party functions in the global scope
const mockSingleArtWork: ResponseSingleArtWorkDto = {
  id: 2,
  title: 'test',
  author: 'test',
  thumbnail: 'test',
};

describe('ArtworkController', () => {
  let controller: ArtworkController;
  let service: ArtworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworkController],
      providers: [
        ArtworkService,
        {
          provide: HttpService,
          useValue: new HttpService(
            axios.create({ baseURL: 'https://api.artic.edu' }),
          ),
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<ArtworkController>(ArtworkController);
    service = module.get<ArtworkService>(ArtworkService);
  });
  describe('getSingleArtwork', () => {
    it('should return a single artwork when a valid id is provided', async () => {
      jest
        .spyOn(service, 'getSingleArtwork')
        .mockResolvedValue(mockSingleArtWork);

      const result = await controller.getSingleArtwork({ id: 1 });

      expect(result).toEqual(mockSingleArtWork);
      expect(service.getSingleArtwork).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when no artwork is found with the provided id', async () => {
      jest
        .spyOn(service, 'getSingleArtwork')
        .mockRejectedValue(new NotFoundException('No artwork found'));

      await expect(
        controller.getSingleArtwork({ id: null }),
      ).rejects.toThrowError(NotFoundException);
      expect(service.getSingleArtwork).toHaveBeenCalledWith({
        id: null,
      });
    });
  });

  describe('getPaginatedArtworkList', () => {
    it('should return a list of artworks when valid query parameters are provided', async () => {
      const mockArtworks = [
        { id: 2, title: 'test', author: 'test', thumbnail: 'test' },
        { id: 2, title: 'test', author: 'test', thumbnail: 'test' },
      ];
      jest
        .spyOn(service, 'getPaginatedArtworkList')
        .mockResolvedValue(mockArtworks);

      const result = await controller.getPaginatedArtworkList({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(mockArtworks);
      expect(service.getPaginatedArtworkList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('should throw NotFoundException when no artworks are found with the provided query parameters', async () => {
      jest
        .spyOn(service, 'getPaginatedArtworkList')
        .mockRejectedValue(new NotFoundException('No artworks found'));

      await expect(
        controller.getPaginatedArtworkList({ page: 1, limit: 10 }),
      ).rejects.toThrowError(NotFoundException);
      expect(service.getPaginatedArtworkList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });
});
