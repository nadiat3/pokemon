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

findBtn.addEventListener("click", async () => {
    const value = input.value.toLowerCase().trim();
    if (!value) return;

    if (cache[value]) {
        displayPokemon(cache[value]);
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
        const data = await response.json();

        cache[value] = data;
        displayPokemon(data);
    } catch (error) {
        alert("Pokemon not found.");
    }
});

function displayPokemon(data) {
    currentPokemon = data;

    image.src = data.sprites.front_default;

    if (data.cries && data.cries.latest) {
        cry.src = data.cries.latest;
    }

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

addBtn.addEventListener("click", () => {
    if (!currentPokemon) return;

    const li = document.createElement("li");

    const selectedMoves = moveDropdowns.map(drop => drop.value);

    li.innerHTML = `
        <strong>${currentPokemon.name}</strong><br>
        Moves: ${selectedMoves.join(", ")}
    `;

    teamList.appendChild(li);
});