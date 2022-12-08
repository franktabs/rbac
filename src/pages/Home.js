import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, } from 'react-router';
import "./style/home.scss";

export default function Home() {
    const [user, setUser] = useState(null);
    const [autorisation, setAutorisation] = useState({ permission: false, bloque: false });
    const [permission, setPermission] = useState([]);
    const navigate = useNavigate();
    let location = useLocation();
    useEffect(() => {
        let auth = localStorage.getItem("utilisateur");
        if (!auth) {
            navigate("/login");
        } else {
            auth = JSON.parse(auth)
            setUser(auth)
            console.log("Bienvenu ", auth);
        }
    }, [])

    useEffect(() => {
        if (user) {
            let permissions = user[0].role[0]?.permission
            if (user[0].bloque == "OUI") {
                setAutorisation((state) => ({ ...state, bloque: true }))
            }
            if (permissions) {
                setAutorisation((state) => ({ ...state, permission: true }))
                let tabPermission = permissions.map((i) => {
                    return i.description
                })
                setPermission(tabPermission)
                console.log('tabPermission', tabPermission)
            }
        }
    }, [user])

    const deconnect = useCallback(() => {
        localStorage.removeItem("utilisateur");
        navigate("/login")
    }, []);

    const handleModule = useCallback((e) => {
        navigate(e.target.id);
    }, [])

    return (
        <div className=' pt-3'>
            <div><h1>BIENVENUE {user ? user[0].nom : null}</h1> </div>
            <div> <button className=' btn btn-secondary' onClick={deconnect} >Deconnexion</button> </div>

            {
                location.pathname == "/home" && autorisation.permission && !autorisation.bloque ?
                    <div className=' d-flex justify-content-center m-3' >
                        <div className='bg-secondary shadow-lg p-3' >
                            <button className=' btn btn-warning fw-bold p-2 m-2' id='client' onClick={handleModule} >CLIENT</button>
                            <button className=' btn btn-warning fw-bold m-2 p-2' id='employe' onClick={handleModule} >EMPLOYE</button>
                        </div>
                    </div> : null
            }
            {
                location.pathname == "/home" && !autorisation.permission && !autorisation.bloque ?
                    <div className=' d-flex justify-content-center m-3' >
                        <h1 className=' text-center fst-italic' > Vous n'avez pas encore d'autorisation </h1>
                    </div> : null
            }
            {
                autorisation.bloque ?
                    <div className=' d-flex justify-content-center m-3' >
                        <h1 className=' text-center fst-italic' > Vous avez été bloqué </h1>
                    </div> : null
            }

            <div className=' mt-3'>
                <Outlet context={[user, permission]} />
            </div>
        </div>
    )
}
