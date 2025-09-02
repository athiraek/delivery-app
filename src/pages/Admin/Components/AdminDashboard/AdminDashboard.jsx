import React from "react";
import { supabase } from "../../../../supabase-client";
import { useState } from "react";
import AdminNavigation from "../AdminNavigation/AdminNavigation";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const getMessageClass = (message) => {
    if (message.toLowerCase().includes('success')) return 'success';
    if (message.toLowerCase().includes('failed') || message.toLowerCase().includes('error')) return 'error';
    return 'info';
  };

  const handleUpload = async () => {
    if (!file || !name || !price || !category) {
      setMessage("Please fill all required fields and select an image.");
      return;
    }

    setIsUploading(true);
    setMessage("Uploading...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("menu-images") // your bucket name
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError.message);
        setMessage("Upload failed. Please try again.");
        setIsUploading(false);
        return;
      }

      // 2. Get public URL
      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(filePath);
      const imageUrl = data.publicUrl;

      // 3. Insert into menu_items
      const { error: insertError } = await supabase.from("menu_items").insert([
        {
          name,
          description,
          price: parseFloat(price),
          image: imageUrl,
          category,
          is_available: true,
        },
      ]);

      if (insertError) {
        console.error("Insert Error:", insertError.message);
        setMessage("Failed to insert into database. Please try again.");
      } else {
        setMessage("Menu item added successfully!");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setFile(null);
        setPreview(null);
        // Clear the file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavigation />
      <div className="dashboard-container">
        <div className="upload-section">
          <h2>Upload New Menu Item</h2>

          <div className="form-group">
            <label htmlFor="name">Item Name <span className="required">*</span></label>
            <input
              id="name"
              className="form-input"
              type="text"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Enter item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price <span className="required">*</span></label>
              <input
                id="price"
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category <span className="required">*</span></label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isUploading}
              >
                <option value="">Select Category</option>
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Desserts">Desserts</option>
                <option value="Cake">Cake</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
                <option value="Pure Veg">Pure Veg</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="file-input">Item Image <span className="required">*</span></label>
            <div className="file-input-wrapper">
              <input
                id="file-input"
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label 
                htmlFor="file-input" 
                className={`file-input-label ${file ? 'has-file' : ''}`}
              >
                {file ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    {file.name}
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    Click to select an image or drag and drop
                  </>
                )}
              </label>
            </div>
          </div>

          {preview && (
            <div className="preview-container">
              <img
                src={preview}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}

          <button 
            className="upload-button" 
            onClick={handleUpload}
            disabled={isUploading || !file || !name || !price || !category}
          >
            {isUploading ? (
              <>
                <span className="loading-spinner"></span>
                Uploading...
              </>
            ) : (
              'Upload Menu Item'
            )}
          </button>

          {message && (
            <div className={`message ${getMessageClass(message)}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;