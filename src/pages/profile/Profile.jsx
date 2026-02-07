import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdModeEdit } from "react-icons/md";
import { api } from '../../APIS/api';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { updateProfile } from '../../store/slices/userSlice';
import Feeds from '../../components/feeds/Feeds';
import PageLimit from '../../components/PageLimit/PageLimit';


export default function Profile() {

    const { user } = useSelector((state) => state.user)
    const [modalShow, setModalShow] = React.useState(false);
    const [uploadValue, setuploadValue] = useState(undefined)
    //for page display
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)


    const dispatch = useDispatch()
    const bioref = useRef()
    const nameref = useRef()
    const profileref = useRef()

    async function handleEdit() {
        try {
            const formData = new FormData()
            if (profileref.current.files != undefined) {

                formData.append("profile", profileref.current.files[0])
            }
            formData.append("bio", bioref.current.value)
            formData.append("name", nameref.current.value)
            const response = await api.put("/api/v1/users/profile/update", formData)

            toast.success(response.data.message)
            dispatch(updateProfile({
                profilePic: response.data.path,
                bio: response.data.bio,
                name: response.data.name
            }))
        } catch (error) {
            console.log(error)
        } finally {
            setModalShow(false)
            setuploadValue(undefined)

        }
    }
    function handleClose() {
        setuploadValue(undefined)
        setModalShow(false)
    }
    return (
        <Container className='py-4'>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}

            >
                <Modal.Header closeButton >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* profile pic */}
                        <Form.Group className='mb-4'>
                            <Form.Label className='mb-3'>upload photo</Form.Label>
                            <Form.Control onChange={(ev) => setuploadValue(ev.target.files[0])} type='file' id='picture' name='picture' ref={profileref} />
                        </Form.Group>
                        {/* bio */}
                        <Form.Group className='mb-4'>
                            <Form.Label className='mb-3'>Edit Bio</Form.Label>
                            <Form.Control as="textarea" rows={3} onChange={(ev) => setuploadValue(ev.target.value)} defaultValue={user.bio} ref={bioref} />
                        </Form.Group>

                        {/* name */}
                        <Form.Group className='mb-4'>
                            <Form.Label className='mb-3'>Change your name</Form.Label>
                            <Form.Control type="text" onChange={(ev) => setuploadValue(ev.target.value)} defaultValue={user.name} ref={nameref} />
                        </Form.Group>
                    </Form>
                    <Modal.Footer>
                        <Button disabled={uploadValue == undefined} onClick={handleEdit}>submit</Button>
                    </Modal.Footer>
                </Modal.Body>

            </Modal>

            <Row className="mb-4">
                <Col>
                    <h3 className="mb-4">User Profile</h3>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col lg={6} className="mx-auto">
                    <Card className="shadow rounded text-center py-4">
                        <Card.Body>

                            <div className='mx-auto mb-3 position-relative' style={{ width: "fit-content" }}>
                                <img src={`${import.meta.env.VITE_BACKEND_BASE}/${user.profilePic}`
                                } alt="ur pp" width={150} className="rounded-circle object-fit-cover border border-3 border-primary" />
                                <div
                                    className='bg-primary fs-4 rounded rounded-circle text-light position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center'
                                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                    onClick={() => setModalShow(true)}
                                >
                                    <MdModeEdit />

                                </div>
                            </div>



                            <div className="mb-3">
                                <h3 className="text-primary">{user.name}</h3>
                            </div>
                            {user.bio && <Card.Text className="fst-italic text-muted px-3">
                                "{user.bio}"
                            </Card.Text>}
                        </Card.Body>

                    </Card >
                </Col>
            </Row >
            <Row>
                <Col>
        <div className="d-flex justify-content-between align-items-center mb-3 bg-primary text-light p-3 rounded shadow-lg">
                        <h4 className="mb-0 me-3">My Posts</h4>
                        <PageLimit limit={limit} setLimit={setLimit} setPage={setPage}/>

                        {/* <div className="border-bottom flex-grow-1"></div> */}
                    </div>
                    <Feeds allposts={false} limit={limit} page={page} setPage={setPage} />
                </Col>
            </Row>        </Container>





    )
}
