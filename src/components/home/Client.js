import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useOutlet, useOutletContext } from 'react-router'
import { axiosContext } from '../../App';
import Modal from './Modal';
import OneUser from './OneUser';

export default function Client() {
    const [user, permission] = useOutletContext();
    const { apiUrl, axios } = useContext(axiosContext);
    const [users, setUsers] = useState(null);
    const [action, setAction] = useState(false);
    // const [openModal, setOpenModal] = useState(null);
    const [utilisateur, setUtilisateur] = useState(null);
    const my_modal = useRef(null);
    const [refreshClient, setRefreshClient] = useState(null);

    useEffect(() => {

        axios.get(apiUrl + "/clients")
            .then((res) => {
                console.log('client recuperer :>> ', res.data);
                setUsers(res.data)
                for (let i = 0; i < permission.length; i++) {

                    if (["bloquer compte", "debloquer compte", "reinitialiser mot de passe"].indexOf(permission[i]) != -1) {
                        setAction(true)
                        break
                    }
                }
            })
            .catch((err) => {
                console.log('err', err.response.data)
            })
            .then(() => {
                console.log("envoi information pour client ")
            })


    }, [permission, refreshClient])

    useEffect(() => {
        console.log('action et  :>> ', action);
        console.log('permission :>> ', permission);
    }, [action, permission])
    return (

        <div className=' mx-3'>
            {
                action ? <Modal oneUser={utilisateur} permission={permission} ref={my_modal} setRefreshClient={setRefreshClient} /> : null
            }
            <table className=' table-bordered table table-responsive table-striped rounded-3' >
                <thead className=' table-dark text-uppercase' >
                    <tr>
                        {

                            ["role", "nom", "email", "bloque"].map((val) => {
                                return (
                                    <th> {val} </th>
                                )
                            })}

                        {
                            action ? <th>action</th> : null
                        }
                    </tr>
                </thead>
                <tbody>
                    {users ?
                        users.map((oneUser) => {
                            return (
                                <OneUser oneUser={oneUser} action={action} permission={permission} setUtilisateur={setUtilisateur} my_modal={my_modal} />
                            )

                        }) : <tr>
                            <td colSpan={action ? 5 : 4} className=" fst-italic text-danger fw-bold" >Aucune données trouvé</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}
