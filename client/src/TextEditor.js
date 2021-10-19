import { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import "quill/dist/quill.snow.css"
import Quill from 'quill'

// Toolbar Options 
const toolbarOptions = [
    ['bold', 'italic', 'underline'],                  // toggled buttons
    ['link', 'image', 'blockquote', 'code-block'],

    [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // ustom button values

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

export default function TextEditor() {
    // socket io
    useEffect(() => {
        const socket = io("http://localhost:3001")

        return () => {
            socket.disconnect()
        }
    }, [])

    // initialized quill
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        new Quill(editor, { theme: "snow", modules: { toolbar: toolbarOptions } })
    }, [])
    return <div className="container" ref={wrapperRef}></div>
}
