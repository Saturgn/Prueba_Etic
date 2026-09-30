let showDataPokemon = [];
let pokemonTipos = [];
let keyDataPokemon = 0;

const IDIOMA = 'es';

// Nombre del Pokémon en la PokéAPI y su id de especie (para la descripción)
const POKEMON = [
    { nombre: 'chimchar', especie: 390 },
    { nombre: 'monferno', especie: 391 },
    { nombre: 'infernape', especie: 392 },
    { nombre: 'starly', especie: 396 },
    { nombre: 'staravia', especie: 397 },
    { nombre: 'staraptor', especie: 398 },
    { nombre: 'shinx', especie: 403 },
    { nombre: 'luxio', especie: 404 },
    { nombre: 'luxray', especie: 405 },
    { nombre: 'budew', especie: 406 },
    { nombre: 'roselia', especie: 315 },
    { nombre: 'roserade', especie: 407 },
    { nombre: 'wooper', especie: 194 },
    { nombre: 'quagsire', especie: 195 },
    { nombre: 'riolu', especie: 447 },
    { nombre: 'lucario', especie: 448 }
];

// La API devuelve los tipos en inglés: los traducimos al español
const TIPOS_ES = {
    fire: 'fuego',
    water: 'agua',
    ground: 'tierra',
    fighting: 'lucha',
    flying: 'volador',
    grass: 'planta',
    poison: 'veneno',
    electric: 'eléctrico',
    normal: 'normal',
    steel: 'acero'
};

window.onload = async function() {

    document.getElementById('left').addEventListener('click', handleLeft);
    document.getElementById('right').addEventListener('click', handleRight);
    document.getElementById('cerrar').addEventListener('click', cerrarPokedex);

    document.getElementById('title_Pokemon').innerHTML = 'Cargando...';

    try {
        // Todas las peticiones en paralelo en lugar de una detrás de otra
        let pokemonData = await Promise.all(POKEMON.map(p => getData('https://pokeapi.co/api/v2/pokemon/' + p.nombre)));
        let descData = await Promise.all(POKEMON.map(p => getData('https://pokeapi.co/api/v2/pokemon-species/' + p.especie)));

        for (let i = 0; i < pokemonData.length; i++) {

            let data = {};

            data.nombre = pokemonData[i].forms[0].name;
            data.imgFront = pokemonData[i].sprites.front_default;
            data.imgBack = pokemonData[i].sprites.back_default;
            data.altura = pokemonData[i].height;
            data.peso = pokemonData[i].weight;
            data.tipos = pokemonData[i].types;
            data.descripcion = obtenerDescripcion(descData[i]);

            showDataPokemon.push(data);
        }
    }
    catch (error) {
        console.error(error);
        document.getElementById('title_Pokemon').innerHTML = 'Error al cargar la Pokédex';
        document.getElementById('descripcion').innerHTML = 'No se han podido obtener los datos de la PokéAPI. Inténtalo de nuevo más tarde.';
        return;
    }

    mostrarPokemon(0);
}

// Antes se usaba una posición fija (flavor_text_entries[39]) y cada Pokémon
// tenía en esa posición un idioma distinto (coreano, francés, italiano...).
// Ahora se busca la última descripción que esté en español.
function obtenerDescripcion(especie) {

    let entradas = especie.flavor_text_entries.filter(e => e.language.name === IDIOMA);

    if (entradas.length === 0) {
        entradas = especie.flavor_text_entries.filter(e => e.language.name === 'en');
    }

    if (entradas.length === 0) {
        return '';
    }

    // Los textos traen saltos de línea y saltos de página (\f) de los juegos
    return entradas[entradas.length - 1].flavor_text.replace(/[\n\f\r]+/g, ' ');
}

function mostrarPokemon(index) {

    let pokemon = showDataPokemon[index];
    keyDataPokemon = index;

    document.getElementById('back').setAttribute('src', pokemon.imgBack);
    document.getElementById('front').setAttribute('src', pokemon.imgFront);
    document.getElementById('peso').innerHTML = parseFloat(pokemon.peso) / 10;
    document.getElementById('altura').innerHTML = parseFloat(pokemon.altura) / 10;
    document.getElementById('title_Pokemon').innerHTML = pokemon.nombre.toUpperCase();
    document.getElementById('descripcion').innerHTML = pokemon.descripcion;
    formatoTipos(pokemon.tipos);

    actualizarFlechas();
}

function actualizarFlechas() {

    let left = document.getElementById('left');
    let right = document.getElementById('right');

    if (keyDataPokemon === 0) {
        left.setAttribute('class', 'visibilityHidden');
    }
    else {
        left.setAttribute('class', 'isVisible arrows_size flechaI');
    }

    if (keyDataPokemon === showDataPokemon.length - 1) {
        right.setAttribute('class', 'visibilityHidden');
    }
    else {
        right.setAttribute('class', 'isVisible arrows_size flechaD');
    }
}

function formatoTipos(tipos) {

    for (let typeRemove of pokemonTipos) {
        typeRemove.remove();
    }

    let typesFormatted = [];

    for (let i = 0; i < tipos.length; i++) {

        let type = tipos[i].type.name;

        let span = document.createElement('span');
        span.setAttribute('class', type + ' lineHeight');
        span.appendChild(document.createTextNode(TIPOS_ES[type] || type));

        let br = document.createElement('br');

        document.getElementById('tipos').appendChild(span);
        document.getElementById('tipos').appendChild(br);
        typesFormatted.push(span, br);
    }

    pokemonTipos = typesFormatted;
}

function cerrarPokedex() {

    document.getElementById('screen').setAttribute('class', 'visibilityHidden');

    let abrirPokedex = document.createElement('button');
    abrirPokedex.setAttribute('id', 'abrirPokedex');
    abrirPokedex.setAttribute('class', 'abrirPokedex');
    abrirPokedex.addEventListener('click', handleAbrirPokedex);
    abrirPokedex.innerHTML = 'Abrir Pokédex';
    document.getElementById('abrirBoton').appendChild(abrirPokedex);
    document.getElementById('left').setAttribute('class', 'visibilityHidden');
    document.getElementById('right').setAttribute('class', 'visibilityHidden');
}

function handleAbrirPokedex() {

    document.getElementById('screen').setAttribute('class', 'isVisible color_blue height_screen grid_screen');
    document.getElementById('abrirPokedex').remove();

    if (showDataPokemon.length > 0) {
        actualizarFlechas();
    }
}

function handleLeft() {

    if (keyDataPokemon > 0) {
        mostrarPokemon(keyDataPokemon - 1);
    }
}

function handleRight() {

    if (keyDataPokemon < showDataPokemon.length - 1) {
        mostrarPokemon(keyDataPokemon + 1);
    }
}

async function getData(endpoint) {

    let result = await fetch(endpoint);

    if (!result.ok) {
        throw new Error('Error ' + result.status + ' al pedir ' + endpoint);
    }

    return await result.json();
}
