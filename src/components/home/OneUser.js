import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from './Modal';

export default function OneUser({ oneUser, action, permission, setUtilisateur, my_modal }) {

    const handleOuvert = useCallback(() => {
        setUtilisateur(oneUser);
        let myModal = my_modal.current
        myModal.classList.remove("d-none");
        console.log('render');
    }, [oneUser])



    return (
        <>
            <tr className=' align-middle' >
                {Object.keys(oneUser).map((i) => {
                    if (["email", "nom", "bloque"].indexOf(i) != -1) {
                        return (

                            <td> {oneUser[i]} </td>

                        )
                    }
                    else if (i == "role") {
                        let taille = oneUser[i].length;
                        return <td>
                            <div className=' p-0 m-0 d-flex flex-column'>{
                                oneUser[i] ? oneUser[i].map((j) => {
                                    return (

                                        <div className=' border-bottom' > {j.nom} </div>

                                    )
                                }) : null
                            }
                            </div>
                        </td>

                    }
                })}
                {
                    action ? <td> <button className='btn btn-primary' onClick={handleOuvert} >Modifier</button> </td> : null
                }
            </tr>
        </>
    )
}
