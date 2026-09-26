/* =========================================================
   ADMIN - FRAGANCIAS ELEGANTES
   SUPABASE AUTH + CRUD
   ========================================================= */

const ADMIN_EMAIL = "admin@fraganciaselegantes.com";

/* =========================================================
   ELEMENTOS
   ========================================================= */

const login = document.getElementById("login");
const panel = document.getElementById("panel");

const formLogin = document.getElementById("formLogin");
const passwordInput = document.getElementById("password");
const mostrarPassword = document.getElementById("mostrarPassword");
const errorLogin = document.getElementById("errorLogin");

const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnTemaAdmin = document.getElementById("btnTemaAdmin");

const totalProductos = document.getElementById("totalProductos");
const totalCategorias = document.getElementById("totalCategorias");

const tablaProductos = document.getElementById("tablaProductos");
const listaCategorias = document.getElementById("listaCategorias");

const buscarAdmin = document.getElementById("buscarAdmin");

const btnNuevoProducto = document.getElementById("btnNuevoProducto");
const btnNuevaCategoria = document.getElementById("btnNuevaCategoria");

const modalProductoAdmin =
    document.getElementById("modalProductoAdmin");

const modalCategoria =
    document.getElementById("modalCategoria");

const formProducto =
    document.getElementById("formProducto");

const formCategoria =
    document.getElementById("formCategoria");


/* =========================================================
   MODAL CONFIRMACIÓN
   ========================================================= */

const modalConfirmacion =
    document.getElementById("modalConfirmacion");

const confirmacionTipo =
    document.getElementById("confirmacionTipo");

const confirmacionTitulo =
    document.getElementById("confirmacionTitulo");

const confirmacionMensaje =
    document.getElementById("confirmacionMensaje");

const cancelarConfirmacionBtn =
    document.getElementById("cancelarConfirmacion");

const aceptarConfirmacionBtn =
    document.getElementById("aceptarConfirmacion");

let accionConfirmacion = null;


/* =========================================================
   NOTIFICACIÓN
   ========================================================= */

// ⭐ NUEVO

const notificacionAdmin =
    document.getElementById("notificacionAdmin");

const notificacionIcono =
    document.getElementById("notificacionIcono");

const notificacionTipo =
    document.getElementById("notificacionTipo");

const notificacionMensaje =
    document.getElementById("notificacionMensaje");

const cerrarNotificacionBtn =
    document.getElementById("cerrarNotificacion");

let temporizadorNotificacion = null;


/* =========================================================
   BOTONES DE CIERRE
   ========================================================= */

const cerrarModalProductoBtn =
    document.getElementById("cerrarModalProducto");

const cancelarProductoBtn =
    document.getElementById("cancelarProducto");

const cerrarModalCategoriaBtn =
    document.getElementById("cerrarModalCategoria");

const cancelarCategoriaBtn =
    document.getElementById("cancelarCategoria");


/* =========================================================
   CAMPOS PRODUCTO
   ========================================================= */

const productoId =
    document.getElementById("productoId");

const nombre =
    document.getElementById("nombre");

const precio =
    document.getElementById("precio");

const tipo =
    document.getElementById("tipo");

const categoria =
    document.getElementById("categoria");

const subcategoria =
    document.getElementById("subcategoria");

const familia =
    document.getElementById("familia");

const imagen =
    document.getElementById("imagen");

const archivoImagen =
    document.getElementById("archivoImagen");

const estadoImagen =
    document.getElementById("estadoImagen");

const vistaPreviaImagen =
    document.getElementById("vistaPreviaImagen");

const previewImagen =
    document.getElementById("previewImagen");

const descripcion =
    document.getElementById("descripcion");

const caracteristicas =
    document.getElementById("caracteristicas");

const ideal =
    document.getElementById("ideal");

const tituloModalProducto =
    document.getElementById("tituloModalProducto");


/* =========================================================
   CAMPOS CATEGORÍA
   ========================================================= */

const categoriaId =
    document.getElementById("categoriaId");

const nombreCategoria =
    document.getElementById("nombreCategoria");

const slugCategoria =
    document.getElementById("slugCategoria");

const tituloModalCategoria =
    document.getElementById("tituloModalCategoria");


/* =========================================================
   DATOS
   ========================================================= */

let productos = [];
let categorias = [];

