'use client';

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Upload, File, FileText, FileJson, FileCode, CheckCircle2, AlertCircle,
  X, Eye, Download, Info, Database, Table, Brain, Dna
} from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: UserFile[]) => void;
  acceptedTypes: string[];
  maxFiles: number;
  maxSizeMB: number;
  purpose: string; // What this file will be used for
  helpText: string; // Plain language explanation
  exampleFormat?: string; // Example of expected format
}

interface UserFile {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'vcf' | 'fasta' | 'pdb' | 'sdf' | 'unknown';
  size: number;
  uploadedAt: Date;
  preview?: string[];
  headers?: string[];
  rowCount?: number;
  validated: boolean;
  validationErrors?: string[];
}

const fileTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  csv: Table,
  json: FileJson,
  vcf: Dna,
  fasta: Dna,
  pdb: Brain,
  sdf: FileCode,
  unknown: File
};

const fileTypeDescriptions: Record<string, { name: string; description: string }> = {
  csv: { 
    name: 'Spreadsheet Data', 
    description: 'Comma-separated values, like Excel files. Great for experimental results, patient data, or measurements.' 
  },
  json: { 
    name: 'Structured Data', 
    description: 'JavaScript Object Notation. Often used for API data or complex nested information.' 
  },
  vcf: { 
    name: 'Genetic Variant Data', 
    description: 'Variant Call Format. Contains genetic differences/mutations found in DNA sequencing.' 
  },
  fasta: { 
    name: 'DNA/Protein Sequences', 
    description: 'Biological sequence format. Contains DNA, RNA, or protein sequences.' 
  },
  pdb: { 
    name: '3D Molecular Structure', 
    description: 'Protein Data Bank format. Shows 3D structure of molecules like proteins.' 
  },
  sdf: { 
    name: 'Chemical Structures', 
    description: 'Structure Data File. Contains chemical compound structures for drug discovery.' 
  }
};

