/* =========================================================
   CONFIGURACIÓN
========================================================= */

const WHATSAPP = "59175685568";

let productos = [];
let categorias = [];

let categoriaActual = "todos";


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const contenedorProductos =
    document.getElementById("productos");

const contenedorCategorias =
    document.getElementById("categorias");

const buscador =
    document.getElementById("buscador");

const contadorProductos =
    document.getElementById("contadorProductos");

const sinResultados =
    document.getElementById("sinResultados");

const modalProducto =
    document.getElementById("modalProducto");

const detalleProducto =
    document.getElementById("detalleProducto");

const btnCerrarModal =
    document.getElementById("btnCerrarModal");

const modalFondo =
    document.querySelector(".modal-fondo");

const btnTema =
    document.getElementById("btnTema");

const btnLimpiarBusqueda =
    document.getElementById("btnLimpiarBusqueda");


/* =========================================================
   CARGAR PRODUCTOS
========================================================= */

async function cargarProductos() {

    const { data, error } = await supabaseClient

        .from("productos")

        .select(`
            *,
            categorias (
                id,
                nombre,
                slug
            )
        `)

        .order("id", {
            ascending: false
        });


    if (error) {

        console.error(
            "Error al cargar productos:",
            error
        );

        contenedorProductos.innerHTML = `
            <div class="sin-resultados">
                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    No se pudieron cargar los productos
                </h3>

                <p>
                    Revisa la conexión con Supabase.
                </p>
            </div>
        `;

        return;
    }


    productos = data || [];

    mostrarProductos(productos);
}


/* =========================================================
   CARGAR CATEGORÍAS
========================================================= */

async function cargarCategorias() {

    const { data, error } = await supabaseClient

        .from("categorias")

        .select("*")

        .order("id", {
            ascending: true
        });


    if (error) {

        console.error(
            "Error al cargar categorías:",
            error
        );

        return;
    }


    categorias = data || [];

    mostrarCategorias();
}


/* =========================================================
   MOSTRAR CATEGORÍAS
========================================================= */

function mostrarCategorias() {

    contenedorCategorias.innerHTML = "";


    /* -----------------------------------------
       BOTÓN TODOS
    ----------------------------------------- */

    const botonTodos =
        document.createElement("button");

    botonTodos.className =
        "categoria-btn activa";

    botonTodos.textContent =
        "Todos";

    botonTodos.dataset.categoria =
        "todos";


    botonTodos.addEventListener(
        "click",
        () => {

            seleccionarCategoria(
                "todos",
                botonTodos
            );

        }
    );


    contenedorCategorias.appendChild(
        botonTodos
    );


    /* -----------------------------------------
       CATEGORÍAS SUPABASE
    ----------------------------------------- */

    categorias.forEach(categoria => {

        const boton =
            document.createElement("button");

        boton.className =
            "categoria-btn";

        boton.textContent =
            categoria.nombre;

        boton.dataset.categoria =
            categoria.id;


        boton.addEventListener(
            "click",
            () => {

                seleccionarCategoria(
                    categoria.id,
                    boton
                );

            }
        );


        contenedorCategorias.appendChild(
            boton
        );

    });

}


/* =========================================================
   SELECCIONAR CATEGORÍA
========================================================= */

function seleccionarCategoria(
    categoriaId,
    botonSeleccionado
) {

    categoriaActual =
        categoriaId;


    document
        .querySelectorAll(".categoria-btn")
        .forEach(boton => {

            boton.classList.remove(
                "activa"
            );

        });


    botonSeleccionado.classList.add(
        "activa"
    );


    aplicarFiltros();
}


/* =========================================================
   MOSTRAR PRODUCTOS
========================================================= */