let modoEdicionProducto = false;
let modoEdicionCategoria = false;


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    configurarTemaAdmin();

    configurarEventos();

    await verificarSesion();

});


/* =========================================================
   VERIFICAR SESIÓN SUPABASE
   ========================================================= */

async function verificarSesion() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (user) {

        mostrarPanel();

    } else {

        mostrarLogin();

    }

}


/* =========================================================
   MOSTRAR LOGIN
   ========================================================= */

function mostrarLogin() {

    if (login) {
        login.classList.remove("oculto");
    }

    if (panel) {
        panel.classList.add("oculto");
    }

}


/* =========================================================
   MOSTRAR PANEL
   ========================================================= */

async function mostrarPanel() {

    if (login) {
        login.classList.add("oculto");
    }

    if (panel) {
        panel.classList.remove("oculto");
    }

    await cargarTodo();

}


/* =========================================================
   LOGIN
   ========================================================= */

if (formLogin) {

    formLogin.addEventListener("submit", async (e) => {

        e.preventDefault();

        const password =
            passwordInput.value.trim();

        if (!password) {

            errorLogin.textContent =
                "Ingresa tu contraseña.";

            return;
        }

        errorLogin.textContent =
            "Iniciando sesión...";

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({
                email: ADMIN_EMAIL,
                password: password
            });

        if (error) {

            console.error(
                "Error de login:",
                error
            );

            errorLogin.textContent =
                "Correo o contraseña incorrectos.";

            passwordInput.value = "";

            return;
        }

        if (!data.user) {

            errorLogin.textContent =
                "No se pudo iniciar la sesión.";

            return;
        }

        errorLogin.textContent = "";

        passwordInput.value = "";

        await mostrarPanel();

    });

}


/* =========================================================
   MOSTRAR / OCULTAR PASSWORD
   ========================================================= */

if (mostrarPassword) {

    mostrarPassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            mostrarPassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            passwordInput.type = "password";

            mostrarPassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    });

}


/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async () => {

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Error cerrando sesión:",
                    error
                );

                return;
            }

            mostrarLogin();

        }
    );

}


/* =========================================================
   CONFIGURAR EVENTOS
   ========================================================= */

