"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { HiSparkles, HiSave, HiX, HiRefresh, HiLightBulb, HiAcademicCap, HiDocumentText } from "react-icons/hi";
import { MdAssignment, MdSchool } from "react-icons/md";
import { trpc } from "@/utils/trpc";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textbox from "@/components/ui/Textbox";
import Card from "@/components/ui/Card";
import IconFrame from "@/components/ui/IconFrame";
import { validate } from "@/lib/validation";

type LabDraftType = 'LAB' | 'HOMEWORK' | 'QUIZ' | 'TEST' | 'PROJECT' | 'ESSAY' | 'DISCUSSION' | 'PRESENTATION' | 'OTHER';

interface AIGeneratorProps {
    classId: string;
    type: LabDraftType;
    onSuccess: () => void;
}

interface GenerationPrompt {
    topic: string;
    subject: string;
    gradeLevel: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    learningObjectives: string;
    additionalContext: string;
}

export default function AIGenerator({ classId, type, onSuccess }: AIGeneratorProps) {
    const dispatch = useDispatch();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const REQUIRED_KEYS = [
        'topic',
        'subject',
        'gradeLevel',
    ];

    const createLabDraft = trpc.class.createLabDraft.useMutation();
    const [generatedContent, setGeneratedContent] = useState('');
    const [prompt, setPrompt] = useState<GenerationPrompt>({
        topic: '',
        subject: '',
        gradeLevel: '',
        duration: '',
        difficulty: 'beginner',
        learningObjectives: '',
        additionalContext: '',
    });

    const getTypeIcon = (type: LabDraftType) => {
        switch (type) {
            case 'LAB':
                return <MdAssignment className="h-5 w-5 text-blue-500" />;
            case 'PROJECT':
                return <MdSchool className="h-5 w-5 text-green-500" />;
            case 'QUIZ':
                return <HiAcademicCap className="h-5 w-5 text-orange-500" />;
            case 'HOMEWORK':
                return <HiAcademicCap className="h-5 w-5 text-purple-500" />;
            case 'TEST':
                return <HiDocumentText className="h-5 w-5 text-red-500" />;
            default:
                return <HiAcademicCap className="h-5 w-5 text-gray-500" />;
        }
    };

    const getTypeLabel = (type: LabDraftType) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const generatePrompt = (prompt: GenerationPrompt, type: LabDraftType): string => {
        const basePrompt = `Create a ${type} for ${prompt.subject} students at ${prompt.gradeLevel} level. 
        
Topic: ${prompt.topic}
Duration: ${prompt.duration}
Difficulty: ${prompt.difficulty}
Learning Objectives: ${prompt.learningObjectives}

${prompt.additionalContext ? `Additional Context: ${prompt.additionalContext}` : ''}

Please create a comprehensive ${type} that includes:
- Clear instructions
- Learning objectives
- Assessment criteria
- Required materials/resources
- Step-by-step guidance
- Expected outcomes

Make it engaging, educational, and appropriate for the specified grade level and difficulty.`;

        return basePrompt;
    };

    const handleGenerate = async () => {
        const validated = validate(REQUIRED_KEYS, { prompt });

        if (!validated.valid) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: validated.remark,
            }))
        }

        setIsGenerating(true);
        try {
            // TODO: Implement actual AI API call
            // const response = await generateAIContent({
            //     prompt: generatePrompt(prompt, type),
            //     type,
            //     classId
            // });

            // Mock AI generation for now
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const mockGeneratedContent = `# ${prompt.topic} - ${getTypeLabel(type)}

## Learning Objectives
${prompt.learningObjectives || 'Students will learn the fundamental concepts and practical applications of the topic.'}

## Overview
This ${type} is designed for ${prompt.gradeLevel} students studying ${prompt.subject}. The activity will take approximately ${prompt.duration} and is suitable for ${prompt.difficulty} level learners.

## Materials Needed
- Computer with internet access
- Required software/tools
- Reference materials
- Notebook for documentation

## Instructions

### Step 1: Introduction
Begin by reviewing the basic concepts related to ${prompt.topic}. Students should understand the foundational principles before proceeding.

### Step 2: Main Activity

1. **Task 1**: [Specific task related to ${prompt.topic}]
2. **Task 2**: [Additional task or exercise]
3. **Task 3**: [Final task or assessment]

### Step 3: Reflection
Students should reflect on what they learned and how they can apply this knowledge in real-world scenarios.

## Assessment Criteria
- Understanding of core concepts (30%)
- Quality of work and effort (40%)
- Creativity and innovation (20%)
- Documentation and presentation (10%)

## Expected Outcomes
By the end of this ${type}, students should be able to:
- Demonstrate understanding of ${prompt.topic}
- Apply learned concepts in practical situations
- Communicate their findings effectively
- Reflect on their learning process

${prompt.additionalContext ? `## Additional Notes\n${prompt.additionalContext}` : ''}`;

            setGeneratedContent(mockGeneratedContent);

            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                message: `${getTypeLabel(type)} generated successfully!`
            }));
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                message: 'Failed to generate content. Please try again.'
            }));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedContent.trim()) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                message: 'No content to save. Please generate content first.'
            }));
            return;
        }

        setIsSaving(true);
        try {
            await createLabDraft.mutateAsync({
                classId,
                type,
                title: prompt.topic,
                instructions: generatedContent,
                description: `AI-generated ${type.toLowerCase()} about ${prompt.topic}`,
                objectives: prompt.learningObjectives,
                requirements: prompt.additionalContext,
                duration: prompt.duration,
                difficulty: prompt.difficulty,
            });

            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                message: `${getTypeLabel(type)} saved successfully!`
            }));

            onSuccess();
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                message: 'Failed to save content. Please try again.'
            }));
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        onSuccess();
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <IconFrame backgroundColor="bg-purple-100" baseColor="text-purple-500">
                    <HiSparkles className="h-6 w-6" />
                </IconFrame>
                <div>
                    <h2 className="text-xl font-semibold text-foreground-primary">
                        AI {getTypeLabel(type)} Generator
                    </h2>
                    <p className="text-sm text-foreground-muted">
                        Generate {type} content using AI assistance
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground-primary mb-4">Generation Parameters</h3>
                        <div className="space-y-4">
                            <Input.Text
                                label="Topic"
                                value={prompt.topic}
                                onChange={(e) => setPrompt({ ...prompt, topic: e.target.value })}
                                placeholder="e.g., Variables and Data Types"
                                required
                            />
                            
                            <Input.Text
                                label="Subject"
                                value={prompt.subject}
                                onChange={(e) => setPrompt({ ...prompt, subject: e.target.value })}
                                placeholder="e.g., Computer Science, Mathematics"
                                required
                            />

                            <Input.Text
                                label="Grade Level"
                                value={prompt.gradeLevel}
                                onChange={(e) => setPrompt({ ...prompt, gradeLevel: e.target.value })}
                                placeholder="e.g., Grade 10, Year 2"
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input.Text
                                    label="Duration"
                                    value={prompt.duration}
                                    onChange={(e) => setPrompt({ ...prompt, duration: e.target.value })}
                                    placeholder="e.g., 2 hours, 1 week"
                                />
                                
                                <Input.Select
                                    label="Difficulty"
                                    value={prompt.difficulty}
                                    onChange={(e) => setPrompt({ ...prompt, difficulty: e.target.value as any })}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </Input.Select>
                            </div>

                            <Input.Textarea
                                label="Learning Objectives"
                                value={prompt.learningObjectives}
                                onChange={(e) => setPrompt({ ...prompt, learningObjectives: e.target.value })}
                                placeholder="What should students learn? (One objective per line)"
                                rows={3}
                            />

                            <Input.Textarea
                                label="Additional Context"
                                value={prompt.additionalContext}
                                onChange={(e) => setPrompt({ ...prompt, additionalContext: e.target.value })}
                                placeholder="Any additional requirements, constraints, or context..."
                                rows={3}
                            />
                        </div>

                        <div className="mt-6">
                            <Button.Primary
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full flex gap-2 items-center justify-center"
                            >
                                <HiSparkles className="w-4 h-4 mr-2" />
                                {isGenerating ? 'Generating...' : 'Generate Content'}
                            </Button.Primary>
                        </div>
                    </Card>

                    {/* AI Tips */}
                    <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <IconFrame>
                                <HiLightBulb className="h-5 w-5 text-yellow-500" />
                            </IconFrame>
                            <h3 className="text-lg font-semibold text-foreground-primary">AI Generation Tips</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-foreground-muted">
                            <li>• Be specific about the topic and learning objectives</li>
                            <li>• Include relevant context about your students' background</li>
                            <li>• Specify any particular requirements or constraints</li>
                            <li>• Mention the desired difficulty level and duration</li>
                            <li>• Provide examples of what you're looking for</li>
                        </ul>
                    </Card>
                </div>

                {/* Generated Content */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground-primary">Generated Content</h3>
                            {generatedContent && (
                                <Button.SM
                                    onClick={() => setGeneratedContent('')}
                                    size="sm"
                                >
                                    <HiX className="w-4 h-4" />
                                </Button.SM>
                            )}
                        </div>
                        
                        {generatedContent ? (
                            <div className="space-y-4">
                                <Textbox
                                    content={generatedContent}
                                    onChange={(content) => setGeneratedContent(content)}
                                    className="min-h-[400px]"
                                />
                                
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                    <Button.Light
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2"
                                    >
                                        <HiRefresh className="w-4 h-4 mr-2" />
                                        Regenerate
                                    </Button.Light>
                                    <Button.Primary
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2"
                                    >
                                        <HiSave className="w-4 h-4 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save as Draft'}
                                    </Button.Primary>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-foreground-muted">
                                <HiSparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">No content generated yet</p>
                                <p className="text-sm">
                                    Fill in the parameters and click "Generate Content" to create your {type}
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
} 