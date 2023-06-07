import {useEffect, useState} from 'react'

export default () : { modalContent: any, openModal: Function, modal: boolean, closeModal: Function}=> {
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState<any>()
    
    const closeModal = () => {
      setModal(false)
    }
    const openModal = (content = false) => {
        setModal(true);
        setModalContent(content);
      }

    return {modalContent, openModal, modal, closeModal}
}