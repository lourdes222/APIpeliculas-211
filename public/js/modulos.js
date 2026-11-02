const URL_API= '/peliculas'
const subirImg = async (formData) => {
    try {
        const response = await fetch('https://api.imgbb.com/1/upload?key=1b20023a4df3cef1f51e6ab915712f1f', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.data.url;
    } catch (error) {
        console.error('Error subiendo la imagen:', error);
        return null;
    }
};

//POST
const agregarPelicula = async (nuevaPelicula) => {
    try{
        const res = await fetch(URL_API, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(nuevaPelicula)
});
if (res.ok) {
    mostrarMensaje("Pelicula agregada");
    mostrarPeliculas();
 }
} catch (error) {
    console.error('Error agregando la película:', error);
}
};

//GET
const mostrarPeliculas = (peliculasEncontradas) => {
    let contenedorPeliculas = document.querySelector('#listadoPeliculas');
    if (!contenedorPeliculas) return; 

    contenedorPeliculas.innerHTML = '';
    const renderizar = (lista) => {
        if (!lista || lista.length === 0) {
            contenedorPeliculas.innerHTML = '<p>No hay películas para mostrar.</p>';
            return;
        }
        lista.forEach(p => {
        let fotoPoster = (p.imagen && p.imagen !== "undefined")
        ? p.imagen
        :
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200';
    
        contenedorPeliculas.innerHTML += `
        <div class="pelicula">
            <img src="${fotoPoster}" alt="Poster" class="poster-pelicula">
            <div class="info">
                <p><strong>Título:</strong> ${p.titulo}</p>
                <p><strong>Género:</strong> ${p.genero}</p>
                <p><strong>ID:</strong> ${p.id}</p>
            </div>
             <div class="botones">
                <button class="btn-modificar" onclick="mostrarFormModificar('${p.titulo}', '${p.genero}', '${p.id}', '${p.imagen || ''}')">Modificar</button>
                <button class="btn-eliminar" onclick="eliminarPelicula('${p.id}')">Eliminar</button>
             </div>
            </div>
    `;
});
    };
    if (peliculasEncontradas) {
        renderizar(peliculasEncontradas);
    } else {
        fetch(URL_API, {
            method: 'GET',
            headers: {'content-type':'application/json'},
            cache: 'no-cache' 
        })
        .then(res => res.ok ? res.json() : [])
        .then(peliculas => renderizar(peliculas))
        .catch(error => console.error('Error trayendo las películas:', error));
    }
}
//GET
const buscarPelicula = (datosBusqueda) => {
    fetch(URL_API, {
        method: 'GET',
        headers: {'content-type':'application/json'}
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(peliculas => {
        let peliculasEncontradas = peliculas.filter(p => {
            let tituloPeli = (p.titulo || '').toLowerCase();
            let generoPeli = (p.genero || '').toLowerCase();
            
            let buscadoTitulo = (datosBusqueda.tituloABuscar || '').toLowerCase();
            let buscadoGenero = (datosBusqueda.generoABuscar || '').toLowerCase();

            const coincideTitulo = buscadoTitulo ? tituloPeli.includes(buscadoTitulo) : true;
            const coincideGenero = buscadoGenero ? generoPeli === buscadoGenero : true;

            return coincideTitulo && coincideGenero;
        }); 
        mostrarPeliculas(peliculasEncontradas);
    }).catch(error => {
        console.error('Error en la búsqueda:', error);
    });
}
//DELETE
const eliminarPelicula = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta película?")) {
    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' }
        });
        if (res.ok) {
            mostrarMensaje("Película eliminada");
            mostrarPeliculas();
        }
    } catch (error) {
        console.error('Error eliminando la película:', error);
    }
  }
};
//GET
const mostrarFormModificar = (tituloActual, generoActual, id, imagenActual = '') => {
    document.querySelector('#form-modificar').innerHTML = `
        <div class="cerrar">
            <button type="button" class="btn-cerrar-formModif" onclick="document.querySelector('#form-modificar').style.display='none'">X</button>
        </div>
        <h3>Modificar Película</h3>
        <p>Editando ID: <strong>${id}</strong></p>
        <input type="hidden" id="mod-id" value="${id}">
        <input type="hidden" id="mod-imagen-actual" value="${imagenActual}">
        <label>Nuevo Título</label>
        <input type="text" id="mod-titulo" value="${tituloActual}" required>
        <label>Nuevo Género</label>
        <select id="mod-genero" required>
            <option value="Comedia" ${generoActual === 'Comedia' ? 'selected' : ''}>Comedia</option>
            <option value="Terror" ${generoActual === 'Terror' ? 'selected' : ''}>Terror</option>
            <option value="Ciencia Ficcion" ${generoActual === 'Ciencia Ficcion' ? 'selected' : ''}>Ciencia Ficción</option>
            <option value="Aventura" ${generoActual === 'Aventura' ? 'selected' : ''}>Aventura</option>
            <option value="Romance" ${generoActual === 'Romance' ? 'selected' : ''}>Romance</option>
            <option value="Infantil" ${generoActual === 'Infantil' ? 'selected' : ''}>Infantil</option>
        </select>
        <label>Seleccionar nueva foto</label>
        <input type="file" id="mod-imagen-file" accept="image/*">
        <button type="button" class="btn-quitar-foto" onclick="eliminarImagen('${id}')">Quitar Foto Actual</button>  
        <input type="submit" name="submit" value="Guardar Cambios">
    `;
    document.querySelector('#form-modificar').style.display = 'block';
}
const modificarPelicula = (nuevosDatos) => {  
    const datosEditados = {
        id: Number(nuevosDatos.idAModif), // Aseguramos que sea número (o quítalo si tu ID es texto)
        titulo: nuevosDatos.tituloAModif,
        genero: nuevosDatos.generoAModif,
        imagen: nuevosDatos.imagenAModif
    };

    fetch(`${URL_API}/${nuevosDatos.idAModif}`, {
        method: 'PUT',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(datosEditados)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error en el servidor: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return res.json();
        }
        return null;
    })
    .then(pelicula => {
        console.log('Película modificada con éxito', pelicula || '');
        mostrarPeliculas();
        mostrarMensaje("Película modificada");
        document.querySelector('#form-modificar').style.display = 'none';
    })
    .catch(error => {
        console.error('Error modificando la película:', error);
        alert('Hubo un error al modificar la película. Revisa la consola.');
    });
};
const eliminarImagen = async (id) => {
    if (confirm("¿Estás seguro de que deseas quitar la imagen de esta película?")) {
        try {
            const res = await fetch(`${URL_API}/${id}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ imagen: "" })
            });

            if (res.ok) {
                const inputImagenActual = document.querySelector('#mod-imagen-actual');
                if (inputImagenActual) {
                    inputImagenActual.value = "";
                }
                mostrarMensaje("Imagen eliminada correctamente");
                document.querySelector('#form-modificar').style.display = 'none';
                mostrarPeliculas();
            }
        } catch (error) {
            console.error('Error al quitar la imagen:', error);
        }
    }
};