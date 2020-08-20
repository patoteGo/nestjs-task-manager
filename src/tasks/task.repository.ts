import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";

import { TaskStatus } from "./task-status.enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import { NotFoundException } from "@nestjs/common";
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository <Task>{

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');
        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%`})
        }

        const tasks = await query.getMany();
        return tasks;

    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title  = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save()
        return task;
    }

    async deleteTask(id: string): Promise<string>{
        const found = await this.findOne(id);
        if(!found){
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        await this.remove(found);
        return `erase Task ${id}`;
    }
}
