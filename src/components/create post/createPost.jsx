import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { api } from "../../APIS/api";

export default function CreatePost({ setnewpost }) {
  const [formData, setFormData] = useState({
    caption: "",
    images: []
  });

  const [displayForm, setDisplayForm] = useState(false)

  const handleCreateNewPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")
    const uploadData = new FormData()
    uploadData.append("photos", formData.images)
    // console.log(formData.images.length)
    for (let i = 0; i < formData.images.length; i++) {
      uploadData.append("photos", formData.images[i])
    }
    uploadData.append("caption", formData.caption)
    try {
      const response = await api.post("/api/v1/posts/createPost", uploadData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      e.target.reset();
      setFormData({
        caption: "",
        images: []
      });
      console.log(response)
      setnewpost(true)
    } catch (error) {
      console.log(error)
    }
    // Handle form submission logic here
    console.log("Creating post:", formData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div>
      {!displayForm && <Form.Group className='mb-4'>
        <Form.Control type='email' id='email' name='email' placeholder="What's on your mind" onClick={() => { setDisplayForm(true) }} />
      </Form.Group>}
      
      {displayForm && <div className="border rounded-2 p-4 mb-3">

        <h3>Create New Post</h3>
        <Form onSubmit={handleCreateNewPost}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="caption">Caption</Form.Label>
            <Form.Control
              as={"textarea"}
              name="caption"
              id="caption"
              placeholder="Caption..."
              value={formData.caption}
              onChange={handleChange}
              style={{ resize: "none", height: "150px" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="images">Upload Images</Form.Label>
            <Form.Control
              multiple
              type="file"
              max={5}
              name="images"
              id="images"
              accept="image/*"
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              You can upload up to 5 images
            </Form.Text>
          </Form.Group>

          <Button type="submit" variant="primary" disabled={!formData.caption.trim() && formData.images.length === 0}>
            Create Post
          </Button>

           <Button type="submit" className="ms-2" variant="secondary" onClick={() => { setDisplayForm(false) }} >
            Cancel
          </Button>
        </Form>
      </div>}
    </div>
  );
};