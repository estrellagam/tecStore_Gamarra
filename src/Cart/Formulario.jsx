import React from 'react'
import { useContext } from 'react'
import { NavLink,Link } from 'react-router-dom'
import useFirebase from "../helpers/useFirebase"
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { GlobalContext } from '../context/GlobalStateContext'
import { useEffect, useState } from "react";
import {getDocs, query, where } from 'firebase/firestore'
import { db } from '../service/firebase';
import "./Cart.css"
import Swal from 'sweetalert2'

    const Input = ({
        className,
        type,
        name,
        value,
        inputClassName,
        onChange,
        onBlur,
        placeholder,
        error,
      }) => {
        return (
          <div className={className}>
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={(e) => onBlur(e)}
              className={inputClassName} 
              placeholder={placeholder}
            />
            {error.nombre && (
              <h6 className="text-danger my-2 text-uppercase">{error.nombre}</h6>
            )}
          </div>
        );
      };
      const validar = (campos) => {
        return campos.some((campo) => campo === "")
      }
      const Formulario = () => {
        const {  clear , total, carrito} = useContext(GlobalContext);

        const { fetchTicket } = useFirebase();
      
        const [formulario, setFormulario] = useState({
          buyer: {
            email: "",
            nombre: "",
            apellido: "",
            telefono: "",
          },
          total: total,
          items: carrito,
        });
      
        const [error, setError] = useState({});
        
    


    const {
        buyer: { email, nombre, apellido, telefono },
      } = formulario;
    
      const onSubmit = (e) => {
        e.preventDefault();
        if (validar([email, nombre, apellido, telefono])) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes completar todos los campos',
          })

          return;
        }
        fetchTicket({ datos: formulario });
        clear();
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
          ...formulario,
          buyer: {
            ...formulario.buyer,
            [name]: value,
          },
        });
      };
    
      const handleBlur = (e) => {
        const { value, name } = e.target;
        if (value === "") {
          setError({ ...error, [name]: "Este campo es obligatorio" });
          return;
        }
        setError({});
      };
    
      return (
        <form onSubmit={onSubmit} className="container border my-4">
          <h3 className="text-uppercase text-center my-4">datos recipiente</h3>
          {Object.keys(formulario.buyer).map((key,index) => (
            <Input
            key={index}
            className="mb-3"
            type="text"
            name={`${key}`}
            value={key.value}
            onChange={handleChange}
            onBlur={handleBlur}
            inputClassName={`form-control ${error[key] && "is-invalid"}`}
            placeholder={`${key}`}
            error={error}
            />
          ))}
        
          <div className="border row d-flex px-2">
            <div className="col-12 col-lg-9">
              <p className="fs-4 text-uppercase">total</p>
            </div>
            <div className="col-12 col-lg-3">
              <p className="fs-4">S./{total}</p>
            </div>
            <button
              type="submit"
              className="btn terminarCompra text-uppercase w-100 my-4"
            >
              terminar la compra
            </button>
          </div>
    
          <Link to="/" className="btn btn-secondary text-uppercase my-2 w-100">
            volver a comprar
          </Link>
        </form>
      );
    };

export default Formulario