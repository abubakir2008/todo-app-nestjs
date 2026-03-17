import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userPepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const exists = await this.userPepo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Почта Уже занята');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userPepo.create({ email: dto.email, password: hash });
    await this.userPepo.save(user);
    return { message: 'Пользователь создан' };
  }

  async login(dto: AuthDto) {
    const user = await this.userPepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Неверный email или пароль');

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { access_token: token };
  }
}
