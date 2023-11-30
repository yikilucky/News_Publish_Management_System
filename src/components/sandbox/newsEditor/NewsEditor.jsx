import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


export default function NewsEditor(props) {
    const { saveContent, updateContent } = props;
    const [editorState, setEditorState] = useState('');

    useEffect(()=>{
        const contentBlock = htmlToDraft(updateContent);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        
    }
    },[updateContent]) //!编辑新闻时显示返回的富文本编辑器内容(要把HTML转成draft对象)

    
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { setEditorState(editorState) }}
                onBlur={() => { saveContent(draftToHtml(convertToRaw(editorState.getCurrentContent()))) }}
            />
        </div>
    )
}
