import { ArtworkService } from '../../../src/artwork/service/artwork.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ArtworkEntity } from '../../../src/auth/entity/artwork.entity';
import { UserEntity } from '../../../src//auth/entity/user.entity';
import { Request } from 'express';
import { UserType } from '../../../src/auth/enums/UserType.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { PostBuyArtworkDto } from 'src/artwork/dto/post-buy-artwork.dto';

const mockSingleArtWork = {
  data: {
    id: 2,
    title: 'test',
    author: 'test',
    thumbnail: 'test',
  },
};

const mockRequest: Partial<Request> = {
  user: {
    username: 'test@example.com',
    canPurchase: 1,
  },
};

const mockArtworkRepository = {
  save: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
};
const mockUserRepository = {
  findOne: jest.fn().mockReturnThis(),
};

describe('ArtworkService', () => {
  describe('ArtworkController', () => {
    let artworkService: ArtworkService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [
          {
            provide: getRepositoryToken(ArtworkEntity),
            useValue: mockArtworkRepository,
          },
          {
            provide: getRepositoryToken(UserEntity),
            useValue: mockUserRepository,
          },
          {
            provide: REQUEST,
            useValue: mockRequest,
          },
          ArtworkService,
        ],
      }).compile();

      artworkService = await module.resolve<ArtworkService>(ArtworkService);
    });

    describe('getSingleArtwork', () => {
      it('should return a single artwork when a valid id is provided', async () => {
        const fetchSingleArtworkSpy = jest.spyOn(
          artworkService as any,
          'fetchSingleArtwork',
        );

        fetchSingleArtworkSpy.mockResolvedValue(mockSingleArtWork);

        const result = await artworkService.getSingleArtwork({ artworkId: 2 });

        expect(result).toEqual({
          id: 2,
          author: 'test',
          title: 'test',
          thumbnail: 'test',
        });
      });
    });

    describe('getPaginatedArtworkList', () => {
      it('should return a list of artworks', async () => {
        const artworks = jest.spyOn(
          artworkService as any,
          'fetchPaginatedArtworkList',
        );

        artworks.mockResolvedValue([mockSingleArtWork]);

        const reducedArtworks = jest.spyOn(
          artworkService as any,
          'createArtworkResponse',
        );

        reducedArtworks.mockResolvedValueOnce([
          {
            id: 2,
            author: 'test',
            title: 'test',
            thumbnail: 'test',
          },
        ]);

        const result = await artworkService.getPaginatedArtworkList({
          limit: 2,
          page: 1,
        });

        expect(result).toEqual([
          {
            id: 2,
            author: 'test',
            title: 'test',
            thumbnail: 'test',
          },
        ]);
      });
    });
    describe('purchaseArtWork', () => {
      it('should purchase an artwork successfully', async () => {
        // Mock data
        const postBuyArtworkDto: PostBuyArtworkDto = {
          artworkId: 2,
        };
        const mockUser = new UserEntity();
        mockUser.canPurchase = UserType.CAN_BUY;
        const mockArtwork = new ArtworkEntity();
        const mockSavedArtwork = new ArtworkEntity();
        artworkService['fetchSingleArtwork'] = jest
          .fn()
          .mockResolvedValue(mockArtwork);
        mockArtworkRepository.save.mockResolvedValue(mockSavedArtwork);

        // Mock user repository
        mockUserRepository.findOne.mockResolvedValue(mockUser);

        // Mock artwork repository
        mockArtworkRepository.findOne.mockResolvedValueOnce(null);

        const fetchSingleArtworkSpy = jest.spyOn(
          artworkService as any,
          'fetchSingleArtwork',
        );

        fetchSingleArtworkSpy.mockResolvedValue(mockSingleArtWork);

        // Perform the purchase
        const result = await artworkService.purchaseArtWork(postBuyArtworkDto);

        // Assertions
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: { email: expect.any(String) },
        });
        expect(mockArtworkRepository.findOne).toHaveBeenCalledWith({
          where: { museumId: postBuyArtworkDto.artworkId },
        });
        expect(artworkService['fetchSingleArtwork']).toHaveBeenCalledWith(
          postBuyArtworkDto.artworkId,
        );
        expect(mockArtworkRepository.save).toHaveBeenCalledWith(
          expect.any(ArtworkEntity),
        );
        expect(result).toBe(mockSavedArtwork);
      });

      it('should throw UnauthorizedException for user with no permission to buy artwork', async () => {
        // Mock data
        const postBuyArtworkDto: PostBuyArtworkDto = {
          artworkId: 2,
        };
        const mockUser = new UserEntity();
        mockUser.canPurchase = UserType.CANNOT_BUY;
        mockUserRepository.findOne.mockResolvedValue(mockUser);

        // Assertions
        await expect(
          artworkService.purchaseArtWork(postBuyArtworkDto),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw BadRequestException for already purchased artwork', async () => {
        // Mock data
        const postBuyArtworkDto: PostBuyArtworkDto = {
          artworkId: 2,
        };
        const mockUser = new UserEntity();
        mockUser.canPurchase = UserType.CAN_BUY;
        mockArtworkRepository.findOne.mockResolvedValue(new ArtworkEntity());

        const fetchSingleArtworkSpy = jest.spyOn(
          artworkService as any,
          'fetchSingleArtwork',
        );

        fetchSingleArtworkSpy.mockResolvedValue(null);

        // Assertions
        await expect(
          artworkService.purchaseArtWork(postBuyArtworkDto),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });
});
