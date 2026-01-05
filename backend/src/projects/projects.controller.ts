import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Project endpoints
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: User) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.update(id, updateProjectDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    this.projectsService.remove(id, user.id);
    return { message: 'Project deleted successfully' };
  }

  // Task endpoints
  @Post(':id/tasks')
  createTask(
    @Param('id') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.createTask(projectId, createTaskDto, user.id);
  }

  @Get(':id/tasks')
  findAllTasks(@Param('id') projectId: string, @CurrentUser() user: User) {
    return this.projectsService.findAllTasks(projectId, user.id);
  }

  @Get(':id/tasks/:taskId')
  findOneTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.findOneTask(projectId, taskId, user.id);
  }

  @Patch(':id/tasks/:taskId')
  updateTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.updateTask(projectId, taskId, updateTaskDto, user.id);
  }

  @Delete(':id/tasks/:taskId')
  removeTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ) {
    this.projectsService.removeTask(projectId, taskId, user.id);
    return { message: 'Task deleted successfully' };
  }
}
