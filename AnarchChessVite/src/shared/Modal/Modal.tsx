import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "../Contexts/ModalContext";

const Modal = () => {
    const { modalContent, modal } = useContext(ModalContext) as {
        modal: any;
        modalContent: any;
        handleModal: Function;
    };
    if (modal) {
        return createPortal(
            <div className="w-screen h-screen bg-neutral-800/85 absolute z-50 flex justify-center items-center">
                <div className="flex flex-col justify-around items-center bg-neutral-900 rounded-md p-5 h-40">
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
