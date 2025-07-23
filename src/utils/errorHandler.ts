import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@studious-lms/server';

export interface PrismaErrorInfo {
  message: string;
  code?: string;
  meta?: any;
  details?: string;
}

export function getErrorMessage(error: TRPCClientErrorLike<AppRouter>): string {
  // Check if it's a Prisma error
  if (error.data?.prismaError) {
    const prismaError = error.data.prismaError as PrismaErrorInfo;
    return prismaError.message;
  }
  
  // Check if it's a Zod validation error
  if (error.data?.zodError) {
    const zodError = error.data.zodError;
    const fieldErrors = Object.values(zodError.fieldErrors).flat();
    if (fieldErrors.length > 0) {
      return fieldErrors[0] as string;
    }
    if (zodError.formErrors.length > 0) {
      return zodError.formErrors[0];
    }
  }
  
  // Fallback to the error message
  return error.message || 'An unexpected error occurred';
}

export function getFieldErrors(error: TRPCClientErrorLike<AppRouter>): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  // Handle Zod validation errors
  if (error.data?.zodError) {
    const zodError = error.data.zodError;
    Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
      if (messages && messages.length > 0) {
        fieldErrors[field] = messages[0] as string;
      }
    });
  }
  
  // Handle Prisma errors that might be field-specific
  if (error.data?.prismaError) {
    const prismaError = error.data.prismaError as PrismaErrorInfo;
    
    // Handle unique constraint violations
    if (prismaError.code === 'P2002' && prismaError.meta?.target) {
      const target = Array.isArray(prismaError.meta.target) 
        ? prismaError.meta.target[0] 
        : prismaError.meta.target;
      
      if (target) {
        fieldErrors[target] = `This ${target} is already taken`;
      }
    }
    
    // Handle foreign key constraint violations
    if (prismaError.code === 'P2003' && prismaError.meta?.field_name) {
      fieldErrors[prismaError.meta.field_name] = prismaError.message;
    }
  }
  
  return fieldErrors;
}

export function isPrismaError(error: TRPCClientErrorLike<AppRouter>): boolean {
  return !!error.data?.prismaError;
}

export function isValidationError(error: TRPCClientErrorLike<AppRouter>): boolean {
  return !!error.data?.zodError;
}

export function getErrorType(error: TRPCClientErrorLike<AppRouter>): 'prisma' | 'validation' | 'auth' | 'network' | 'unknown' {
  if (isPrismaError(error)) return 'prisma';
  if (isValidationError(error)) return 'validation';
  if (error.data?.code === 'UNAUTHORIZED') return 'auth';
  if (error.data?.code === 'TIMEOUT' || error.data?.code === 'INTERNAL_SERVER_ERROR') return 'network';
  return 'unknown';
}

// Helper function to get user-friendly field names
export function getFieldDisplayName(fieldName: string): string {
  const fieldMap: Record<string, string> = {
    'username': 'Username',
    'email': 'Email address',
    'password': 'Password',
    'confirmPassword': 'Confirm password',
    'name': 'Name',
    'title': 'Title',
    'content': 'Content',
    'description': 'Description',
    'subject': 'Subject',
    'section': 'Section',
    'color': 'Color',
    'location': 'Location',
    'startTime': 'Start time',
    'endTime': 'End time',
    'dueDate': 'Due date',
    'maxGrade': 'Maximum grade',
    'grade': 'Grade',
    'feedback': 'Feedback',
    'remarks': 'Remarks',
    'syllabus': 'Syllabus',
    'path': 'File path',
    'size': 'File size',
    'type': 'File type',
    'uploadedAt': 'Upload date',
    'verified': 'Verification status',
    'profileId': 'Profile',
    'schoolId': 'School',
    'classId': 'Class',
    'assignmentId': 'Assignment',
    'submissionId': 'Submission',
    'userId': 'User',
    'eventId': 'Event',
    'sessionId': 'Session',
    'thumbnailId': 'Thumbnail',
    'annotationId': 'Annotation',
    'logoId': 'Logo'
  };
  
  return fieldMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
} 