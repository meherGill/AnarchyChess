import {useEffect, useState} from 'react'

export default () : { modalContent: any, handleModal: Function, modal: boolean}=> {
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState<any>()
    
    const handleModal = (content = false) => {
        // setModal(!modal);
        if (content) {
          setModalContent(content);
        }
      };

    return {modalContent, handleModal, modal}
}