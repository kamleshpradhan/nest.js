/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
// import {User,Bookmark} from "@prisma/client"
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor (private prisma:PrismaService,private jwt:JwtService, private config:ConfigService){}
  async signup(dto: AuthDto){
    // generate a password hash

    const hash  = await argon.hash(dto.password)
    // save the user in the database
    try{
    const user = await this.prisma.user.create({
      data:{
        email:dto.email,
        hash,
      },
      // select:{
      //   id:true,
      //   email:true,
      //   createdAt:true,
      // },
    })
    // return the user
      // return{msg:"Hello i have signed up"}
      // delete user.hash;
      return user
  }
  catch(err){
    if(err instanceof PrismaClientKnownRequestError){
      if(err.code === 'P2002'){
        throw new ForbiddenException('Credentials Taken')
      }
    }
    throw err;
  }
}
 async signin(dto:AuthDto){
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
       // no user throw exception
    if(!user){
      throw new ForbiddenException(
        'credentials incorrect'
      )
    }
    // compare password
    const pwdMatches = await argon.verify(user.hash,dto.password);
    if(!pwdMatches){
      throw new ForbiddenException(
        'credentials incorrect'
      )
    }
    // password incorrect throw error
    // return user

      return this.signToken(user.id,user.email);
  }
  async signToken(userId:number, email:string,):Promise<{access_token:string}>{
    const payload = {
      sub: userId,
      email
    }
    const secret = this.config.get("JWT_SECRET")
    const token = await this.jwt.signAsync(payload,{
      expiresIn:"15m",
      secret:secret
    })
    return{
      access_token: token,
    }
  }
}