export default function FileUpload({
  onFileUpload,
  acceptedTypes,
  maxFiles,
  maxSizeMB,
  purpose,
  helpText,
  exampleFormat
}: FileUploadProps) {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectFileType = useCallback((filename: string): UserFile['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, UserFile['type']> = {
      'csv': 'csv',
      'json': 'json',
      'vcf': 'vcf',
      'fasta': 'fasta',
      'fa': 'fasta',
      'fna': 'fasta',
      'faa': 'fasta',
      'pdb': 'pdb',
      'sdf': 'sdf',
      'mol': 'sdf'
    };
    return typeMap[ext || ''] || 'unknown';
  }, []);

  const validateFile = useCallback((file: File): string[] => {
    const errors: string[] = [];
    const type = detectFileType(file.name);
    
    if (type === 'unknown' && acceptedTypes.length > 0) {
      errors.push(`File type not recognized. Accepted types: ${acceptedTypes.join(', ')}`);
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`File too large. Maximum size is ${maxSizeMB}MB.`);
    }
    
    return errors;
  }, [detectFileType, acceptedTypes, maxSizeMB]);

  const parseFilePreview = useCallback(async (file: File): Promise<{ preview: string[]; headers?: string[]; rowCount?: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n').slice(0, 10);
        const type = detectFileType(file.name);
        
        if (type === 'csv') {
          const headers = lines[0]?.split(',').map(h => h.trim()) || [];
          resolve({
            preview: lines,
            headers,
            rowCount: content.split('\n').length - 1
          });
        } else if (type === 'json') {
          try {
            const parsed = JSON.parse(content);
            const keys = Array.isArray(parsed) 
              ? Object.keys(parsed[0] || {})
              : Object.keys(parsed);
            resolve({
              preview: [JSON.stringify(parsed, null, 2).split('\n')[0]],
              headers: keys,
              rowCount: Array.isArray(parsed) ? parsed.length : 1
            });
          } catch {
            resolve({ preview: lines });
          }
        } else if (type === 'vcf' || type === 'fasta') {
          resolve({
            preview: lines.filter(l => !l.startsWith('#')),
            rowCount: content.split('\n').filter(l => !l.startsWith('#') && l.trim()).length
          });
        } else {
          resolve({ preview: lines });
        }
      };
      reader.readAsText(file.slice(0, 10000)); // Read first 10KB for preview
    });
  }, [detectFileType]);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. Please select fewer files.`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const newFiles: UserFile[] = [];
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const errors = validateFile(file);
      const preview = await parseFilePreview(file);
      
      const userFile: UserFile = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        type: detectFileType(file.name),
        size: file.size,
        uploadedAt: new Date(),
        preview: preview.preview,
        headers: preview.headers,
        rowCount: preview.rowCount,
        validated: errors.length === 0,
        validationErrors: errors.length > 0 ? errors : undefined
      };
      
      newFiles.push(userFile);
      setUploadProgress(((i + 1) / fileArray.length) * 100);
    }

    setFiles(prev => [...prev, ...newFiles]);
    setUploading(false);
    
    const validFiles = newFiles.filter(f => f.validated);
    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  }, [files.length, maxFiles, validateFile, parseFilePreview, detectFileType, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const TypeIcon = selectedFile ? (fileTypeIcons[selectedFile.type] || File) : Upload;
  const typeInfo = selectedFile ? fileTypeDescriptions[selectedFile.type] : null;

  return (
    <div className="space-y-4">
      {/* Purpose and Help */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400">What you'll upload here:</h4>
            <p className="text-sm text-gray-300 mt-1">{purpose}</p>
            <p className="text-xs text-gray-400 mt-2">{helpText}</p>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          dragOver 
            ? 'border-emerald-500 bg-emerald-500/10' 
            : 'border-[#30363d] hover:border-[#4a5568] bg-[#161b22]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.map(t => `.${t}`).join(',')}
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
        />
        
        <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-emerald-400' : 'text-gray-500'}`} />
        <h3 className="text-lg font-medium mb-2">
          {dragOver ? 'Drop files here!' : 'Drag & drop your files'}
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          or click to browse
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>Max {maxFiles} file{maxFiles > 1 ? 's' : ''}</span>
          <span>•</span>
          <span>Up to {maxSizeMB}MB each</span>
          <span>•</span>
          <span>{acceptedTypes.join(', ').toUpperCase()}</span>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processing files...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Uploaded Files ({files.length})
          </h4>
          
          <div className="grid gap-2">
            {files.map(file => {
              const FileIcon = fileTypeIcons[file.type] || File;
              
              return (
                <Card 
                  key={file.id}
                  className={`cursor-pointer transition-all ${
                    selectedFile?.id === file.id 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'bg-[#161b22] border-[#30363d] hover:border-[#4a5568]'
                  } ${!file.validated ? 'border-red-500/50' : ''}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`p-2 rounded ${file.validated ? 'bg-[#21262d]' : 'bg-red-500/10'}`}>
                      <FileIcon className={`w-5 h-5 ${file.validated ? 'text-gray-400' : 'text-red-400'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{file.name}</span>
                        {file.validated ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {file.rowCount && <span>{file.rowCount.toLocaleString()} rows</span>}
                        <span>{fileTypeDescriptions[file.type]?.name || 'Unknown type'}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardContent>
                  
                  {file.validationErrors && file.validationErrors.length > 0 && (
                    <CardFooter className="p-3 pt-0">
                      <div className="text-xs text-red-400">
                        {file.validationErrors.map((err, i) => (
                          <div key={i}>• {err}</div>
                        ))}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* File Preview Panel */}
      {selectedFile && (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                File Preview: {selectedFile.name}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {selectedFile.type.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              {typeInfo?.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Headers/Columns */}
            {selectedFile.headers && selectedFile.headers.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-400 mb-2">Detected Columns ({selectedFile.headers.length})</h5>
                <div className="flex flex-wrap gap-1">
                  {selectedFile.headers.slice(0, 10).map((header, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {header}
                    </Badge>
                  ))}
                  {selectedFile.headers.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedFile.headers.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Preview Data */}
            {selectedFile.preview && selectedFile.preview.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-400 mb-2">First few lines</h5>
                <ScrollArea className="h-32 rounded bg-[#0d1117] p-2">
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
                    {selectedFile.preview.join('\n')}
                  </pre>
                </ScrollArea>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center p-2 bg-[#0d1117] rounded">
                <div className="text-lg font-bold text-emerald-400">
                  {selectedFile.rowCount?.toLocaleString() || '—'}
                </div>
                <div className="text-[10px] text-gray-500">Rows/Records</div>
              </div>
              <div className="text-center p-2 bg-[#0d1117] rounded">
                <div className="text-lg font-bold text-blue-400">
                  {selectedFile.headers?.length || '—'}
                </div>
                <div className="text-[10px] text-gray-500">Columns</div>
              </div>
              <div className="text-center p-2 bg-[#0d1117] rounded">
                <div className="text-lg font-bold text-purple-400">
                  {formatFileSize(selectedFile.size)}
                </div>
                <div className="text-[10px] text-gray-500">File Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Example Format */}
      {exampleFormat && !files.length && (
        <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
          <h5 className="text-xs font-medium text-gray-400 mb-2">Expected Format Example:</h5>
          <pre className="text-xs font-mono text-gray-300 overflow-x-auto">{exampleFormat}</pre>
        </div>
      )}
    </div>
  );
}
