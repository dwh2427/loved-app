'use client'
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";

const Popup = ({ children, isOpen, closeModal }) => {
  return (

    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className=" w-[500px] overflow-hidden mx-auto my-32 p-6 rounded-md bg-white shadow-lg z-100 outline-none"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >

      <button
        className="text-gray-600 hover:text-red-500 w-full focus:outline-none"
        onClick={closeModal}
      >
        <FaTimes className="w-fit ms-auto" />
      </button>
      {children}
    </Modal>

  );
};

export default Popup;
