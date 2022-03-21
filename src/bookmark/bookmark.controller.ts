import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarksDto } from './dto';
import { EditBookmarksDto } from './dto';
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(
        private bookmarkService:BookmarkService
    ){

    }
    @Post()
    createBookmarks(
        @GetUser('id') userId:number,
        @Body() dto:CreateBookmarksDto){
            return this.bookmarkService.createBookmarks(
                userId,
                dto
            )
        
    }
    @Get()
    getBookmarks(@GetUser('id') userId:number){
        return this.bookmarkService.getBookmarks(
            userId,
        )
    }
    @Get(':id')
    getBookmarksById(
        @GetUser('id') userId:number,
        @Param('id',ParseIntPipe) bookmarkId:number,
        @Body() dto:CreateBookmarksDto){
            return this.bookmarkService.getBookmarksById(
                userId,
                bookmarkId,
            )
    }

    @Patch(":id")
    editBookmarksById(
        @GetUser('id') userId:number,
        @Param('id',ParseIntPipe) bookmarkId:number,
        @Body() dto:EditBookmarksDto){
            return this.bookmarkService.editBookmarksById(
                userId,
                bookmarkId,
                dto
            )
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    deleteBookmarksById(@GetUser('id') userId:number,
    @Param('id',ParseIntPipe) bookmarkId:number,){
        return this.bookmarkService.deleteBookmarksById(
            userId,
            bookmarkId
        )
    }
}



