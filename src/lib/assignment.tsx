import { ReactNode } from "react";
import { 
    HiDocumentText, 
    HiPencil, 
    HiPaperClip, 
    HiAnnotation, 
    HiDocument 
} from "react-icons/hi";

export type AssignmentType = 'HOMEWORK' | 'QUIZ' | 'TEST' | 'PROJECT' | 'ESSAY' | 'DISCUSSION' | 'PRESENTATION' | 'LAB' | 'OTHER';

export const assignmentTypes: AssignmentType[] = [
    "HOMEWORK", 
    "QUIZ", 
    "TEST", 
    "PROJECT", 
    "DISCUSSION", 
    "PRESENTATION", 
    "LAB", 
    "OTHER"
];

export const getAssignmentIcon = (type: AssignmentType): ReactNode => {
    let Icon = <HiDocumentText />;
    switch (type) {
        case 'ESSAY':
            Icon = <HiDocumentText />;
            break;
        case 'QUIZ':
            Icon = <HiPencil />;
            break;
        case 'HOMEWORK':
            Icon = <HiDocumentText />;
            break;
        case 'PROJECT':
            Icon = <HiPaperClip />;
            break;
        case 'DISCUSSION':
            Icon = <HiAnnotation />;
            break;
        case 'PRESENTATION':
            Icon = <HiDocument />;
            break;
        case 'LAB':
            Icon = <HiDocument />;
            break;
        case 'TEST':
            Icon = <HiPencil />;
            break;
        default:
            Icon = <HiDocumentText />;
    }
    return Icon;
};

export const formatAssignmentType = (type: string): string => {
    return type[0] + type.slice(1).toLowerCase();
}; 