function configurarEventos() {

    /* =====================================================
       NUEVO PRODUCTO
       ===================================================== */

    if (btnNuevoProducto) {

        btnNuevoProducto.addEventListener(
            "click",
            abrirModalProducto
        );

    }


    /* =====================================================
       NUEVA CATEGORÍA
       ===================================================== */

    if (btnNuevaCategoria) {

        btnNuevaCategoria.addEventListener(
            "click",
            abrirModalCategoria
        );

    }


    /* =====================================================
       GUARDAR PRODUCTO
       ===================================================== */

    if (formProducto) {

        formProducto.addEventListener(
            "submit",
            guardarProducto
        );

    }


    /* =====================================================
       GUARDAR CATEGORÍA
       ===================================================== */

    if (formCategoria) {

        formCategoria.addEventListener(
            "submit",
            guardarCategoria
        );

    }


    /* =====================================================
       SELECCIONAR IMAGEN
       ===================================================== */

    if (archivoImagen) {

        archivoImagen.addEventListener(
            "change",
            prepararImagen
        );

    }


    /* =====================================================
       BUSCAR PRODUCTO
       ===================================================== */

    if (buscarAdmin) {

        buscarAdmin.addEventListener(
            "input",
            renderizarProductosAdmin
        );

    }


    /* =====================================================
       CERRAR MODAL PRODUCTO - CANCELAR
       ===================================================== */

    if (cancelarProductoBtn) {

        cancelarProductoBtn.addEventListener(
            "click",
            cerrarModalProducto
        );

    }


    /* =====================================================
       CERRAR MODAL PRODUCTO - X
       ===================================================== */

    if (cerrarModalProductoBtn) {

        cerrarModalProductoBtn.addEventListener(
            "click",
            cerrarModalProducto
        );

    }


    /* =====================================================
       CERRAR MODAL CATEGORÍA - CANCELAR
       ===================================================== */

    if (cancelarCategoriaBtn) {

        cancelarCategoriaBtn.addEventListener(
            "click",
            cerrarModalCategoria
        );

    }


    /* =====================================================
       CERRAR MODAL CATEGORÍA - X
       ===================================================== */

    if (cerrarModalCategoriaBtn) {

        cerrarModalCategoriaBtn.addEventListener(
            "click",
            cerrarModalCategoria
        );

    }


    /* =====================================================
       CONFIRMACIÓN - CANCELAR
       ===================================================== */

    if (cancelarConfirmacionBtn) {

        cancelarConfirmacionBtn.addEventListener(
            "click",
            cerrarConfirmacion
        );

    }


    /* =====================================================
       CONFIRMACIÓN - ELIMINAR
       ===================================================== */

    if (aceptarConfirmacionBtn) {

        aceptarConfirmacionBtn.addEventListener(
            "click",
            async () => {

                if (!accionConfirmacion) return;

                const accion =
                    accionConfirmacion;

                accionConfirmacion = null;

                aceptarConfirmacionBtn.disabled = true;

                try {

                    await accion();

                } finally {

                    aceptarConfirmacionBtn.disabled = false;

                    cerrarConfirmacion();

                }

            }
        );

    }


    /* =====================================================
       NOTIFICACIÓN - CERRAR
       ===================================================== */

    // ⭐ NUEVO

    if (cerrarNotificacionBtn) {

        cerrarNotificacionBtn.addEventListener(
            "click",
            ocultarNotificacion
        );

    }


    /* =====================================================
       GENERAR SLUG AUTOMÁTICAMENTE
       ===================================================== */

    if (nombreCategoria) {

        nombreCategoria.addEventListener(
            "input",
            () => {

                if (!modoEdicionCategoria) {

                    slugCategoria.value =
                        generarSlug(
                            nombreCategoria.value
                        );

                }

            }
        );

    }


    /* =====================================================
       CERRAR AL HACER CLICK EN EL FONDO
       ===================================================== */

    document.addEventListener(
        "click",
        (e) => {

            if (
                e.target.classList.contains(
                    "modal-admin-fondo"
                )
            ) {

                cerrarModalProducto();
                cerrarModalCategoria();

            }


            if (
                e.target.classList.contains(
                    "modal-confirmacion-fondo"
                )
            ) {

                cerrarConfirmacion();

            }

        }
    );


    /* =====================================================
       BOTONES CON DATA-CERRAR-MODAL
       ===================================================== */

    const botonesCancelar =
        document.querySelectorAll(
            "[data-cerrar-modal]"
        );

    botonesCancelar.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    cerrarModalProducto();
                    cerrarModalCategoria();

                }
            );

        }
    );


    /* =====================================================
       PESTAÑAS
       ===================================================== */

    const pestanas =
        document.querySelectorAll(
            ".tab[data-tab]"
        );

    pestanas.forEach(
        (pestana) => {

            pestana.addEventListener(
                "click",
                () => {

                    cambiarPestana(
                        pestana.dataset.tab
                    );

                }
            );

        }
    );


    /* =====================================================
       ESCAPE PARA CERRAR MODALES
       ===================================================== */

    document.addEventListener(
        "keydown",
        (e) => {

            if (e.key !== "Escape") return;

            cerrarConfirmacion();
            cerrarModalProducto();
            cerrarModalCategoria();

        }
    );

}


/* =========================================================
   CARGAR TODO
   ========================================================= */

async function cargarTodo() {

    await Promise.all([
        cargarCategorias(),
        cargarProductos()
    ]);

    actualizarEstadisticas();

}


/* =========================================================
   CATEGORÍAS
   ========================================================= */

async function cargarCategorias() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("categorias")
            .select("*")
            .order("id", {
                ascending: true
            });

    if (error) {

        console.error(
            "Error cargando categorías:",
            error
        );

        mostrarError(
            "No se pudieron cargar las categorías."
        );

        return;

    }

    categorias = data || [];

    renderizarCategorias();

    llenarSelectCategorias();

}


/* =========================================================
   PRODUCTOS
   ========================================================= */

async function cargarProductos() {

    const {
        data,
        error
    } =
        await supabaseClient
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
            "Error cargando productos:",
            error
        );

        mostrarError(
            "No se pudieron cargar los productos."
        );

        return;

    }

    productos = data || [];

    renderizarProductosAdmin();

    actualizarEstadisticas();

}


/* =========================================================
   ESTADÍSTICAS
   ========================================================= */

function actualizarEstadisticas() {

    if (totalProductos) {

        totalProductos.textContent =
            productos.length;

    }

    if (totalCategorias) {

        totalCategorias.textContent =
            categorias.length;

    }

}


