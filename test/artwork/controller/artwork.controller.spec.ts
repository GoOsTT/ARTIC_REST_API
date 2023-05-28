import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkController } from '../../../src/artwork/controller/artwork.controller';
import { ArtworkService } from '../../../src/artwork/service/artwork.service';
import { ResponseSingleArtWorkDto } from '../../../src/artwork/dto/response-single-artwork.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { GetUserArtWorkDto } from '../../../src/artwork/dto/get-user-artwork.dto';
import { PostBuyArtworkDto } from '../../../src/artwork/dto/post-buy-artwork.dto';

//The test cases are following the AAA appraoach

const MockArtworkService = {
  getSingleArtwork: jest.fn().mockReturnThis(),
  listArtworkOfUser: jest.fn().mockReturnThis(),
  getPaginatedArtworkList: jest.fn().mockReturnThis(),
  purchaseArtWork: jest.fn().mockReturnThis(),
};

//I usually mock these values and also mock return values of 3rd party functions in the global scope
const mockSingleArtWork: ResponseSingleArtWorkDto = {
  id: 2,
  title: 'test',
  author: 'test',
  thumbnail: 'test',
};

describe('ArtworkController', () => {
  let controller: ArtworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworkController],
      providers: [
        {
          provide: ArtworkService,
          useValue: MockArtworkService,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<ArtworkController>(ArtworkController);
  });
  describe('getSingleArtwork', () => {
    it('should return a single artwork when a valid id is provided', async () => {
      jest
        .spyOn(MockArtworkService, 'getSingleArtwork')
        .mockResolvedValue(mockSingleArtWork);

      const result = await controller.getSingleArtwork({ artworkId: 1 });

      expect(result).toEqual(mockSingleArtWork);
      expect(MockArtworkService.getSingleArtwork).toHaveBeenCalledWith({
        artworkId: 1,
      });
    });

    it('should throw NotFoundException when no artwork is found with the provided id', async () => {
      jest
        .spyOn(MockArtworkService, 'getSingleArtwork')
        .mockRejectedValue(new NotFoundException('No artwork found'));

      await expect(
        controller.getSingleArtwork({ artworkId: null }),
      ).rejects.toThrowError(NotFoundException);
      expect(MockArtworkService.getSingleArtwork).toHaveBeenCalledWith({
        artworkId: null,
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
        .spyOn(MockArtworkService, 'getPaginatedArtworkList')
        .mockResolvedValue(mockArtworks);

      const result = await controller.getPaginatedArtworkList({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(mockArtworks);
      expect(MockArtworkService.getPaginatedArtworkList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('should throw NotFoundException when no artworks are found with the provided query parameters', async () => {
      jest
        .spyOn(MockArtworkService, 'getPaginatedArtworkList')
        .mockRejectedValue(new NotFoundException('No artworks found'));

      await expect(
        controller.getPaginatedArtworkList({ page: 1, limit: 10 }),
      ).rejects.toThrowError(NotFoundException);
      expect(MockArtworkService.getPaginatedArtworkList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    describe('listArtworkOfUser', () => {
      it('should call the listArtworkOfUser method of the service with the correct parameters', async () => {
        const getUserArtWorkDto: GetUserArtWorkDto = { id: 1 };

        const serviceSpy = jest
          .spyOn(MockArtworkService, 'listArtworkOfUser')
          .mockResolvedValue([]);

        await controller.listArtworkOfUser(getUserArtWorkDto);

        expect(serviceSpy).toHaveBeenCalledWith(getUserArtWorkDto);
      });
    });

    describe('purchaseArtWork', () => {
      it('should call the purchaseArtWork method of the service with the correct parameters', async () => {
        const postBuyArtwork: PostBuyArtworkDto = { artworkId: 4 };

        const serviceSpy = jest
          .spyOn(MockArtworkService, 'purchaseArtWork')
          .mockResolvedValue([]);

        await controller.purchaseArtWork(postBuyArtwork);

        expect(serviceSpy).toHaveBeenCalledWith(postBuyArtwork);
      });
    });
  });
});
