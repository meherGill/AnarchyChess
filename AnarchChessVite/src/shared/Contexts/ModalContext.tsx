import React, { createContext } from "react";
import useModal from "../Hooks/useModal";
import Modal from "../Modal/Modal";

const ModalContext = createContext<
    undefined | { modal: any; handleModal: Function; modalContent: any }
>(undefined);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { modal, handleModal, modalContent } = useModal();
    return (
        <ModalContext.Provider value={{ modal, handleModal, modalContent }}>
            <Modal />
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext, ModalProvider };