/* =========================================================
   RENDER PRODUCTOS
   ========================================================= */

function renderizarProductosAdmin() {

    if (!tablaProductos) return;

    const busqueda =
        (buscarAdmin?.value || "")
            .trim()
            .toLowerCase();

    const filtrados =
        productos.filter(
            (producto) => {

                const texto = [

                    producto.nombre,
                    producto.tipo,
                    producto.familia,
                    producto.subcategoria,
                    producto.descripcion,
                    producto.categorias?.nombre

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return texto.includes(
                    busqueda
                );

            }
        );


    if (filtrados.length === 0) {

        tablaProductos.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="sin-datos"
                >
                    No se encontraron productos.
                </td>
            </tr>
        `;

        return;
    }


    tablaProductos.innerHTML =
        filtrados.map(
            (producto) => {

                const imagenProducto =
                    producto.imagen ||
                    "imagenes/sin-imagen.jpg";

                return `
                    <tr>

                        <td>

                            <div
                                class="producto-admin"
                            >

                                <img
                                    src="${escaparHTML(
                                        imagenProducto
                                    )}"
                                    alt="${escaparHTML(
                                        producto.nombre
                                    )}"
                                    class="imagen-admin"
                                    onerror="
                                        this.src='imagenes/sin-imagen.jpg'
                                    "
                                >

                                <div>

                                    <strong>
                                        ${escaparHTML(
                                            producto.nombre
                                        )}
                                    </strong>

                                    <small>
                                        ${escaparHTML(
                                            producto.tipo || ""
                                        )}
                                    </small>

                                </div>

                            </div>

                        </td>

                        <td>
                            Bs.
                            ${Number(producto.precio).toLocaleString("es-BO", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2
                            })}
                        </td>

                        <td>
                            ${escaparHTML(
                                producto.categorias?.nombre ||
                                "Sin categoría"
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                producto.subcategoria ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                producto.familia ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${formatearFecha(
                                producto.creado_en
                            )}
                        </td>

                        <td>

                            <div
                                class="acciones-admin"
                            >

                                <button
                                    type="button"
                                    class="btn-editar"
                                    onclick="
                                        editarProducto(
                                            ${producto.id}
                                        )
                                    "
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-eliminar"
                                    onclick="
                                        eliminarProducto(
                                            ${producto.id}
                                        )
                                    "
                                >
                                    Eliminar
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }
        ).join("");

}


/* =========================================================
   RENDER CATEGORÍAS
   ========================================================= */

function renderizarCategorias() {

    if (!listaCategorias) return;

    if (categorias.length === 0) {

        listaCategorias.innerHTML = `
            <div class="sin-datos">
                No hay categorías registradas.
            </div>
        `;

        return;
    }


    listaCategorias.innerHTML =
        categorias.map(
            (cat) => {

                const cantidad =
                    productos.filter(
                        (producto) =>
                            producto.categoria_id === cat.id
                    ).length;

                return `

                    <div
                        class="categoria-admin"
                    >

                        <div
                            class="categoria-info"
                        >

                            <strong>
                                ${escaparHTML(
                                    cat.nombre
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    cat.slug
                                )}
                            </span>

                            <small>
                                ${cantidad}
                                producto(s)
                            </small>

                        </div>

                        <div
                            class="acciones-admin"
                        >

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="
                                    editarCategoria(
                                        ${cat.id}
                                    )
                                "
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                class="btn-eliminar"
                                onclick="
                                    eliminarCategoria(
                                        ${cat.id}
                                    )
                                "
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>
                `;

            }
        ).join("");

}


/* =========================================================
   SELECT CATEGORÍAS
   ========================================================= */

function llenarSelectCategorias() {

    if (!categoria) return;

    categoria.innerHTML = `

        <option value="">
            Selecciona una categoría
        </option>

    `;

    categorias.forEach(
        (cat) => {

            categoria.innerHTML += `
                <option
                    value="${cat.id}"
                >
                    ${escaparHTML(
                        cat.nombre
                    )}
                </option>
            `;

        }
    );

}


/* =========================================================
   NUEVO PRODUCTO
   ========================================================= */

