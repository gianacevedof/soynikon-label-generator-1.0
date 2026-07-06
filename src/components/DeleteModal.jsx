import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ClientModal({ setToggleDeleteModal, clientData, deleteClient }) {
  const URL = import.meta.env.VITE_API_URL;

  return (
    <Modal show={true} onHide={setToggleDeleteModal} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You are about to{" "}
        <code
          style={{
            color: "red",
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            padding: "3px 5px",
          }}
        >
          delete
        </code>{" "}
        this client from the database.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={setToggleDeleteModal}>
          Close
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            deleteClient(clientData.client_id);
            setToggleDeleteModal();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClientModal;
