import { useEffect, useState } from 'react';
import axios from 'axios';

export function Panel() {
    const [libros, setLibros] = useState([]);
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);
    const [listaLectura, setListaLectura] = useState([]);

    const fetchLibros = async () => {
        try {
            const response = await axios.get('/api/books.json');
            setLibros(response.data.library);
            setLoad(false);
        } catch (error) {
            setError(error);
            setLoad(false);
        }
    };

    useEffect(() => {
        fetchLibros();
    }, []);

    const handleDragStart = (e, tituloLibro) => {
        e.dataTransfer.setData('text/plain', tituloLibro);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const tituloLibro = e.dataTransfer.getData('text/plain');
        const libro = libros.find(libro => libro.book.title === tituloLibro);

        if (libro) {
            setListaLectura(prevLista => [...prevLista, libro]);
            setLibros(prevLibros => prevLibros.filter(libro => libro.book.title !== tituloLibro));
        }
    };

    const handleRemoveFromList = (tituloLibro) => {
        const add = listaLectura.find(libro => libro.book.title === tituloLibro);
        setListaLectura(prevLista => prevLista.filter(libro => libro.book.title !== tituloLibro));
    
        const libro = libros.find(libro => libro.book.title === tituloLibro);
        if (!libro) {
            setLibros(prevLibros => [...prevLibros, add]);
        }
    };

    if (load) {
        return <p>Cargando ...</p>;
    }
    if (error) {
        return <p>Error al cargar datos: {error.message}</p>;
    }

    return (
        <main className="container mx-auto">
            <h1 className='text-3xl py-4 text-white'>Libros</h1>
            <h2 className='text-white'>Libros disponibles</h2>
            <div className="flex justify-between">
                <div className="container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {libros.map((libro, index) => (
                            <div
                                key={index}
                                className="border p-2 m-2 cursor-move"
                                draggable
                                onDragStart={(e) => handleDragStart(e, libro.book.title)}
                            >
                                <img
                                    src={libro.book.cover}
                                    className='object-cover w-full rounded-t-sm'
                                    alt={`Titulo del libro ${libro.book.title}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className='container'
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div
                        className='grid md:grid-cols-2 lg:grid-cols-3 gap-2'
                    >
                        {
                            listaLectura.map((libro, index) => (
                                <div key={index} className="border p-2 m-2 flex-shrink-0 relative">
                                    <img
                                        src={libro.book.cover}
                                        className='object-cover w-full rounded-t-sm'
                                        alt={`Titulo del libro ${libro.book.title}`}
                                    />
                                    <button
                                        className="absolute top-0 right-0 bg-black bg-opacity-80 text-white px-4 py-2 rounded-md"
                                        onClick={() => handleRemoveFromList(libro.book.title)}
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
