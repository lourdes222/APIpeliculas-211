document.addEventListener("DOMContentLoaded", () => {
    mostrarPeliculas();

    const btn_agregar = document.querySelector("#btn-agregar");
    btn_agregar.addEventListener("click", () => {
        document.querySelector("#form-agregar").style.display = "block";
    });

    document.querySelector("#btn-cerrar-formAgregar").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#form-agregar").style.display = "none";
    });

    const form_agregar = document.querySelector("#form-agregar");
    form_agregar.addEventListener("submit", async (e) => {
        e.preventDefault();

        form_agregar.style.display = "none";
        const archivoImagen = document.querySelector("#imagen").files[0];
        let urlImagenFinal = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200';

        if (archivoImagen) {
            const formData = new FormData();
            formData.append("image", archivoImagen);

            const urlSubida = await subirImg(formData);
            if (urlSubida) {
                urlImagenFinal = urlSubida; 
            }
        }
        const nuevaPelicula = {
            titulo: form_agregar.querySelector('[name="titulo"]').value,
            genero: form_agregar.querySelector('[name="genero"]').value,
            imagen: urlImagenFinal
        };
       await agregarPelicula(nuevaPelicula);
        form_agregar.reset();
    });
    const form_buscar = document.querySelector("#form-buscar");
    form_buscar.addEventListener("submit", (e) => {
        e.preventDefault();

        const peliculaABuscar = {
            tituloABuscar: form_buscar.querySelector('[name="tituloBuscar"]').value.trim(),
            generoABuscar: form_buscar.querySelector('[name="generoBuscar"]').value
        };
        buscarPelicula(peliculaABuscar);
    });
    const btn_filtros = document.querySelector('#btn-filtros');
    btn_filtros.addEventListener('click', (e) => {
        e.preventDefault();
        form_buscar.reset();
        mostrarPeliculas();
    });

document.querySelector('#form-modificar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.querySelector('#mod-id').value;
    const titulo = document.querySelector('#mod-titulo').value;
    const genero = document.querySelector('#mod-genero').value;
    const inputFile = document.querySelector('#mod-imagen-file');
    
    // Si no hay imagen actual, usamos string vacío
    let urlImagen = document.querySelector('#mod-imagen-actual').value || "";

    // Si seleccionaste una foto nueva desde la máquina
    if (inputFile.files.length > 0) {
        const foto = inputFile.files[0];
        const datosImg = new FormData();
        datosImg.append('image', foto);

        try {
            const resImg = await fetch(`https://api.imgbb.com/1/upload?key=1b20023a4df3cef1f51e6ab915712f1f`, {
                method: 'POST',
                body: datosImg
            });
            const dataImg = await resImg.json();
            if (dataImg.success) {
                urlImagen = dataImg.data.url;
            }
        } catch (error) {
            console.error('Error subiendo imagen a ImgBB:', error);
        }
    }
    modificarPelicula({
        idAModif: id,
        tituloAModif: titulo,
        generoAModif: genero,
        imagenAModif: urlImagen
    });
});
});