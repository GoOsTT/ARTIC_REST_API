import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from '../../../src/auth/service/auth.service';
import { PostLoginDto } from '../../../src/auth/dto/post-login.dto';
import { UserEntity } from '../../../src/auth/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserRepository = {
  findOne: jest.fn().mockReturnThis(),
};

const mockJwtService = {
  signAsync: jest.fn().mockReturnThis(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return a response with JWT and user object when valid credentials are provided', async () => {
      const user = new UserEntity();
      user.id = 1;
      user.email = 'test@example.com';
      user.password = 'password';

      const loginDto: PostLoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedJwt = 'mockJwtToken';
      const expectedResponse = {
        jwt: expectedJwt,
        user: {
          email: 'test@example.com',
          id: 1,
        },
      };

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValue(expectedJwt);

      const result = await authService.signIn(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        username: 'test@example.com',
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an UnauthorizedException when invalid credentials are provided', async () => {
      const loginDto: PostLoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.signIn(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });
});
