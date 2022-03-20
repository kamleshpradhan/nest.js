import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });


describe("App e2e",()=>{
  let app: INestApplication;
  let prisma = PrismaService
  beforeAll(async()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
    }),
    );
    await app.init()
    await app.listen(3333)
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http:localhost:3333')
  });
  afterAll(()=>{
    app.close();
  })
  // it.todo("should pass");

  describe('Auth',()=>{
    const dto: AuthDto={
      email:"car@gmail.com",
      password:"car"
    }
    describe('Signup',()=>{
      it('Should throw exception if email empty',()=>{
        return pactum.spec().post('/auth/signup').withBody({password:dto.password}).expectStatus(400);
      })
      it('Should throw exception if password empty',()=>{
        return pactum.spec().post('/auth/signup').withBody({email:dto.email}).expectStatus(400);
      })
      it("Should Signup",()=>{
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })
    })
    describe('Signin',()=>{
      it('Should throw exception if email empty',()=>{
        return pactum.spec().post('/auth/signin').withBody({password:dto.password}).expectStatus(400);
      })
      it("Should throw exceprion if password empty",()=>{
        return pactum.spec().post('/auth/signin').withBody({email:dto.email}).expectStatus(400)
      })
      it("Should Signin",()=>{
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt','access_token')
      })
    })
  });
  describe('User',()=>{
    describe('Get me',()=>{
      it('should get current user',()=>{
        return pactum.spec().get('/users/me').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200).inspect();
      })

    })
    describe('Edit User',()=>{
      const dto:EditUserDto={
        firstName: "Sam",
        email: "Sam@gmail.com",
        lastName: 'max'
      }
      it('should update current user',()=>{
        return pactum.spec().
        patch('/users')
        .withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email);
      })
    })
  })
  describe('Bookmarks',()=>{
    describe('create bookmarks',()=>{})
    describe('get bookmarks',()=>{})
    describe('get bookmarks by id',()=>{

    })
    describe('edit bookmarks by id',()=>{

    })
    describe('delete v=bookmarks by id',()=>{

    })
  })
});