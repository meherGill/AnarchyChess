import React, { createContext } from "react";
import useModal from "../Hooks/useModal";
import Modal from "../Modal/Modal";

const ModalContext = createContext<
    | undefined
    | { modal: any; openModal: Function; modalContent: any; closeModal: any }
>(undefined);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { modal, openModal, modalContent, closeModal } = useModal();
    return (
        <ModalContext.Provider
            value={{ modal, openModal, modalContent, closeModal }}
        >
            <Modal />
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext, ModalProvider };
