const btnBuscar = document.getElementById('btn-buscar');
const inputBuscar = document.getElementById('buscar');
const resultado = document.getElementById('resultado');

async function obtenerPokemon(nombre) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
    if (!res.ok) throw new Error('Pokémon no encontrado');
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

function crearCarta(pokemon) {
  const tipos = pokemon.types.map(t => t.type.name);
  return `
    <div class="pokemon-card animate-popIn">
      <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
      <h2>${pokemon.name}</h2>
      <p><strong>Tipo:</strong> ${tipos.join(', ')}</p>
      <p><strong>Altura:</strong> ${(pokemon.height / 10).toFixed(2)} m</p>
      <p><strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(2)} kg</p>
      <button id="btn-agregar" class="btn-agregar">Agregar a guardados</button>
    </div>
  `;
}

btnBuscar.addEventListener('click', buscarYMostrar);

inputBuscar.addEventListener('keypress', e => {
  if (e.key === 'Enter') buscarYMostrar();
});

async function buscarYMostrar() {
  const nombre = inputBuscar.value.trim();
  if (!nombre) {
    resultado.innerHTML = `<p class="empty-message">Escribe un nombre válido, campeón 🥋</p>`;
    return;
  }
  resultado.innerHTML = `<p class="empty-message">Buscando a ${nombre}... 🕵️‍♂️</p>`;

  const pokemon = await obtenerPokemon(nombre);
  if (!pokemon) {
    resultado.innerHTML = `<p class="empty-message">No encontré a ${nombre}. ¿Será que huyó? 🏃‍♂️💨</p>`;
    return;
  }

  resultado.innerHTML = crearCarta(pokemon);

  document.getElementById('btn-agregar').addEventListener('click', () => {
    agregarAGuardados({
      nombre: pokemon.name,
      tipos: pokemon.types.map(t => t.type.name),
      altura: pokemon.height,
      peso: pokemon.weight,
      imagen: pokemon.sprites.other['official-artwork'].front_default,
    });
  });
}

function agregarAGuardados(pokemon) {
  let guardados = JSON.parse(localStorage.getItem('guardados')) || [];

  if (guardados.find(p => p.nombre === pokemon.nombre)) {
    alert(`Ya tienes a ${pokemon.nombre} guardado, no seas tramposo 😎`);
    return;
  }

  guardados.push(pokemon);
  localStorage.setItem('guardados', JSON.stringify(guardados));
  alert(`${pokemon.nombre} guardado con éxito! 🥳`);
}
