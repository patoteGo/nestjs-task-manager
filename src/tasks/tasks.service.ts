import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'dns';
import { stat } from 'fs';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

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
    getTasks(filterDto: GetTasksFilterDto) : Promise<Task[]> {
        return this.TaskRepository.getTasks(filterDto);
    }
    async getTaskById(id: number): Promise<Task> {
        const found = await this.TaskRepository.findOne(id);
        if(!found){
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        return this.TaskRepository.createTask(createTaskDto)
    }

    async deleteTask(id: string): Promise<string> {        
        return this.TaskRepository.deleteTask(id);
    }

    async updateTaskStatus(id: number, status: TaskStatus) : Promise<Task>{
        const task = await this.getTaskById(id);
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
