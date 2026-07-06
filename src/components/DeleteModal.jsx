import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ClientModal({ setToggleDeleteModal, clientData, deleteClient }) {
  return (
    <Modal show={true} onHide={setToggleDeleteModal} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You are about to <code className="delete-tag">delete</code> this
        client from the database.
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
