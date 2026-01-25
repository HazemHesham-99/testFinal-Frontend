import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdModeEdit } from "react-icons/md";
import { api } from '../../APIS/api';
import { Button, Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { updateProfile } from '../../store/slices/userSlice';


export default function Profile() {

    const { user } = useSelector((state) => state.user)
    const [modalShow, setModalShow] = React.useState(false);
    const [uploadValue, setuploadValue] = useState(undefined)
    const dispatch = useDispatch()
    const bioref = useRef()
    const profileref = useRef()

    async function handleEdit() {
        try {
            const formData = new FormData()
            if (profileref.current.files != undefined) {

                formData.append("profile", profileref.current.files[0])
            }
            formData.append("bio", bioref.current.value)
            const token = localStorage.getItem("token")
            const response = await api.put("/api/v1/users/profile/update", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log(response)
            toast.success(response.data.message)
            dispatch(updateProfile({
                profilePic: response.data.path,
                bio: response.data.bio
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
        <div>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}

            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Uplaod New Profile Picture
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-4'>
                            <Form.Label className='mb-3'>upload photo</Form.Label>
                            <Form.Control onChange={(ev) => setuploadValue(ev.target.files[0])} type='file' id='picture' name='picture' ref={profileref} />
                        </Form.Group>
                        <Form.Group className='mb-4'>
                            <Form.Label className='mb-3'>Edit Bio</Form.Label>
                            <Form.Control as="textarea" rows={3} onChange={(ev) => setuploadValue(ev.target.value)} defaultValue={user.bio} ref={bioref} />

                        </Form.Group>
                    </Form>
                    <Modal.Footer>
                        <Button disabled={uploadValue == undefined} onClick={handleEdit}>submit</Button>
                    </Modal.Footer>
                </Modal.Body>

            </Modal>

            <h3 className='mb-4'>User Profile</h3>
            <div className='shadow rounded text-center py-4'>
                <div className='mx-auto mb-3 position-relative' style={{ width: "fit-content" }}>
                    <img src={`${import.meta.env.VITE_BACKEND_BASE}/${user.profilePic}`
                    } alt="ur pp" width={150} />
                    <div
                        className='bg-primary fs-4 rounded rounded-circle text-light position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center'
                        style={{ width: "50px", height: "50px", cursor: "pointer" }}
                        onClick={() => setModalShow(true)}
                    >
                        <MdModeEdit />

                    </div>
                </div>



                <div>
                    <h3>{user.name}</h3>
                </div>
                {user.bio && <p className='m-0'>{user.bio}</p>}

            </div>


        </div>





    )
}
