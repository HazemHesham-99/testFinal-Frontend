import React, { useEffect, useState } from 'react'
import { api } from '../../APIS/api'
import SimplePostCard from '../postCard/PostCard'
import CommentPage from '../comment/Comment'
import Loading from '../loading/Loading'
import { useSelector } from 'react-redux'
import { Pagination } from 'react-bootstrap'

export default function Feeds({ newPost, setnewpost, allposts = true, limit, setPage, page }) {
  const [loading, setloading] = useState(true)

  const [posts, setPosts] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [ShowCommentPage, setShowCommentPage] = useState(false)
  const [deletePost, setdeletePost] = useState(false)

  // adjuest Pagination 
  const [active, setActive] = useState(1);
  const [totalPages, settotalPages] = useState(5);
  let items = [];
  useEffect(() => {
    setActive(1)

  }, [limit])
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active} onClick={() => {
        setActive(number)
        setPage(number)
      }}>
        {number}
      </Pagination.Item>,
    );
  }

  const { user } = useSelector((state) => state.user)


  useEffect(() => {
    //fetch all users
    if (allposts) {
      async function fetchAllPosts() {
        try {
          const response = await api.get(`/api/v1/posts?page=${page}&limit=${limit}`)
          settotalPages(response.data.page.totalPages)

          setPosts(response.data.posts)
        } catch (error) {
          console.log(error)
        } finally {
          setloading(false)
          setnewpost(false)
          setdeletePost(false)
        }


      }
      fetchAllPosts()

      //fetch single user posts
    } else {
      async function fetchAllPostsForSingleUser() {
        const userId = user._id
        try {
          const response = await api.get(`/api/v1/users/${userId}/posts?page=${page}&limit=${limit}`)
          setPosts(response.data.posts)
          settotalPages(response.data.page.totalPages)

        } catch (error) {
          console.log(error)
        } finally {
          setloading(false)
          setdeletePost(false)
        }


      }
      fetchAllPostsForSingleUser()
    }

  }, [loading, newPost, deletePost, limit, page])

  // show comment Model
  function handleOpenModal(post) {
    setSelectedData(post)
    setShowCommentPage(true)
  }

  // show loading untill all postes loaded
  if (loading) {
    return <Loading />
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {posts.map(post => (
            <SimplePostCard key={post._id} post={post} onOpenModel={handleOpenModal} setdeletePost={setdeletePost} />
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination>{items}</Pagination>
        </div>
      </div>
      <CommentPage post={selectedData} show={ShowCommentPage} onClose={() => setShowCommentPage(false)} />

    </div>
  )
}
