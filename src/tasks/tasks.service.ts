import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
// import * as uuid from 'uuid/dist/v3'
import {v1 as uuid} from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];
    
    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        
        const found =  this.tasks.find(task => id === task.id);
        if(!found){
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }

    createTask(CreateTaskDto : CreateTaskDto): Task{
        const { title, description } = CreateTaskDto;   

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus) :Task{
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }



    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}
