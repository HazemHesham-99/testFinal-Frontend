import React from 'react'
import { Container, Spinner } from 'react-bootstrap'

export default function Loading({ size = 'large' }) {
    if (size === 'small' || size === 'sm') {
        return (
            <Spinner></Spinner>
        );
    }
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <Spinner></Spinner>

        </Container>
    )
}
