import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { User } from '../auth/user.decorator';
import { Public } from '../auth/public.decorator';

@Controller('resources')
export class ResourcesController {
  private resources = [
    { id: 1, name: 'Resource 1', description: 'Description for resource 1' },
    { id: 2, name: 'Resource 2', description: 'Description for resource 2' },
    { id: 3, name: 'Resource 3', description: 'Description for resource 3' },
  ];

  // Public endpoint - no authentication required
  @Public()
  @Get('public')
  getPublicResources() {
    return {
      message: 'These resources are publicly accessible',
      data: [
        {
          id: 1,
          name: 'Public Resource',
          description: 'This is a public resource',
        },
      ],
    };
  }

  // Protected endpoint - requires authentication
  @Get()
  getAllResources(@User() user: any) {
    return {
      message: 'Protected resources retrieved successfully',
      user: { id: user.userId || user.sub, email: user.email },
      data: this.resources,
    };
  }

  // Protected endpoint - requires authentication
  @Get(':id')
  getResourceById(@Param('id') id: string, @User() user: any) {
    const resourceId = parseInt(id);
    const resource = this.resources.find((r) => r.id === resourceId);

    if (!resource) {
      return { message: 'Resource not found', success: false };
    }

    return {
      message: 'Resource retrieved successfully',
      user: { id: user.userId || user.sub, email: user.email },
      data: resource,
    };
  }

  // Protected endpoint - requires authentication
  @Post()
  createResource(@Body() resourceData: any, @User() user: any) {
    const newId = this.resources.length + 1;
    const newResource = {
      id: newId,
      ...resourceData,
    };

    this.resources.push(newResource);

    return {
      message: 'Resource created successfully',
      user: { id: user.userId || user.sub, email: user.email },
      data: newResource,
    };
  }
}