function abrirModalProducto() {

    modoEdicionProducto = false;

    formProducto.reset();

    productoId.value = "";

    tituloModalProducto.textContent =
        "Nuevo producto";

    llenarSelectCategorias();

    if (vistaPreviaImagen) {
        vistaPreviaImagen.classList.add("oculto");
    }

    if (previewImagen) {
        previewImagen.src = "";
    }

    if (estadoImagen) {
        estadoImagen.textContent =
            "Puedes pegar una URL o seleccionar una imagen de tu galería.";
    }

    mostrarModal(
        modalProductoAdmin
    );

}


/* =========================================================
   EDITAR PRODUCTO
   ========================================================= */

window.editarProducto =
    function (id) {

        const producto =
            productos.find(
                (item) =>
                    item.id === id
            );

        if (!producto) return;

        modoEdicionProducto = true;

        productoId.value =
            producto.id;

        nombre.value =
            producto.nombre || "";

        precio.value =
            producto.precio || "";

        tipo.value =
            producto.tipo || "";

        categoria.value =
            producto.categoria_id || "";

        subcategoria.value =
            producto.subcategoria || "";

        familia.value =
            producto.familia || "";

        imagen.value =
            producto.imagen || "";


        if (producto.imagen) {

            if (previewImagen) {

                previewImagen.src =
                    producto.imagen;

            }

            if (vistaPreviaImagen) {

                vistaPreviaImagen.classList.remove(
                    "oculto"
                );

            }

            if (estadoImagen) {

                estadoImagen.textContent =
                    "Imagen actual del producto.";

            }

        } else {

            if (vistaPreviaImagen) {

                vistaPreviaImagen.classList.add(
                    "oculto"
                );

            }

        }


        descripcion.value =
            producto.descripcion || "";

        caracteristicas.value =
            producto.caracteristicas || "";

        ideal.value =
            producto.ideal || "";

        tituloModalProducto.textContent =
            "Editar producto";

        mostrarModal(
            modalProductoAdmin
        );

    };


/* =========================================================
   GUARDAR PRODUCTO
   ========================================================= */

async function guardarProducto(e) {

    e.preventDefault();

    let urlImagen =
        imagen.value.trim();


    /* =====================================================
       SUBIR IMAGEN
       ===================================================== */

    if (
        archivoImagen &&
        archivoImagen.files &&
        archivoImagen.files.length > 0
    ) {

        const archivo =
            archivoImagen.files[0];


        if (!archivo.type.startsWith("image/")) {

            mostrarError(
                "El archivo seleccionado no es una imagen."
            );

            return;
        }


        if (archivo.size > 5 * 1024 * 1024) {

            mostrarError(
                "La imagen no puede superar los 5 MB."
            );

            return;
        }


        estadoImagen.textContent =
            "Subiendo imagen...";


        try {

            const nombreArchivo =
                archivo.name
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9.]+/g,
                        "-"
                    );


            const nombreUnico =
                `perfumes/${Date.now()}-${nombreArchivo}`;


            const {
                error: errorSubida
            } =
                await supabaseClient
                    .storage
                    .from("imagenes")
                    .upload(
                        nombreUnico,
                        archivo,
                        {
                            cacheControl: "3600",
                            upsert: false
                        }
                    );


            if (errorSubida) {

                console.error(
                    "Error subiendo imagen:",
                    errorSubida
                );

                mostrarError(
                    "No se pudo subir la imagen."
                );

                estadoImagen.textContent =
                    "Error al subir la imagen.";

                return;
            }


            const {
                data: urlPublica
            } =
                supabaseClient
                    .storage
                    .from("imagenes")
                    .getPublicUrl(
                        nombreUnico
                    );


            urlImagen =
                urlPublica.publicUrl;


            imagen.value =
                urlImagen;


            estadoImagen.textContent =
                "✓ Imagen subida correctamente.";


        } catch (error) {

            console.error(
                "Error:",
                error
            );

            mostrarError(
                "Ocurrió un error al subir la imagen."
            );

            estadoImagen.textContent =
                "Error al subir la imagen.";

            return;
        }

    }


    /* =====================================================
       DATOS PRODUCTO
       ===================================================== */

    const datosProducto = {

        nombre:
            nombre.value.trim(),

        precio:
            Number(precio.value) || 0,

        tipo:
            tipo.value.trim(),

        categoria_id:
            categoria.value
                ? Number(categoria.value)
                : null,

        subcategoria:
            subcategoria.value.trim(),

        familia:
            familia.value.trim(),

        imagen:
            urlImagen,

        descripcion:
            descripcion.value.trim(),

        caracteristicas:
            caracteristicas.value.trim(),

        ideal:
            ideal.value.trim()

    };


    let resultado;


    /* =====================================================
       EDITAR
       ===================================================== */

    if (modoEdicionProducto) {

        resultado =
            await supabaseClient
                .from("productos")
                .update(
                    datosProducto
                )
                .eq(
                    "id",
                    Number(
                        productoId.value
                    )
                );

    }


    /* =====================================================
       NUEVO
       ===================================================== */

    else {

        resultado =
            await supabaseClient
                .from("productos")
                .insert([
                    datosProducto
                ]);

    }


    /* =====================================================
       ERROR
       ===================================================== */

    if (resultado.error) {

        console.error(
            resultado.error
        );

        mostrarError(
            resultado.error.message ||
            "No se pudo guardar el producto."
        );

        return;
    }


    /* =====================================================
       FINALIZAR
       ===================================================== */

    const estabaEditando =
        modoEdicionProducto;

    cerrarModalProducto();

    await cargarProductos();

    actualizarEstadisticas();

    mostrarExito(
        estabaEditando
            ? "Producto actualizado correctamente."
            : "Producto agregado correctamente."
    );

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

