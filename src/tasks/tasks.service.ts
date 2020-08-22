import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
  
    constructor(
        @InjectRepository(TaskRepository)
        private TaskRepository: TaskRepository
    ) {}
    // private tasks: Task[] = [];  
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    getTasks(
        filterDto: GetTasksFilterDto,
        user: User
        ) : Promise<Task[]> {
        return this.TaskRepository.getTasks(filterDto, user);
    }
    async getTaskById(
        id: number,
        user: User
        ): Promise<Task> {
        const found = await this.TaskRepository.findOne({where: { id, userId: user.id}});
        if(!found){
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }


    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
        ): Promise<Task>{
        return this.TaskRepository.createTask(createTaskDto, user)
    }

    async deleteTask(
        id: number,
        user: User
        ): Promise<void> {        
        const result = await this.TaskRepository.delete({ id, userId: user.id});
        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id} not found`);
        }
    }

    async updateTaskStatus(
        id: number, 
        status: TaskStatus,
        user: User
        ) : Promise<Task>{
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }



    // updateTaskStatus(id: string, status: TaskStatus) :Task{
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }



    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }
}
