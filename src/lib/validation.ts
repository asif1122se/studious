// // Common validation functions for forms

import e from "cors";

// export const validateEmail = (email: string): string | null => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) return 'Email is required';
//     if (!emailRegex.test(email)) return 'Please enter a valid email address';
//     return null;
// };

// export const validatePassword = (password: string): string | null => {
//     if (!password) return 'Password is required';
//     if (password.length < 6) return 'Password must be at least 6 characters';
//     return null;
// };

// export const validateStrongPassword = (password: string): string | null => {
//     if (!password) return 'Password is required';
//     if (password.length < 8) return 'Password must be at least 8 characters';
//     if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
//     if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
//     if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
//     if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
//     return null;
// };

// export const validateRequired = (value: string, fieldName: string): string | null => {
//     if (!value?.trim()) return `${fieldName} is required`;
//     return null;
// };

// export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
//     if (value && value.length < minLength) {
//         return `${fieldName} must be at least ${minLength} characters`;
//     }
//     return null;
// };

// export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
//     if (value && value.length > maxLength) {
//         return `${fieldName} must be no more than ${maxLength} characters`;
//     }
//     return null;
// };

// export const validateUrl = (url: string): string | null => {
//     if (!url) return null; // URL is optional
//     try {
//         new URL(url);
//         return null;
//     } catch {
//         return 'Please enter a valid URL';
//     }
// };

// export const validatePhoneNumber = (phone: string): string | null => {
//     if (!phone) return null; // Phone is optional
//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
//         return 'Please enter a valid phone number';
//     }
//     return null;
// };

// export const validateDate = (date: string): string | null => {
//     if (!date) return null; // Date is optional
//     const dateObj = new Date(date);
//     if (isNaN(dateObj.getTime())) {
//         return 'Please enter a valid date';
//     }
//     return null;
// };

// export const validateFutureDate = (date: string): string | null => {
//     const dateError = validateDate(date);
//     if (dateError) return dateError;
    
//     const dateObj = new Date(date);
//     const now = new Date();
//     if (dateObj <= now) {
//         return 'Date must be in the future';
//     }
//     return null;
// };

// export const validateFileSize = (file: File, maxSizeMB: number): string | null => {
//     const maxSizeBytes = maxSizeMB * 1024 * 1024;
//     if (file.size > maxSizeBytes) {
//         return `File size must be less than ${maxSizeMB}MB`;
//     }
//     return null;
// };

// export const validateFileType = (file: File, allowedTypes: string[]): string | null => {
//     if (!allowedTypes.includes(file.type)) {
//         return `File type must be one of: ${allowedTypes.join(', ')}`;
//     }
//     return null;
// };

// // Password strength checker
// export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
//     let score = 0;
    
//     if (password.length >= 8) score++;
//     if (/[A-Z]/.test(password)) score++;
//     if (/[a-z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^A-Za-z0-9]/.test(password)) score++;
    
//     const strengthMap = {
//         0: { label: 'Very Weak', color: 'text-red-500' },
//         1: { label: 'Weak', color: 'text-red-400' },
//         2: { label: 'Fair', color: 'text-yellow-500' },
//         3: { label: 'Good', color: 'text-yellow-400' },
//         4: { label: 'Strong', color: 'text-green-500' },
//         5: { label: 'Very Strong', color: 'text-green-600' }
//     };
    
//     return { score, ...strengthMap[score as keyof typeof strengthMap] };
// };

// // Form validation helper
// export interface ValidationRule {
//     validator: (value: any, formData?: Record<string, any>) => string | null;
//     message?: string;
// }

// export interface ValidationSchema {
//     [fieldName: string]: ValidationRule[];
// }

// export const validateForm = (data: Record<string, any>, schema: ValidationSchema): Record<string, string> => {
//     const errors: Record<string, string> = {};
    
//     Object.keys(schema).forEach(fieldName => {
//         const value = data[fieldName];
//         const rules = schema[fieldName];
        
//         for (const rule of rules) {
//             const error = rule.validator(value, data);
//             if (error) {
//                 errors[fieldName] = rule.message || error;
//                 break; // Stop at first error for this field
//             }
//         }
//     });
    
//     return errors;
// };

// // Common validation schemas
// export const loginSchema: ValidationSchema = {
//     email: [
//         { validator: (value) => validateEmail(value) }
//     ],
//     password: [
//         { validator: (value) => validatePassword(value) }
//     ]
// };

// export const signupSchema: ValidationSchema = {
//     email: [
//         { validator: (value) => validateEmail(value) }
//     ],
//     password: [
//         { validator: (value) => validateStrongPassword(value) }
//     ],
//     confirmPassword: [
//         { 
//             validator: (value, formData) => {
//                 if (value !== formData?.password) {
//                     return 'Passwords do not match';
//                 }
//                 return null;
//             }
//         }
//     ],
//     username: [
//         { validator: (value) => validateRequired(value, 'Username') },
//         { validator: (value) => validateMinLength(value, 3, 'Username') },
//         { validator: (value) => validateMaxLength(value, 20, 'Username') }
//     ]
// };

// export const classSchema: ValidationSchema = {
//     name: [
//         { validator: (value) => validateRequired(value, 'Class name') },
//         { validator: (value) => validateMinLength(value, 2, 'Class name') },
//         { validator: (value) => validateMaxLength(value, 100, 'Class name') }
//     ],
//     description: [
//         { validator: (value) => validateMaxLength(value, 500, 'Description') }
//     ]
// };

// export const assignmentSchema: ValidationSchema = {
//     title: [
//         { validator: (value) => validateRequired(value, 'Assignment title') },
//         { validator: (value) => validateMinLength(value, 2, 'Assignment title') },
//         { validator: (value) => validateMaxLength(value, 200, 'Assignment title') }
//     ],
//     description: [
//         { validator: (value) => validateMaxLength(value, 1000, 'Description') }
//     ],
//     dueDate: [
//         { validator: (value) => validateFutureDate(value) }
//     ]
// }; 

interface CallbackValidation {
    key: string;
    callback: (value: string) => boolean; // @note: where false is invalid
}

export const validate = (requiredKeys: (string | CallbackValidation)[], body: { [k: string]: any }) => {
    const missing: string[] = [];
    requiredKeys.forEach((key) => {
        if (typeof key === "string")
            if (key in body) {
                console.log(body, body[key])
                if(!body[key].split('').length)
                    missing.push(key);
            } else {
                missing.push(key);
            }
        else 
            if (key.key in body) {
                if (!body[key.key].split('').length) 
                    missing.push(key.key)
                if (!key.callback(body[key.key]))
                    missing.push(key.key)
            } else {
                missing.push(key.key)
            }
    })
    if (missing.length) return {valid: false, remark: `The fields ${missing.join(', ')} are required.`};
    else return {valid: true};
}