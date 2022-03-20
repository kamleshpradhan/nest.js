import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    @Get()
    createBookmarks(){
        
    }
    getBookmarks(){

    }
    getBookmarksById(){

    }
    editBookmarksById(){

    }
    deleteBookmarksById(){

    }
}



