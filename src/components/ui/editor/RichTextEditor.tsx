
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Image from '@tiptap/extension-image'

import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Link as LinkIcon, AlignLeft, AlignCenter,
    AlignRight, Undo, Redo, Heading1, Heading2, Heading3,
    Quote, Minus, Type, Palette, Code, Highlighter,
    Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
    AlignJustify, Image as ImageIcon
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

interface Variable {
    label: string;
    value: string;
}

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
    className?: string
    editable?: boolean
    variables?: Variable[] // List of variables to insert
}

const MenuBar = ({ editor, variables }: { editor: any, variables?: Variable[] }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const addImage = () => {
        const url = window.prompt('URL của hình ảnh')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            {/* History */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
                    title="Hoàn tác"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
                    title="Làm lại"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Headings */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-1.5 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Tiêu đề 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Tiêu đề 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Basic Formatting */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="In đậm"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="In nghiêng"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded ${editor.isActive('strike') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Gạch ngang"
                >
                    <Strikethrough className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-1.5 rounded ${editor.isActive('code') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Code"
                >
                    <Code className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded ${editor.isActive('underline') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Gạch chân"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`p-1.5 rounded ${editor.isActive('highlight') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Highlight"
                >
                    <Highlighter className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Advanced Formatting */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={setLink}
                    className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Chèn Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={`p-1.5 rounded ${editor.isActive('superscript') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Chỉ số trên"
                >
                    <SuperscriptIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={`p-1.5 rounded ${editor.isActive('subscript') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Chỉ số dưới"
                >
                    <SubscriptIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Colors */}
            <div className="flex items-center gap-1 mr-1">
                <input
                    type="color"
                    onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                    title="Màu chữ"
                />
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Alignment */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Căn trái"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Căn giữa"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Căn phải"
                >
                    <AlignRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-1.5 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Căn đều"
                >
                    <AlignJustify className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Lists */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Danh sách"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Danh sách số"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Extra */}
            <div className="flex items-center gap-0.5 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded ${editor.isActive('blockquote') ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Trích dẫn"
                >
                    <Quote className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Kẻ ngang"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <button
                    onClick={addImage}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Chèn ảnh"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Variables Dropdown (Custom implementation) */}
            {variables && variables.length > 0 && (
                <>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded-md hover:bg-brand-100 transition-colors"
                        >
                            <Type className="w-3.5 h-3.5" />
                            Chèn biến
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
                                <div className="py-1">
                                    {variables.map((v) => (
                                        <button
                                            key={v.value}
                                            className="text-gray-900 block w-full text-left px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-700"
                                            onClick={() => {
                                                editor.chain().focus().insertContent(` ${v.value} `).run();
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            {v.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "Nhập nội dung...",
    className = "",
    editable = true,
    variables
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Superscript,
            Subscript,
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline',
                },
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

    // Update content if changed externally
    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (editor.getText() === '' && content !== '') {
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])

    return (
        <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all ${className}`}>
            {editable && <MenuBar editor={editor} variables={variables} />}
            <EditorContent editor={editor} />
        </div>
    )
}
