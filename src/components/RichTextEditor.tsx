
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue = '', onChange }) => {
  const [content, setContent] = useState(initialValue);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
      setContent(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    onChange(content);
  }, [content, onChange]);

  const handleFormat = (e: React.MouseEvent, command: string, value: string | undefined = undefined) => {
    e.preventDefault();
    
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      
      const editorContent = editorRef.current.innerHTML || '';
      setContent(editorContent);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.innerHTML || '';
      setContent(editorContent);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result && editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, 
          `<img src="${event.target.result}" alt="Uploaded image" class="my-4 max-w-full h-auto rounded" />`
        );
        
        const editorContent = editorRef.current.innerHTML || '';
        setContent(editorContent);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsImageDialogOpen(false);
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1 justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'bold')} 
          title="Bold"
          type="button"
        >
          <Bold size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'italic')} 
          title="Italic"
          type="button"
        >
          <Italic size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'underline')} 
          title="Underline"
          type="button"
        >
          U
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'formatBlock', '<h2>')} 
          title="Heading"
          type="button"
        >
          H
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'formatBlock', '<p>')} 
          title="Paragraph"
          type="button"
        >
          P
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'justifyLeft')} 
          title="Align Left"
          type="button"
        >
          <AlignLeft size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'justifyCenter')} 
          title="Align Center"
          type="button"
        >
          <AlignCenter size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => handleFormat(e, 'justifyRight')} 
          title="Align Right"
          type="button"
        >
          <AlignRight size={16} />
        </Button>
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Insert Image"
              type="button"
            >
              <Image size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="imageFile" className="text-sm font-medium">Choose Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary/90"
                />
                <Button 
                  type="button"
                  onClick={triggerFileInput}
                  className="mt-2"
                >
                  Select Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div
        ref={editorRef}
        id="editor"
        className="min-h-[300px] p-4 focus:outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleInput}
      ></div>
    </div>
  );
};

export default RichTextEditor;
