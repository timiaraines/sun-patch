import { Container, Row, Col } from "react-bootstrap";
import React from 'react'


export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col size={12} sm={6}>
            <img src="/logo.png"/>
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <p>Made by Timia Raines and Aman Singh</p>
            <p>Copyright 2022. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer