import { HiDocument, HiUser, HiAcademicCap, HiFolder } from "react-icons/hi";
import FileDownload from "./FileDownload";
import Shelf from "../ui/Shelf";
import { trpc } from "@/utils/trpc";
import Skeleton from "../ui/Skeleton";

interface OrganizedFilesProps {
    classId: string;
}

export default function OrganizedFiles({ classId }: OrganizedFilesProps) {
    const { data: files, isLoading, error } = trpc.class.getFiles.useQuery({ classId });

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">Error loading files: {error.message}</div>
        );
    }

    if (!files || files.length === 0) {
        return (
            <div className="text-center text-foreground-muted py-12">
                <HiDocument className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Files</h3>
                <p>No files have been uploaded to assignments in this class yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-3">
            {files.map((assignment: any) => (
                <Shelf
                    key={assignment.id}
                    label={
                        <div className="flex items-center space-x-3 py-3">
                            <div>
                                <div className="font-semibold">{assignment.title}</div>
                            </div>
                        </div>
                    }
                >
                    {/* Teacher Attachments */}
                    {assignment.teacherAttachments.length > 0 && (
                        <Shelf
                            label={
                                <div className="flex items-center space-x-2">
                                    <HiAcademicCap className="w-4 h-4" />
                                    <span className="font-medium">
                                        Teacher Attachments ({assignment.teacherAttachments.length})
                                    </span>
                                </div>
                            }
                            content={null}
                        >
                            {assignment.teacherAttachments.map((file: any) => (
                                <div key={file.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-muted">
                                    <FileDownload
                                        src={file.id}
                                        name={file.name}
                                        type={file.type}
                                        thumbnailId={file.thumbnailId}
                                    />
                                </div>
                            ))}
                        </Shelf>
                    )}

                    {/* Student Submissions */}
                    {assignment.students.length > 0 && (
                        <div className="space-y-2">
                            {assignment.students.map((student: any) => (
                                <Shelf
                                    key={student.id}
                                    label={
                                        <div className="flex items-center space-x-2">
                                            <HiUser className="w-4 h-4 text-green-500" />
                                            <span className="font-medium">{student.username}</span>
                                        </div>
                                    }
                                    content={
                                        <div className="text-sm text-foreground-muted">
                                            {student.attachments.length} files, {student.annotations.length} annotations
                                        </div>
                                    }
                                >
                                    {/* Student Attachments */}
                                    {student.attachments.length > 0 && (
                                        <Shelf
                                            label={
                                                <span className="font-medium text-sm text-green-600 dark:text-green-400">
                                                    Attachments ({student.attachments.length})
                                                </span>
                                            }
                                            content={null}
                                        >
                                            {student.attachments.map((file: any) => (
                                                <div key={file.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-muted">
                                                    <HiDocument className="w-3 h-3 text-foreground-muted" />
                                                    <FileDownload
                                                        src={file.id}
                                                        name={file.name}
                                                        type={file.type}
                                                        thumbnailId={file.thumbnailId}
                                                    />
                                                </div>
                                            ))}
                                        </Shelf>
                                    )}

                                    {/* Student Annotations */}
                                    {student.annotations.length > 0 && (
                                        <Shelf
                                            label={
                                                <span className="font-medium text-sm text-purple-600 dark:text-purple-400">
                                                    Annotations ({student.annotations.length})
                                                </span>
                                            }
                                            content={null}
                                        >
                                            {student.annotations.map((file: any) => (
                                                <div key={file.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-muted">
                                                    <HiDocument className="w-3 h-3 text-foreground-muted" />
                                                    <FileDownload
                                                        src={file.id}
                                                        name={file.name}
                                                        type={file.type}
                                                        thumbnailId={file.thumbnailId}
                                                    />
                                                </div>
                                            ))}
                                        </Shelf>
                                    )}

                                    {student.attachments.length === 0 && student.annotations.length === 0 && (
                                        <div className="text-sm text-foreground-muted ml-4">
                                            No files submitted
                                        </div>
                                    )}
                                </Shelf>
                            ))}
                        </div>
                    )}

                    {assignment.teacherAttachments.length === 0 && assignment.students.length === 0 && (
                        <div className="text-sm text-foreground-muted">
                            No files uploaded for this assignment
                        </div>
                    )}
                </Shelf>
            ))}
        </div>
    );
} 