import React, { forwardRef, useCallback, useContext, useState } from 'react'
import { axiosContext } from '../../App';



const Modal = forwardRef(({ oneUser, permission, setRefreshClient }, reference) => {

    const { apiUrl, axios } = useContext(axiosContext)
    const [newPassword, setNewPassword] = useState({ password: "" });

    const myAlert = useCallback((type, message) => {
        let my_alert = document.querySelector(".my_alert");
        my_alert.classList.remove("d-none");
        my_alert.classList.add(type);
        my_alert.innerHTML = message;
        setTimeout(() => {
            my_alert.classList.remove(type)
            my_alert.classList.add("d-none")
        }, 2000);

    }, [])

    const handleFermer = useCallback(() => {
        affichageResetPassword("invisible");
        let my_modal = document.querySelector(".my_modal");
        my_modal.classList.add("d-none");
        setNewPassword({ password: "" });
    }, [])

    const handleAnnuler = useCallback((e) => {
        e.preventDefault();
        affichageResetPassword("invisible");
        setNewPassword({ password: "" });
    }, [])

    const handleChange = useCallback((e) => {
        let valeur = e.target.value;
        setNewPassword({ password: valeur })
    }, [])

    const affichageResetPassword = useCallback((type) => {
        let reset_password = document.querySelector(".reset_password");
        if (reset_password) {
            if (reset_password.classList.contains("d-none") && type == "visible") {
                reset_password.classList.remove("d-none")
            }
            else if (!reset_password.classList.contains("d-none") && type == "invisible") {
                reset_password.classList.add("d-none")
            }
        }

        let btn_action = document.querySelectorAll(".action")
        for (let i = 0; i < btn_action.length; i++) {
            if (!btn_action[i].classList.contains("d-none") && type == "visible") {
                btn_action[i].classList.add("d-none")
            }
            else if (btn_action[i].classList.contains("d-none") && type == "invisible") {
                btn_action[i].classList.remove("d-none")
            }
        }
    }, [])

    const handleEnregistrer = useCallback((e) => {
        e.preventDefault()
        axios.put(apiUrl + "/newPassword/" + oneUser.id, newPassword)
            .then((res) => {
                console.log('changement mot de passe :>> ', res.data);
                affichageResetPassword("invisible")
                let my_modal = document.querySelector(".my_modal");
                my_modal.classList.add("d-none");
                setNewPassword({ password: "" });
                myAlert("alert-success", "Operation Réussi");

            })
            .catch((err) => {
                myAlert("alert-danger", "Echec de l'Opération");
                console.log('err', err.response.data)
            })
            .then(() => {
                console.log("envoi changement password ")
            })

    }, [newPassword, oneUser])

    const handleReinitialiser = useCallback(() => {
        affichageResetPassword("visible")
    }, [])

    const handleBlocage = useCallback((e) => {
        if (e.target.innerHTML == "bloquer compte") {
            axios.put(apiUrl + "/blocage/" + oneUser.id, { bloque: "OUI" })
                .then((res) => {
                    affichageResetPassword("invisible")
                    let my_modal = document.querySelector(".my_modal");
                    my_modal.classList.add("d-none");
                    myAlert("alert-success", "Blocage Réussi");
                    setRefreshClient({})
                })
                .catch((err) => {
                    myAlert("alert-danger", "Blocage Echoué");
                    console.log('err', err)
                })
                .then(() => {
                    console.log("envoi changement password ")
                })
        }
        if (e.target.innerHTML == "debloquer compte") {
            axios.put(apiUrl + "/blocage/" + oneUser.id, { bloque: "NON" })
                .then((res) => {
                    affichageResetPassword("invisible")
                    let my_modal = document.querySelector(".my_modal");
                    my_modal.classList.add("d-none");
                    myAlert("alert-success", "Blocage Réussi");
                    setRefreshClient({})
                })
                .catch((err) => {
                    myAlert("alert-danger", "Blocage Echoué");
                    console.log('err', err.response)
                })
                .then(() => {
                    console.log("envoi changement password ")
                })
        }
    }, [oneUser])

    return (
        <>
            <div className='my_modal d-none' ref={reference} >
                <div className='my_modal_div' >
                    {oneUser ? <h2 className=' text-center fst-italic px-3' > {oneUser.nom} <br />  {oneUser.email} </h2> : null}

                    <hr />
                    <div className=' text-center' >
                        {
                            permission.map((i) => {
                                if (["bloquer compte", "debloquer compte", "reinitialiser mot de passe"].indexOf(i) != -1) {
                                    if (i == "reinitialiser mot de passe") {
                                        return (
                                            <>
                                                <div className='d-none reset_password' >
                                                    <form>
                                                        <input type="password" name="password" value={newPassword.password} onChange={handleChange} className=" form-control" placeholder='Entrer un nouveau mot de passe' />
                                                        <button className=' btn btn-primary mt-2 me-3' onClick={handleEnregistrer} >Enregistrer</button>
                                                        <button className=' btn btn-light  mt-2' onClick={handleAnnuler} > Annuler </button>
                                                    </form>
                                                </div>
                                                <button className='action btn btn-warning m-2' onClick={handleReinitialiser} > {i} </button>
                                            </>
                                        )
                                    }
                                    else if (i == "bloquer compte" && oneUser) {
                                        let afficher = false;
                                        if (oneUser.bloque == "NON") { afficher = true }
                                        if (!afficher) {
                                            return <button className='action btn btn-warning m-2' disabled={true} onClick={handleBlocage} >{i}</button>
                                        }
                                        else {
                                            return (
                                                <button className='action btn btn-warning m-2' onClick={handleBlocage} >{i}</button>
                                            )
                                        }

                                    }
                                    else if (i == "debloquer compte" && oneUser) {
                                        let afficher = false;
                                        if (oneUser.bloque == "OUI") { afficher = true }
                                        if (!afficher) {
                                            return <button className='action btn btn-warning m-2' disabled={true} onClick={handleBlocage} >{i}</button>
                                        }
                                        else {
                                            return (
                                                <button className='action btn btn-warning m-2' onClick={handleBlocage} >{i}</button>
                                            )
                                        }
                                    }
                                }
                            })
                        }

                    </div>
                    <div className=' text-end' >
                        <button className=' btn btn-dark  mt-3 me-2' onClick={handleFermer} > Fermer </button>
                    </div>
                </div>
            </div>
        </>
    )
})

export default Modal

