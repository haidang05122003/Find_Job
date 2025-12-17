
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Link as LinkIcon, AlignLeft, AlignCenter,
    AlignRight, Undo, Redo
} from 'lucide-react'
import React from 'react'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
    className?: string
    editable?: boolean
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }


    type ToolbarBtn = {
        type?: 'button'
        icon?: React.ReactNode
        action?: () => boolean
        isActive?: boolean
        title?: string
    } | {
        type: 'divider'
        icon?: never
        action?: never
        isActive?: never
        title?: never
    }

    const buttons: ToolbarBtn[] = [
        {
            type: 'button',
            icon: <Bold className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            title: 'Bold'
        },
        {
            type: 'button',
            icon: <Italic className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            title: 'Italic'
        },
        {
            type: 'button',
            icon: <UnderlineIcon className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: editor.isActive('underline'),
            title: 'Underline'
        },
        {
            type: 'button',
            icon: <Strikethrough className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
            title: 'Strike'
        },
        {
            type: 'divider'
        },
        {
            type: 'button',
            icon: <List className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            title: 'Bullet List'
        },
        {
            type: 'button',
            icon: <ListOrdered className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
            title: 'Ordered List'
        },
        {
            type: 'divider'
        },
        {
            type: 'button',
            icon: <AlignLeft className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: editor.isActive({ textAlign: 'left' }),
            title: 'Align Left'
        },
        {
            type: 'button',
            icon: <AlignCenter className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: editor.isActive({ textAlign: 'center' }),
            title: 'Align Center'
        },
        {
            type: 'button',
            icon: <AlignRight className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: editor.isActive({ textAlign: 'right' }),
            title: 'Align Right'
        },
    ]

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            {buttons.map((btn, index) => (
                btn.type === 'divider' ? (
                    <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                ) : (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            if (btn.action) btn.action();
                        }}
                        className={`p-1.5 rounded-md transition-colors ${btn.isActive
                            ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        title={btn.title}
                        type="button"
                    >
                        {btn.icon}
                    </button>
                )
            ))}
        </div>
    )
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "Nhập nội dung...",
    className = "",
    editable = true
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4 max-w-none dark:prose-invert',
            },
        },
    })

    // Update content if changed externally (be careful with loops)
    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only update if content is drastically different to avoid cursor jumps
            // Actually for simplicity, we often avoid syncing back content unless it's empty
            if (editor.getText() === '' && content !== '') {
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])

    return (
        <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all ${className}`}>
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    )
}