function mostrarProductos(lista) {

    contenedorProductos.innerHTML = "";


    /* -----------------------------------------
       CONTADOR
    ----------------------------------------- */

    contadorProductos.textContent =
        lista.length === 1
            ? "1 producto"
            : `${lista.length} productos`;


    /* -----------------------------------------
       SIN RESULTADOS
    ----------------------------------------- */

    if (lista.length === 0) {

        sinResultados.classList.remove(
            "oculto"
        );

        return;

    }


    sinResultados.classList.add(
        "oculto"
    );


    /* -----------------------------------------
       CREAR TARJETAS
    ----------------------------------------- */

    lista.forEach(producto => {

        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "producto";


        const categoriaNombre =
            producto.categorias?.nombre
            || "Sin categoría";


        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="${producto.imagen || ""}"
                    alt="${producto.nombre}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="producto-info">

                <span class="producto-categoria">
                    ${categoriaNombre}
                </span>


                <h2>
                    ${producto.nombre}
                </h2>


                <p class="producto-tipo">
                    ${producto.tipo || ""}
                </p>


                <p class="producto-precio">
                    Bs. ${formatearPrecio(producto.precio)}
                </p>


                <div class="acciones-producto">
                    <button
                        type="button"
                        class="btn-detalle"
                        data-id="${producto.id}"
                    >
                        Ver producto
                    </button>

                    <button
                        type="button"
                        class="btn-whatsapp-card"
                        onclick="pedirWhatsApp(${producto.id})"
                        title="Consultar por WhatsApp"
                    >
                        <i class="fa-brands fa-whatsapp"></i>
                        WhatsApp
                    </button>
                </div>

            </div>

        `;


        const botonDetalle =
            tarjeta.querySelector(
                ".btn-detalle"
            );


        botonDetalle.addEventListener(
            "click",
            () => {

                abrirDetalle(
                    producto.id
                );

            }
        );


        contenedorProductos.appendChild(
            tarjeta
        );

    });

}


/* =========================================================
   APLICAR FILTROS
========================================================= */

function aplicarFiltros() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    let resultados =
        [...productos];


    /* -----------------------------------------
       FILTRO POR CATEGORÍA
    ----------------------------------------- */

    if (
        categoriaActual !== "todos"
    ) {

        resultados =
            resultados.filter(
                producto =>
                    String(
                        producto.categoria_id
                    ) === String(
                        categoriaActual
                    )
            );

    }


    /* -----------------------------------------
       FILTRO DE BÚSQUEDA
    ----------------------------------------- */

    if (texto !== "") {

        resultados =
            resultados.filter(
                producto => {

                    const nombre =
                        (
                            producto.nombre
                            || ""
                        ).toLowerCase();


                    const familia =
                        (
                            producto.familia
                            || ""
                        ).toLowerCase();


                    const subcategoria =
                        (
                            producto.subcategoria
                            || ""
                        ).toLowerCase();


                    const tipo =
                        (
                            producto.tipo
                            || ""
                        ).toLowerCase();


                    const descripcion =
                        (
                            producto.descripcion
                            || ""
                        ).toLowerCase();


                    return (

                        nombre.includes(texto) ||

                        familia.includes(texto) ||

                        subcategoria.includes(texto) ||

                        tipo.includes(texto) ||

                        descripcion.includes(texto)

                    );

                }
            );

    }


    mostrarProductos(
        resultados
    );

}


/* =========================================================
   BUSCADOR
========================================================= */

buscador.addEventListener(
    "input",
    () => {

        const tieneTexto =
            buscador.value.trim() !== "";


        btnLimpiarBusqueda.classList.toggle(
            "visible",
            tieneTexto
        );


        aplicarFiltros();

    }
);


/* =========================================================
   LIMPIAR BUSCADOR
========================================================= */

btnLimpiarBusqueda.addEventListener(
    "click",
    () => {

        buscador.value = "";

        btnLimpiarBusqueda.classList.remove(
            "visible"
        );

        aplicarFiltros();

        buscador.focus();

    }
);


/* =========================================================
   ABRIR DETALLE
========================================================= */

function abrirDetalle(id) {

    const producto =
        productos.find(
            producto =>
                Number(producto.id) === Number(id)
        );


    if (!producto) {
        return;
    }


    const categoriaNombre =
        producto.categorias?.nombre
        || "Sin categoría";


    const imagen =
        producto.imagen || "";


    detalleProducto.innerHTML = `

        <div class="detalle-imagen">

            <img
                src="${imagen}"
                alt="${producto.nombre}"
                onerror="this.style.display='none'"
            >

        </div>


        <div class="detalle-info">

            <span class="detalle-categoria">
                ${categoriaNombre}
            </span>


            <h2>
                ${producto.nombre}
            </h2>


            <p class="detalle-tipo">
                ${producto.tipo || ""}
            </p>


            <p class="detalle-precio">
                Bs. ${formatearPrecio(producto.precio)}
            </p>


            ${
                producto.familia
                ? `
                    <div class="detalle-bloque">

                        <h4>
                            FAMILIA OLFATIVA
                        </h4>

                        <p>
                            ${producto.familia}
                        </p>

                    </div>
                `
                : ""
            }


            ${
                producto.descripcion
                ? `
                    <div class="detalle-bloque">

                        <h4>
                            DESCRIPCIÓN
                        </h4>

                        <p>
                            ${producto.descripcion}
                        </p>

                    </div>
                `
                : ""
            }


            ${
                producto.caracteristicas
                ? `
                    <div class="detalle-bloque">

                        <h4>
                            CARACTERÍSTICAS
                        </h4>

                        <p>
                            ${producto.caracteristicas}
                        </p>

                    </div>
                `
                : ""
            }


            ${
                producto.ideal
                ? `
                    <div class="detalle-bloque">

                        <h4>
                            IDEAL PARA
                        </h4>

                        <p>
                            ${producto.ideal}
                        </p>

                    </div>
                `
                : ""
            }


            <button
                type="button"
                class="btn-whatsapp"
                onclick="pedirWhatsApp(${producto.id})"
            >

                <i class="fa-brands fa-whatsapp"></i>

                Pedir por WhatsApp

            </button>

        </div>

    `;


    modalProducto.classList.add(
        "activo"
    );


    modalProducto.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModal() {

    modalProducto.classList.remove(
        "activo"
    );


    modalProducto.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


btnCerrarModal.addEventListener(
    "click",
    cerrarModal
);


modalFondo.addEventListener(
    "click",
    cerrarModal
);


/* =========================================================
   CERRAR MODAL CON ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modalProducto.classList.contains(
                "activo"
            )
        ) {

            cerrarModal();

        }

    }
);


/* =========================================================
   WHATSAPP
========================================================= */

function pedirWhatsApp(id) {

    const producto =
        productos.find(
            producto =>
                Number(producto.id) === Number(id)
        );


    if (!producto) {
        return;
    }


    const mensaje =

        `Hola, quisiera consultar por este producto:%0A%0A` +

        `🧴 ${producto.nombre}%0A` +

        `💰 Precio: Bs. ${formatearPrecio(producto.precio)}%0A` +

        `📦 ${producto.tipo || "No especificado"}%0A` +

        `🏷️ ${producto.familia || "No especificada"}%0A%0A` +

        (producto.imagen
            ? `🖼️ Ver imagen: ${producto.imagen}%0A%0A`
            : "") +

        `¿Podrían brindarme más información?`;


    const url =
        `https://wa.me/${WHATSAPP}?text=${mensaje}`;


    window.open(
        url,
        "_blank"
    );

}

/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(precio) {

    const numero =
        Number(precio);


    if (isNaN(numero)) {
        return "0";
    }


    return numero.toLocaleString(
        "es-BO",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   TEMA CLARO / OSCURO
========================================================= */

function cargarTema() {

    const temaGuardado =
        localStorage.getItem(
            "tema"
        );


    if (
        temaGuardado ===
        "oscuro"
    ) {

        document.body.classList.add(
            "tema-oscuro"
        );

        actualizarIconoTema(
            true
        );

    }

}


/* =========================================================
   CAMBIAR TEMA
========================================================= */

function cambiarTema() {

    const oscuro =
        document.body.classList.toggle(
            "tema-oscuro"
        );


    localStorage.setItem(
        "tema",
        oscuro
            ? "oscuro"
            : "claro"
    );


    actualizarIconoTema(
        oscuro
    );

}


/* =========================================================
   ICONO DEL TEMA
========================================================= */

function actualizarIconoTema(
    oscuro
) {

    if (!btnTema) {
        return;
    }


    btnTema.innerHTML = oscuro

        ? `<i class="fa-solid fa-sun"></i>`

        : `<i class="fa-solid fa-moon"></i>`;

}


btnTema.addEventListener(
    "click",
    cambiarTema
);


/* =========================================================
   INICIAR APLICACIÓN
========================================================= */

async function iniciarApp() {

    cargarTema();


    await Promise.all([

        cargarCategorias(),

        cargarProductos()

    ]);

}


/* =========================================================
   EJECUTAR
========================================================= */

iniciarApp();

