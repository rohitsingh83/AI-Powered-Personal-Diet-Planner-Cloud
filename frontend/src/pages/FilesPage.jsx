import { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFiles = async () => {
    try {
      const res = await client.get('/storage/files');
      setFiles(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    try {
      await client.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("File uploaded successfully");
      fetchFiles();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = (fileId) => {
    // Open in new tab which will hit the backend endpoint
    // We need to attach token manually or rely on browser cookie (if using cookies)
    // Since we use Bearer token, simple window.open won't attach the auth header.
    // Better way: fetch blob and create object URL.
    client.get(`/storage/download/${fileId}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const fileObj = files.find(f => f.id === fileId);
        link.setAttribute('download', fileObj ? fileObj.original_filename : 'download');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(() => toast.error("Download failed"));
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await client.delete(`/storage/files/${fileId}`);
      toast.success("File deleted");
      setFiles(files.filter(f => f.id !== fileId));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Health Files</h1>
          <p className="text-gray-500 text-sm">Securely store your medical reports and progress pictures</p>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 p-8 text-center hover:bg-emerald-100 transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,application/pdf"
        />
        <div className="text-4xl mb-3">📁</div>
        <h3 className="text-lg font-semibold text-emerald-800 mb-1">Click to Upload</h3>
        <p className="text-sm text-emerald-600">Supports PDF, JPG, PNG (Max 10MB)</p>
        
        {uploading && (
          <div className="mt-4 text-emerald-700 font-medium animate-pulse">
            Uploading...
          </div>
        )}
      </div>

      {/* File List */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">Uploaded Files ({files.length})</h3>
        
        {loading ? (
          <LoadingSpinner message="Loading files..." />
        ) : files.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No files uploaded yet.</div>
        ) : (
          <div className="divide-y">
            {files.map(file => (
              <div key={file.id} className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 -mx-2 rounded transition">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{file.content_type?.includes('pdf') ? '📄' : '🖼️'}</div>
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-xs md:max-w-md">{file.original_filename}</p>
                    <p className="text-xs text-gray-500">
                      {formatSize(file.file_size)} • Uploaded {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDownload(file.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;