window.eliminarProducto =
    function (id) {

        const producto =
            productos.find(
                (item) =>
                    item.id === id
            );

        if (!producto) return;


        mostrarConfirmacion({

            tipo: "PRODUCTOS",

            titulo: "¿Eliminar producto?",

            mensaje:
                `Estás a punto de eliminar "${producto.nombre}". ` +
                `Esta acción no se puede deshacer.`,

            accion:
                () =>
                    eliminarProductoConfirmado(id)

        });

    };


/* =========================================================
   ELIMINAR PRODUCTO - CONFIRMADO
   ========================================================= */

async function eliminarProductoConfirmado(id) {

    const { error } =
        await supabaseClient
            .from("productos")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            error
        );

        mostrarError(
            error.message ||
            "No se pudo eliminar el producto."
        );

        return;
    }


    await cargarProductos();

    actualizarEstadisticas();

    mostrarExito(
        "Producto eliminado correctamente."
    );

}


/* =========================================================
   NUEVA CATEGORÍA
   ========================================================= */

function abrirModalCategoria() {

    modoEdicionCategoria = false;

    formCategoria.reset();

    categoriaId.value = "";

    tituloModalCategoria.textContent =
        "Nueva categoría";

    mostrarModal(
        modalCategoria
    );

}


/* =========================================================
   EDITAR CATEGORÍA
   ========================================================= */

window.editarCategoria =
    function (id) {

        const cat =
            categorias.find(
                (item) =>
                    item.id === id
            );

        if (!cat) return;

        modoEdicionCategoria = true;

        categoriaId.value =
            cat.id;

        nombreCategoria.value =
            cat.nombre || "";

        slugCategoria.value =
            cat.slug || "";

        tituloModalCategoria.textContent =
            "Editar categoría";

        mostrarModal(
            modalCategoria
        );

    };


/* =========================================================
   GUARDAR CATEGORÍA
   ========================================================= */

async function guardarCategoria(e) {

    e.preventDefault();


    const nombreValor =
        nombreCategoria.value.trim();

    if (!nombreValor) {

        mostrarError(
            "Ingresa el nombre de la categoría."
        );

        return;
    }


    const slugValor =
        slugCategoria.value.trim() ||
        generarSlug(
            nombreValor
        );


    const datosCategoria = {

        nombre:
            nombreValor,

        slug:
            slugValor

    };


    let resultado;


    /* =====================================================
       EDITAR
       ===================================================== */

    if (modoEdicionCategoria) {

        resultado =
            await supabaseClient
                .from("categorias")
                .update(
                    datosCategoria
                )
                .eq(
                    "id",
                    Number(
                        categoriaId.value
                    )
                );

    }


    /* =====================================================
       NUEVA
       ===================================================== */

    else {

        resultado =
            await supabaseClient
                .from("categorias")
                .insert([
                    datosCategoria
                ]);

    }


    /* =====================================================
       ERROR
       ===================================================== */

    if (resultado.error) {

        console.error(
            resultado.error
        );

        if (
            resultado.error.code ===
            "23505"
        ) {

            mostrarError(
                "Ese slug ya existe."
            );

        } else {

            mostrarError(
                resultado.error.message ||
                "No se pudo guardar la categoría."
            );

        }

        return;
    }


    /* =====================================================
       FINALIZAR
       ===================================================== */

    const estabaEditando =
        modoEdicionCategoria;

    cerrarModalCategoria();

    await cargarCategorias();

    actualizarEstadisticas();

    mostrarExito(
        estabaEditando
            ? "Categoría actualizada correctamente."
            : "Categoría creada correctamente."
    );

}


