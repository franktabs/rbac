import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router';
import { axiosContext } from '../App'

export default function Login() {
    const { apiUrl, axios } = useContext(axiosContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [data, setData] = useState(null)
    const navigate = useNavigate();
    useLayoutEffect(() => {
        let auth = localStorage.getItem("utilisateur");
        if (auth) {
            navigate("/home");
        }
    }, [])
    const handleChange = useCallback((e) => {
        var cle = e.target.type;
        var valeur = e.target.value;
        setForm((state) => { state[cle] = valeur; return { ...state } })
    }, []);

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
        e.preventDefault()
        let trouve = false;
        axios.post(apiUrl + "/login", form)
            .then((res) => {
                trouve = true
                console.log('res.data :>> ', res.data);
                localStorage.setItem("utilisateur", JSON.stringify(res.data))
                myAlert("alert-success", "Connexion Réussi");
                navigate("/home")
            })
            .catch((err) => {
                console.log('err', err.response.data)
                myAlert("alert-danger", "Echec de connexion");

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

    // console.log('users', users);
    // console.log('form', form);
    return (
        <div className=' login'>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">

                                    <div className="mb-md-5 mt-md-4 pb-5">

                                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                        <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                        <form >
                                            <div className="form-outline form-white mb-4">
                                                <input type="email" onChange={handleChange} value={form.email} id="typeEmailX" className="form-control form-control-lg" required={true} />
                                                <label className="form-label" htmlFor="typeEmailX">Email</label>
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <input type="password" onChange={handleChange} value={form.password} id="typePasswordX" className="form-control form-control-lg" required={true} />
                                                <label className="form-label" htmlFor="typePasswordX">Password</label>
                                            </div>
                                            <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={handleClick} >Login</button>
                                        </form>

                                        {/* <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p> */}


                                    </div>

                                    <div>
                                        <p className="mb-0">Don't have an account? <a href="register" className="text-white-50 fw-bold">Sign Up</a>
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
