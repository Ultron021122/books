import { useEffect, useState } from 'react';
import axios from 'axios';

export function Panel() {
    const [libros, setLibros] = useState([]);
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);
    const [listaLectura, setListaLectura] = useState([]);

    useEffect(() => {
        axios.get('/api/books.json')
            .then(response => {
                setLibros(response.data.library);
                setLoad(false);
            })
            .catch(error => {
                setError(error);
                setLoad(false);
            });
    }, []);

    const handleDragStart = (e, tituloLibro, coverLibro) => {
        e.dataTransfer.setData('text/plain', tituloLibro);
        e.dataTransfer.setData('cover/plain', coverLibro);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const tituloLibro = e.dataTransfer.getData('text/plain');
        const coverLibro = e.dataTransfer.getData('cover/plain');

        // Añade a la lista de lectura
        setListaLectura(prevLista => [...prevLista, [tituloLibro, coverLibro]]);

        setLibros(prevLibros => prevLibros.filter(libro => libro.book.title !== tituloLibro));
    };

    if (load) {
        return <p>Cargando ...</p>;
    }
    if (error) {
        return <p>Error al cargar datos: {error.message}</p>;
    }
    console.log(listaLectura);
    return (
        <main className="container mx-auto">
            <h1 className='text-3xl py-4 text-white'>Libros</h1>
            <div>
                <h2 className='text-white'>Libros disponibles</h2>
                <div className="flex justify-around m-8">
                    <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {libros.map((libro, index) => (
                            <div
                                key={index}
                                className="border p-2 m-2 cursor-move"
                                draggable
                                onDragStart={(e) => handleDragStart(e, libro.book.title, libro.book.cover)}
                            >
                                <img src={libro.book.cover} className='object-cover h-48 w-full rounded-t-sm' alt={`Bandera de ${libro.book.title}`} />
                            </div>
                        ))}
                    </div>
                    <div
                        className='container grid md:grid-cols-2 lg:grid-cols-3 gap-2'
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {
                            listaLectura.map((libro, index) => (
                                <img
                                    src={libro[1]}
                                    key={index}
                                    className='border p-2 m-2'
                                />
                            ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
