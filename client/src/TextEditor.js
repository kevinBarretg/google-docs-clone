import { useCallback, useEffect, useState } from 'react'
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

    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    // socket io
    useEffect(() => {
        const s = io("http://localhost:3001")
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    // receive changes
    useEffect(() => {

        if (socket == null || quill == null) return

        const handler = delta => {
            quill.updateContents(delta)
        }
        socket.on("receive-changes", handler)

        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, quill])

    // detect changes
    useEffect(() => {

        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit("send-changes", delta)
        }
        quill.on("text-change", handler)

        return () => {
            quill.off("text-change", handler)
        }
    }, [socket, quill])


    // initialized quill
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: toolbarOptions }
        })
        setQuill(q)
    }, [])
    return <div className="container" ref={wrapperRef}></div>
}
