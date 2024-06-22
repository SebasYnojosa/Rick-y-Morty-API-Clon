var db;
const URL_API = "https://rickandmortyapi.com/api/character/";

function iniciarDB() {
    var solicitud = indexedDB.open("Personajes_Rick_And_Morty"); // Abre la base de datos

    solicitud.addEventListener("error", mostrarError);  // Se ejecuta cuando ocurre un error
    solicitud.addEventListener("success", comenzar);    // Se ejecuta cuando la base de datos se abre correctamente
    solicitud.addEventListener("upgradeneeded", crearAlmacen); // Se ejecuta cuando se crea la base de datos por primera vez
}

function mostrarError(e) {
    alert("Error: " + e.code + "/" + e.message);
}

function comenzar(e) {
    db = e.target.result;
    console.log("Base de datos abierta");
}

function crearAlmacen(e) {
    var baseDatos = e.target.result;
    baseDatos.createObjectStore("Personajes", { keyPath: "id" }); // Se crea el almacen de personajes

    guardarPersonajesDB(); // Guarda los personajes en la base de datos

    console.log("Base de datos creada");
}

// Guarda los personajes en la base de datos
async function guardarPersonajesDB() {
    try {
        var personajes = await recogerPersonajesAPI();
        var transaccion = db.transaction(["Personajes"], "readwrite");
        var almacen = transaccion.objectStore("Personajes");

        for (let i = 0; i < personajes.length; i++) {
            almacen.add(personajes[i]);
        }
    }
    catch (error) {
        console.log(error);
    }
}

// Saca los personajes de la api y los guarda en la base de datos
async function recogerPersonajesAPI() {
    try {
        // Recoge los personajes de la primera página y obtiene el numero de páginas
        personajes = await fetch(URL_API);
        personajes = await personajes.json();
        arregloPersonajes = personajes.results;

        // Recoge los personajes de las siguientes páginas
        for (let i = 2; i <= personajes.info.pages; i++) {
            personajes = await fetch(URL_API + `?page=${i}`);
            personajes = await personajes.json();
            arregloPersonajes = arregloPersonajes.concat(personajes.results);
        }
        
        return arregloPersonajes;
    } catch (error) {
        console.log(error); 
    }
}

// window.addEventListener("load", recogerPersonajesAPI);
window.addEventListener("load", iniciarDB);