// import React, { useState } from "react";
// import { Button, Form } from "react-bootstrap";
// import { api } from "../../APIS/api";

// export default function Home() {
//   const [formData, setFormData] = useState({
//     caption: "",
//     images: []
//   });

//   const handleCreateNewPost = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token")
//     const uploadData = new FormData()
//     uploadData.append("photos", formData.images)
//     // console.log(formData.images.length)
//     for (let i = 0; i < formData.images.length; i++) {
//       uploadData.append("photos", formData.images[i])
//     }
//     uploadData.append("caption", formData.caption)
//     try {
//       const response = await api.post("/api/v1/posts/createPost", uploadData, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       e.target.reset();
//       setFormData({
//         caption: "",
//         images: []
//       });
//       console.log(response)

//     } catch (error) {
//       console.log(error)
//     }
//     // Handle form submission logic here
//     console.log("Creating post:", formData);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "images") {
//       setFormData(prev => ({
//         ...prev,
//         images: files
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   return (
//     <div>
//       <div className="border rounded-1 p-4 mb-3">
//         <h3>Create New Post</h3>
//         <Form onSubmit={handleCreateNewPost}>
//           <Form.Group className="mb-3">
//             <Form.Label htmlFor="caption">Caption</Form.Label>
//             <Form.Control
//               as={"textarea"}
//               name="caption"
//               id="caption"
//               placeholder="Caption..."
//               value={formData.caption}
//               onChange={handleChange}
//               style={{ resize: "none", height: "150px" }}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label htmlFor="images">Upload Images</Form.Label>
//             <Form.Control
//               multiple
//               type="file"
//               max={5}
//               name="images"
//               id="images"
//               accept="image/*"
//               onChange={handleChange}
//             />
//             <Form.Text className="text-muted">
//               You can upload up to 5 images
//             </Form.Text>
//           </Form.Group>

//           <Button type="submit" variant="primary" disabled={!formData.caption.trim() && formData.images.length === 0}
//           >
//             Create Post
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// };



import React, { useState } from 'react'
import CreatePost from '../../components/create post/createPost'
import Feeds from '../../components/feeds/Feeds'
import Loading from '../../components/loading/Loading'
import PageLimit from '../../components/PageLimit/PageLimit'

export default function Home() {
  const [newPost, setnewpost] = useState(false)
  //for page display
  const [limit, setLimit] = useState(5)
  const [page, setPage] = useState(1)

  return (
    <div>
      <CreatePost setnewpost={setnewpost} />
      <div>


        <div className="d-flex justify-content-between align-items-center mb-3 bg-primary text-light p-3 rounded shadow-lg">
          <h3>Feeds</h3>

          <PageLimit limit={limit} setLimit={setLimit} setPage={setPage} />
        </div>

        <Feeds newPost={newPost} setnewpost={setnewpost} limit={limit} setPage={setPage} page={page} />

      </div>
    </div>
  )
}