/* =========================================================
   ELIMINAR CATEGORÍA
   ========================================================= */

window.eliminarCategoria =
    function (id) {

        const cat =
            categorias.find(
                (item) =>
                    item.id === id
            );

        if (!cat) return;


        const cantidad =
            productos.filter(
                (producto) =>
                    producto.categoria_id === id
            ).length;


        let mensaje;


        if (cantidad > 0) {

            mensaje =
                `Estás a punto de eliminar "${cat.nombre}". ` +
                `Hay ${cantidad} producto(s) asociados. ` +
                `Estos quedarán sin categoría.`;

        } else {

            mensaje =
                `Estás a punto de eliminar "${cat.nombre}". ` +
                `Esta acción no se puede deshacer.`;

        }


        mostrarConfirmacion({

            tipo: "CATEGORÍAS",

            titulo: "¿Eliminar categoría?",

            mensaje: mensaje,

            accion:
                () =>
                    eliminarCategoriaConfirmada(id)

        });

    };


/* =========================================================
   ELIMINAR CATEGORÍA - CONFIRMADO
   ========================================================= */

async function eliminarCategoriaConfirmada(id) {

    const { error } =
        await supabaseClient
            .from("categorias")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            error
        );

        mostrarError(
            error.message ||
            "No se pudo eliminar la categoría."
        );

        return;
    }


    await cargarCategorias();

    await cargarProductos();

    actualizarEstadisticas();

    mostrarExito(
        "Categoría eliminada correctamente."
    );

}


/* =========================================================
   PESTAÑAS
   ========================================================= */

function cambiarPestana(tab) {

    /* =====================================================
       BOTONES
       ===================================================== */

    const botones =
        document.querySelectorAll(
            ".tab[data-tab]"
        );


    botones.forEach(
        (boton) => {

            boton.classList.toggle(
                "activa",
                boton.dataset.tab === tab
            );

        }
    );


    /* =====================================================
       CONTENIDOS
       ===================================================== */

    const contenidos =
        document.querySelectorAll(
            ".tab-contenido"
        );


    contenidos.forEach(
        (contenido) => {

            contenido.classList.toggle(
                "activa",
                contenido.id === `tab-${tab}`
            );

        }
    );

}


/* =========================================================
   MODALES
   ========================================================= */

function mostrarModal(modal) {

    if (!modal) return;

    modal.classList.add("activo");

    document.body.classList.add(
        "modal-abierto"
    );

}


function cerrarModalProducto() {

    if (!modalProductoAdmin) return;

    modalProductoAdmin.classList.remove(
        "activo"
    );

    document.body.classList.remove(
        "modal-abierto"
    );

}


function cerrarModalCategoria() {

    if (!modalCategoria) return;

    modalCategoria.classList.remove(
        "activo"
    );

    document.body.classList.remove(
        "modal-abierto"
    );

}


/* =========================================================
   MODAL CONFIRMACIÓN
   ========================================================= */

function mostrarConfirmacion({
    tipo,
    titulo,
    mensaje,
    accion
}) {

    if (!modalConfirmacion) return;


    if (confirmacionTipo) {

        confirmacionTipo.textContent =
            tipo;

    }


    if (confirmacionTitulo) {

        confirmacionTitulo.textContent =
            titulo;

    }


    if (confirmacionMensaje) {

        confirmacionMensaje.textContent =
            mensaje;

    }


    accionConfirmacion =
        accion;


    modalConfirmacion.classList.add(
        "activo"
    );


    document.body.classList.add(
        "modal-abierto"
    );

}


function cerrarConfirmacion() {

    if (!modalConfirmacion) return;


    modalConfirmacion.classList.remove(
        "activo"
    );


    document.body.classList.remove(
        "modal-abierto"
    );


    accionConfirmacion = null;

}


