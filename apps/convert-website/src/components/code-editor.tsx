"use client";

import Editor, { OnChange } from "@monaco-editor/react/dist/index";

interface Props {
    value: string;
    onChange: OnChange
}


export default function CodeEditor({ value, onChange }: Props) {
    return (
        <div className="flex-1 lg:min-h-[580px] border-stone-400 border">
            <div className="">
                <label htmlFor="json" className="sr-only">
                    Add your message card JSON here
                </label>
                <Editor
                    height="580px"
                    defaultLanguage="json"
                    defaultValue={value}
                    onChange={onChange}
                />
            </div>

        </div>
    );
}