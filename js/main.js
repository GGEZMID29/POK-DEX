const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const searchInput = document.querySelector("#searchInput");
let URL = "https://pokeapi.co/api/v2/pokemon/";

let pokemones = [];

// Hacer fetch de todos los Pokémon y esperar a que se completen todas las promesas
Promise.all(
    Array.from({ length: 151 }, (_, i) =>
        fetch(URL + (i + 1)).then(response => response.json())
    )
).then(data => {
    pokemones = data;
    mostrarPokemones(pokemones);
});

function mostrarPokemones(pokemones) {
    listaPokemon.innerHTML = ""; // Limpiar lista anterior

    // Ordenar por ID para que estén en orden
    pokemones.sort((a, b) => a.id - b.id);

    pokemones.forEach(poke => mostrarPokemon(poke));
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// Escuchar los cambios en el campo de búsqueda
searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    // Filtrar por nombre o número
    const pokemonesFiltrados = pokemones.filter(poke => {
        const pokeName = poke.name.toLowerCase();
        const pokeId = poke.id.toString();
        return pokeName.includes(searchTerm) || pokeId.includes(searchTerm);
    });

    // Mostrar los Pokémon filtrados
    mostrarPokemones(pokemonesFiltrados);
});

// Manejo de botones
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = ""; // Limpiar la lista actual

    if (botonId === "ver-todos") {
        mostrarPokemones(pokemones); // Mostrar todos los Pokémon
    } else {
        const pokemonesFiltrados = pokemones.filter(poke =>
            poke.types.some(type => type.type.name.includes(botonId))
        );
        mostrarPokemones(pokemonesFiltrados); // Mostrar Pokémon filtrados por tipo
    }
}));
