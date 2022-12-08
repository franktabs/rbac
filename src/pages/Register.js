import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { axiosContext } from '../App';

export default function Register() {

    const { apiUrl, axios } = useContext(axiosContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", nom: "", password: "" });

    const handleChange = useCallback((e) => {
        var cle = e.target.id;
        var valeur = e.target.value;
        setForm((state) => { state[cle] = valeur; return { ...state } })
    }, []);

    useLayoutEffect(() => {
        let auth = localStorage.getItem("utilisateur");
        if (auth) {
            navigate("/home");
        }
    }, [])

    const myAlert = useCallback((type, message) => {
        let my_alert = document.querySelector(".my_alert");
        my_alert.classList.remove("d-none");
        my_alert.classList.add(type);
        my_alert.innerHTML = message;
        setTimeout(() => {
            my_alert.classList.remove(type)
            my_alert.classList.add("d-none")
        }, 2000)
    }, [])

    const handleClick = useCallback((e) => {
        let trouve = false;
        e.preventDefault();
        axios.post(apiUrl + "/utilisateur", form)
            .then((res) => {
                trouve = true
                console.log('res.data :>> ', res.data);
                localStorage.setItem("utilisateur", JSON.stringify(res.data))
                myAlert("alert-success", "Enregistrement Réussi")
                navigate("/home")
            })
            .catch((err) => {
                myAlert("alert-danger", "Echec de l'inscription")
                console.log('err', err.response.data)
            })
            .then(() => {
                console.log("envoi information ")
            })


        if (trouve == false) {
            console.log("Echec connexion");
        }
        else {
            console.log("connexion réussi");
        }
    }, [form]);

    return (
        <div className='register'>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">

                                    <div className="mb-md-5 mt-md-4 pb-5">

                                        <h2 className="fw-bold mb-2 text-uppercase">REGISTER</h2>
                                        <p className="text-white-50 mb-5">Please enter your information</p>
                                        <form >
                                            {
                                                Object.keys(form).map((val) => {
                                                    return (
                                                        <div className="form-outline form-white mb-4" key={val} >
                                                            {
                                                                (["password"].indexOf(val) == -1) ? (
                                                                    <input type="text" onChange={handleChange} value={form[val]} id={val} className="form-control form-control-lg" />
                                                                ) : (
                                                                    <input type="password" onChange={handleChange} value={form[val]} id={val} className="form-control form-control-lg" />

                                                                )
                                                            }
                                                            <label className="form-label" htmlFor="typeEmailX">{val.toUpperCase()}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {/* <div className="form-outline form-white mb-4">
                                            <input type="email" onChange={handleChange} value={form.email} id="typeEmailX" className="form-control form-control-lg" />
                                            <label className="form-label" htmlFor="typeEmailX">Email</label>
                                        </div>

                                        <div className="form-outline form-white mb-4">
                                            <input type="password" onChange={handleChange} value={form.password} id="typePasswordX" className="form-control form-control-lg" />
                                            <label className="form-label" htmlFor="typePasswordX">Password</label>
                                        </div> */}

                                            {/* <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p> */}

                                            <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={handleClick} >Register</button>

                                        </form>

                                    </div>

                                    <div>
                                        <p className="mb-0">Do you have a account? <a href="login" className="text-white-50 fw-bold">login Up</a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
