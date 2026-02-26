const cache = {};

const input = document.getElementById("pokemonInput");
const findBtn = document.getElementById("findBtn");
const addBtn = document.getElementById("addBtn");

const image = document.getElementById("pokemonImage");
const cry = document.getElementById("pokemonCry");

const moveDropdowns = [
    document.getElementById("move1"),
    document.getElementById("move2"),
    document.getElementById("move3"),
    document.getElementById("move4")
];

const teamList = document.getElementById("teamList");

let currentPokemon = null;

// FIND BUTTON
findBtn.addEventListener("click", async () => {
    const value = input.value.toLowerCase().trim();
    if (!value) return;

    if (cache[value]) {
        displayPokemon(cache[value]);
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
        if (!response.ok) throw new Error("Not found");

        const data = await response.json();

        cache[value] = data;
        displayPokemon(data);

    } catch (error) {
        alert("Pokemon not found.");
    }
});

// DISPLAY POKEMON
function displayPokemon(data) {
    currentPokemon = data;

    // Official artwork image
    image.src = data.sprites.other["official-artwork"].front_default;
    image.alt = data.name;

    // Cry audio
    const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`;
    cry.innerHTML = `<source src="${cryUrl}" type="audio/ogg">`;
    cry.load();

    // Load first 20 moves into dropdowns
    const moves = data.moves.slice(0, 20);

    moveDropdowns.forEach(dropdown => {
        dropdown.innerHTML = "";

        moves.forEach(move => {
            const option = document.createElement("option");
            option.value = move.move.name;
            option.textContent = move.move.name;
            dropdown.appendChild(option);
        });
    });
}

// ADD TO TEAM
addBtn.addEventListener("click", () => {
    if (!currentPokemon) return;

    const selectedMoves = moveDropdowns.map(drop => drop.value);

    const li = document.createElement("li");

    li.innerHTML = `
        <strong>${currentPokemon.name}</strong><br>
        Moves: ${selectedMoves.join(", ")}
    `;

    teamList.appendChild(li);
});