/* =========================================================
   SLUG
   ========================================================= */

function generarSlug(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");

}


/* =========================================================
   PRECIO
   ========================================================= */

function formatearPrecio(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "es-BO",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   FECHA
   ========================================================= */

function formatearFecha(fecha) {

    if (!fecha) return "-";


    const fechaObj =
        new Date(fecha);


    if (
        isNaN(
            fechaObj.getTime()
        )
    ) {

        return "-";

    }


    return fechaObj.toLocaleDateString(
        "es-BO",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escaparHTML(texto) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   MENSAJES
   ========================================================= */

// ⭐ MODIFICADO

function mostrarExito(mensaje) {

    mostrarNotificacion(
        mensaje,
        "ÉXITO",
        "exito"
    );

}


function mostrarError(mensaje) {

    mostrarNotificacion(
        mensaje,
        "ERROR",
        "error"
    );

}


/* =========================================================
   MOSTRAR NOTIFICACIÓN
   ========================================================= */

// ⭐ NUEVO

function mostrarNotificacion(
    mensaje,
    tipo = "ÉXITO",
    clase = "exito"
) {

    if (!notificacionAdmin) return;

    clearTimeout(
        temporizadorNotificacion
    );


    if (notificacionMensaje) {

        notificacionMensaje.textContent =
            mensaje;

    }


    if (notificacionTipo) {

        notificacionTipo.textContent =
            tipo;

    }


    notificacionAdmin.classList.remove(
        "error"
    );


    if (clase === "error") {

        notificacionAdmin.classList.add(
            "error"
        );


        if (notificacionIcono) {

            notificacionIcono.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>';

        }

    } else {

        if (notificacionIcono) {

            notificacionIcono.innerHTML =
                '<i class="fa-solid fa-check"></i>';

        }

    }


    notificacionAdmin.classList.add(
        "activa"
    );


    temporizadorNotificacion =
        setTimeout(
            ocultarNotificacion,
            3500
        );

}


/* =========================================================
   OCULTAR NOTIFICACIÓN
   ========================================================= */

// ⭐ NUEVO

function ocultarNotificacion() {

    if (!notificacionAdmin) return;


    notificacionAdmin.classList.remove(
        "activa"
    );


    clearTimeout(
        temporizadorNotificacion
    );


    temporizadorNotificacion = null;

}


/* =========================================================
   PREPARAR IMAGEN
   ========================================================= */

function prepararImagen() {

    if (
        !archivoImagen ||
        !archivoImagen.files ||
        archivoImagen.files.length === 0
    ) {

        return;

    }


    const archivo =
        archivoImagen.files[0];


    /* =====================================================
       VISTA PREVIA
       ===================================================== */

    if (
        previewImagen &&
        vistaPreviaImagen
    ) {

        const lector =
            new FileReader();


        lector.onload = function (e) {

            previewImagen.src =
                e.target.result;

            vistaPreviaImagen.classList.remove(
                "oculto"
            );

        };


        lector.readAsDataURL(
            archivo
        );

    }


    if (estadoImagen) {

        estadoImagen.textContent =
            `Imagen seleccionada: ${archivo.name}`;

    }

}


/* =========================================================
   TEMA CLARO / OSCURO
   ========================================================= */

function configurarTemaAdmin() {

    const temaGuardado =
        localStorage.getItem("tema");


    if (temaGuardado === "oscuro") {

        document.body.classList.add(
            "tema-oscuro"
        );

    } else {

        document.body.classList.remove(
            "tema-oscuro"
        );

    }


    actualizarIconoTemaAdmin();


    if (btnTemaAdmin) {

        btnTemaAdmin.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "tema-oscuro"
                );


                const tema =
                    document.body.classList.contains(
                        "tema-oscuro"
                    )
                        ? "oscuro"
                        : "claro";


                localStorage.setItem(
                    "tema",
                    tema
                );


                actualizarIconoTemaAdmin();

            }
        );

    }

}


/* =========================================================
   ICONO DEL TEMA
   ========================================================= */

function actualizarIconoTemaAdmin() {

    if (!btnTemaAdmin) return;


    const oscuro =
        document.body.classList.contains(
            "tema-oscuro"
        );


    btnTemaAdmin.textContent =
        oscuro ? "🌙" : "☀️";

}