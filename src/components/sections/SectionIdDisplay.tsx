
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SectionIdDisplayProps {
  sectionId: string;
  sectionContent: string;
  sectionName: string;
}

export const SectionIdDisplay = ({ sectionId, sectionContent, sectionName }: SectionIdDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sectionId);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Section ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy section ID",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">ID:</span>
        <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
          {sectionId.slice(0, 8)}...
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Eye className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Section Preview: {sectionName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Section ID</h4>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1">
                  {sectionId}
                </code>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">HTML Content</h4>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                {sectionContent}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Live Preview</h4>
              <div 
                className="border rounded p-4 bg-white"
                dangerouslySetInnerHTML={{ __html: sectionContent }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
