import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from "react-router-dom"

/**
 * Компонент react для выхода из системы.
 * @param {*} setUser метод для динамического изменения текущего пользователя системы.
 * @returns 
 */
const Logoff = ({ setUser }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * Метод показа модального окна
     */
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const navigate = useNavigate()

    const logoff = async (event) => {
        
        setIsModalOpen(false)
        event.preventDefault()

        const requestOptions = {
            method: "POST",
        }
        return await fetch("api/account/logoff", requestOptions)
            .then((response) => {
              if (response.status === 200) {
                setUser({ isAuthenticated: false, userName: "" });
              }
              window.location.assign("/settlements");
            })
    }


    return (
        <>
          <Button type="default" className='default-button' onClick={showModal}>
            Выйти
          </Button>
          <Modal 
            title="Выход из аккаунта" 
            open={isModalOpen} 
            onOk={logoff} 
            onCancel={handleCancel}
            footer={[
                <Button onClick={logoff} className='default-button'>
                  Да
                </Button>,
                <Button onClick={handleCancel} className='default-button'>
                  Нет
                </Button>
            ]}
            >
            <p>Вы действительно хотите выйти?</p>
          </Modal>
        </>
      );
    
    // return (
    //     <>
    //         <p></p>
    //         <form onSubmit={logoff}>
    //             <button type="submit">Выход</button>
    //         </form>
    //     </>
    // )
}

export default Logoff