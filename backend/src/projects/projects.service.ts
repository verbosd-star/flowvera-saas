import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Project, ProjectStatus } from './entities/project.entity';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProjectsService {
  private projects: Map<string, Project> = new Map();
  private tasks: Map<string, Task> = new Map();

  // Project methods
  create(createProjectDto: CreateProjectDto, userId: string): Project {
    const project: Project = {
      id: randomUUID(),
      name: createProjectDto.name,
      description: createProjectDto.description,
      status: createProjectDto.status || ProjectStatus.ACTIVE,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.set(project.id, project);
    return project;
  }

  findAll(userId: string): Project[] {
    return Array.from(this.projects.values()).filter(
      (project) => project.ownerId === userId,
    );
  }

  findOne(id: string, userId: string): Project {
    const project = this.projects.get(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }
    return project;
  }

  update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Project {
    const project = this.findOne(id, userId);
    
    const updatedProject = {
      ...project,
      ...updateProjectDto,
      updatedAt: new Date(),
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  remove(id: string, userId: string): void {
    const project = this.findOne(id, userId);
    
    // Delete all tasks associated with this project
    const projectTasks = this.findAllTasks(id, userId);
    projectTasks.forEach((task) => this.tasks.delete(task.id));
    
    this.projects.delete(id);
  }

  // Task methods
  createTask(projectId: string, createTaskDto: CreateTaskDto, userId: string): Task {
    const project = this.findOne(projectId, userId);

    const task: Task = {
      id: randomUUID(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      projectId: project.id,
      assignedTo: createTaskDto.assignedTo,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  findAllTasks(projectId: string, userId: string): Task[] {
    // Verify user has access to the project
    this.findOne(projectId, userId);
    
    return Array.from(this.tasks.values()).filter(
      (task) => task.projectId === projectId,
    );
  }

  findOneTask(projectId: string, taskId: string, userId: string): Task {
    // Verify user has access to the project
    this.findOne(projectId, userId);
    
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    if (task.projectId !== projectId) {
      throw new ForbiddenException('Task does not belong to this project');
    }
    return task;
  }

  updateTask(
    projectId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Task {
    const task = this.findOneTask(projectId, taskId, userId);
    
    const updatedTask = {
      ...task,
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : task.dueDate,
      updatedAt: new Date(),
    };

    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  removeTask(projectId: string, taskId: string, userId: string): void {
    const task = this.findOneTask(projectId, taskId, userId);
    this.tasks.delete(task.id);
  }
}
