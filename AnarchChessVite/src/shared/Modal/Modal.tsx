import React, { ReactEventHandler, useContext } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "../Contexts/ModalContext";

const Modal = () => {
    const { modalContent, modal, closeModal } = useContext(ModalContext) as {
        modal: any;
        modalContent: any;
        openModal: any;
        closeModal: any;
    };

    const stopPropogation = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
    };
    if (modal) {
        return createPortal(
            <div
                className="w-screen h-screen bg-neutral-800/80 absolute z-50 flex justify-center items-center"
                onClick={closeModal}
            >
                <div
                    className="flex flex-col justify-around items-center bg-neutral-900 rounded-md p-5 h-40"
                    onClick={stopPropogation}
                >
                    {modalContent}
                </div>
            </div>,
            document.querySelector("#modal-root") as Element
        );
    } else {
        return null;
    }
};

export default Modal;
