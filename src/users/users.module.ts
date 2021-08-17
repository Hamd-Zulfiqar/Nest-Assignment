import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/jwt.strategy';
import config from '../../config/keys';
@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), JwtModule.register({secret: config.JWTSecret, signOptions: {expiresIn: "1d"}})],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy],
    exports: [UsersService, JwtStrategy]
})
export class UsersModule {}
