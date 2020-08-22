import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { GetUser } from 'src/auth/get-user.decorator';
// import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
// import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
        ) :Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User, 
        
        ) :Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ) : Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
        ) : Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ) : Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
}
