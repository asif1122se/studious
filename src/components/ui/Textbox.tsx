import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TurndownService from 'turndown';
import Button from './Button';
import Dropdown, { DropdownItem } from './Dropdown';
import Spinner from './Spinner';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LucideLink,
    Sparkles,
} from 'lucide-react';
import Card from './Card';


interface TextboxProps {
    content: string;
    onChange: (content: string, markdown?: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    exportMarkdown?: boolean;
}

interface AIProcessingState {
    isProcessing: boolean;
    selectedText: string;
    startPos: number;
    endPos: number;
}

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*'
});

export default function Textbox({ 
    content, 
    onChange, 
    placeholder = 'Start writing...', 
    readOnly = false,
    className = '',
    exportMarkdown = false
}: TextboxProps) {
    const [aiProcessing, setAiProcessing] = useState<AIProcessingState | null>(null);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:text-blue-600 underline',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (exportMarkdown) {
                // Convert HTML to Markdown using Turndown
                const markdown = turndownService.turndown(html);
                onChange(html, markdown);
            } else {
                onChange(html);
            }
        },
        editorProps: {
            attributes: {
                class: `richText max-w-none focus:outline-none min-h-[100px] ${className}`,
                placeholder,
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleAI = (action: string) => {
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
        );
        
        if (selectedText.trim()) {
            // Set processing state
            setAiProcessing({
                isProcessing: true,
                selectedText,
                startPos: editor.state.selection.from,
                endPos: editor.state.selection.to
            });

            // Store the selection range for later use
            const { from, to } = editor.state.selection;

            // Simulate API call with setTimeout
            setTimeout(() => {
                try {
                    // Simulate AI response
                    const responses = {
                        'improve': `Improved version: ${selectedText} (enhanced for clarity and flow)`,
                        'expand': `Expanded content: ${selectedText} with additional context and details to provide a more comprehensive explanation.`,
                        'summarize': `Summary: ${selectedText.substring(0, Math.min(50, selectedText.length))}...`,
                        'grammar': `Grammar corrected: ${selectedText} (fixed any grammatical issues)`,
                        'translate': `Translated: ${selectedText} (translated to target language)`
                    };

                    const response = responses[action as keyof typeof responses] || selectedText;
                    
                    // Clear processing state first to avoid DOM conflicts
                    setAiProcessing(null);
                    
                    // Replace the selected text with AI response using a more robust approach
                    setTimeout(() => {
                        try {
                            editor.chain()
                                .focus()
                                .deleteRange({ from, to })
                                .insertContent(response)
                                .run();
                        } catch (error) {
                            console.error('Error replacing text:', error);
                        }
                    }, 50);
                    
                } catch (error) {
                    console.error('Error during AI processing:', error);
                    setAiProcessing(null);
                }
            }, 2000); // 2 second delay to simulate processing
        }
    };

    const aiOptions: DropdownItem[] = [
        {
            label: 'Improve writing',
            onClick: () => handleAI('improve')
        },
        {
            label: 'Expand content',
            onClick: () => handleAI('expand')
        },
        {
            label: 'Summarize',
            onClick: () => handleAI('summarize')
        },
        {
            label: 'Fix grammar',
            onClick: () => handleAI('grammar')
        },
        {
            label: 'Translate',
            onClick: () => handleAI('translate')
        }
    ];

    return (
        <div className={className}>
            {!readOnly && (
                <Card className="flex flex-row items-center p-2 gap-1 mb-2">
                    <div className="flex items-center gap-0.5">
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'bg-gray-100' : ''}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'bg-gray-100' : ''}
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'bg-gray-100' : ''}
                            title="Underline"
                        >
                            <UnderlineIcon className="w-4 h-4" />
                        </Button.SM>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <div className="flex items-center gap-0.5">
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? 'bg-gray-100' : ''}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor.isActive('orderedList') ? 'bg-gray-100' : ''}
                            title="Numbered List"
                        >
                            <ListOrdered className="w-4 h-4" />
                        </Button.SM>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <div className="flex items-center gap-0.5">
                        <Button.SM
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}
                            title="Align Left"
                        >
                            <AlignLeft className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}
                            title="Align Center"
                        >
                            <AlignCenter className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}
                            title="Align Right"
                        >
                            <AlignRight className="w-4 h-4" />
                        </Button.SM>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <Button.SM
                        onClick={addLink}
                        className={editor.isActive('link') ? 'bg-gray-100' : ''}
                        title="Add Link"
                    >
                        <LucideLink className="w-4 h-4" />
                    </Button.SM>
                    
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    
                    <Dropdown
                        trigger={
                            <Button.SM
                                className="bg-purple-100 text-purple-600 hover:bg-purple-200"
                                title="AI Assistant"
                            >
                                <Sparkles className="w-4 h-4" />
                            </Button.SM>
                        }
                        items={aiOptions}
                    />
                </Card>
            )}
            <Card className="relative">
                <EditorContent editor={editor} className="min-h-[160px] focus:outline-none placeholder:text-gray-400 bg-white text-base leading-relaxed" />
                
                {/* AI Processing Overlay */}
                {aiProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-card border border-border px-4 py-3 rounded-lg text-sm flex items-center gap-3 shadow-lg">
                            <div className="relative">
                                <div className="w-4 h-4 border-2 border-border rounded-full"></div>
                                <div className="absolute top-0 left-0 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <span className="text-foreground">AI Processing: "{aiProcessing.selectedText.substring(0, 30)}..."</span>
                        </div>
                    </div>
                )}
                
                {/* Temporarily disabled BubbleMenu to fix insertBefore error */}
                {/* {!readOnly && !aiProcessing && (
                    <BubbleMenu 
                        editor={editor} 
                        tippyOptions={{ duration: 100 }}
                        className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
                    >
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : ''}
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </Button.SM>
                        <Button.SM
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : ''}
                            title="Underline"
                        >
                            <UnderlineIcon className="w-4 h-4" />
                        </Button.SM>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <Button.SM
                            onClick={addLink}
                            className={editor.isActive('link') ? 'bg-blue-100 text-blue-600' : ''}
                            title="Add Link"
                        >
                            <LucideLink className="w-4 h-4" />
                        </Button.SM>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <Dropdown
                            trigger={
                                <Button.SM
                                    className="bg-purple-100 text-purple-600 hover:bg-purple-200"
                                    title="AI Assistant"
                                >
                                    <Sparkles className="w-4 h-4" />
                                </Button.SM>
                            }
                            items={aiOptions}
                        />
                    </BubbleMenu>
                )} */}
            </Card>
        </div>
    );
} 