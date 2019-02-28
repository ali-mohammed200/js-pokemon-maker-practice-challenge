document.addEventListener('DOMContentLoaded', () => {

  function getAllPokemon(){
    return fetch("http://localhost:3000/pokemon").then(function(response){return response.json()})
  }

  function deletePokemon(pokemondId){
    return fetch(`http://localhost:3000/pokemon/${pokemondId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response){ return response.json() })
  }

  function editPokemon(pokemondId, pokemon){
    return fetch(`http://localhost:3000/pokemon/${pokemondId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pokemon)
    }).then(function(response){ return response.json() })
  }


  function newPokemon(pokemon){
    return fetch(`http://localhost:3000/pokemon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pokemon)
    }).then(function(response){ return response.json() })
  }

  // newPokemon({name: "NEW POKE3", height: 10}).then(function(response){
  //   console.log(response)
  //
  // });
  // deletePokemon(209).then(function(response){return console.log(response)});

  // editPokemon(6, {name: "500"}).then(function(response){return console.log(response)});

  function makePokemonCards(pokemonArrayObj){
    let pokemonContainer = document.querySelector("#poke");
    pokemonArrayObj.forEach(pokeBuilder);
    pokemonContainer.addEventListener('click', handleClick);
  }

  function pokeBuilder(pokemonObj){
    let pokemonContainer = document.querySelector("#poke");
    let pokeDiv = document.createElement("div");
    pokeDiv.classList.add("pokemon-card");
    pokeDiv.dataset.pokeId = pokemonObj.id;


    let img = document.createElement('img');
    img.dataset.id = pokemonObj.id;
    img.dataset.action = "flip";
    img.classList.add("toggle-sprite");

    img.src = "";
    img.alt = "";

    if(pokemonObj.sprites){
      img.src = pokemonObj.sprites.front;
      img.alt = pokemonObj.sprites.back;
    }

    pokeDiv.innerHTML = `
    <div class="pokemon-frame">
    <h1 class="center-text">${pokemonObj.name}</h1>
    <div class="pokemon-image">
    <img data-id="${pokemonObj.id}" data-action="flip" class="toggle-sprite" src="${img.src}" alt="${img.alt}">
    </div>
    <div class="center-text">
    <button id="info">Info</button>
    <button id="edit">Edit</button>
    <button id="remove">Remove</button>
    </div>
    <div class="pokemon-info" style="display: none">
    ${pokeInfo(pokemonObj)}
    </div>
    <div id="editForm" style="display: none">
      ${makeForm(pokemonObj)}
    </div>
    </div>`;


    pokemonContainer.append(pokeDiv);
  }

  function makeForm(pokeObj){
    return `
    <form id=${pokeObj.id} class="center-text">
      <label for="name">Pokemon name:</label>
      <input type="text" id="name">
      <br>

      <label for="imageF">Pokemon Front Image URL:</label>
      <input type="text" id="imageF">
      <br>

      <label for="imageB">Pokemon Back Image URL:</label>
      <input type="text" id="imageB">
      <br>

      <label for="height">Height:</label>
      <input type="text" id="height">
      <br>

      <label for="weight">Weight:</label>
      <input type="text" id="weight">
      <br>

      <label for="moves">Moves:</label>
      <input type="text" id="moves">
      <br>

      <label for="stats">Stats:</label>
      <input type="text" id="stats">
      <br>

      <label for="types">Types:</label>
      <input type="text" id="types">
      <br>

      <label for="abilities">Abilities:</label>
      <input type="text" id="abilities">
      <br>

      <input type="submit">Submit</input>
    </form>`;
  }

  function pokeInfo(pokemonObj){
    let keys = Object.keys(pokemonObj);

    let abilities = "None";
    if(keys.includes("abilities")){
      abilities = pokemonObj.abilities.map(function(ability){
        return `<li>${ability}</li>`
      }).join(" ");
    }

    let moves = "None";
    if(keys.includes("moves")){
      moves = pokemonObj.moves.map(function(move){
        return `<li>${move}</li>`
      }).join(" ");
    }

    let stats = "None";
    if(keys.includes("stats")){
      stats = pokemonObj.stats.map(function(stat){
        return `<li>${stat.name}: ${stat.value}</li>`
      }).join(" ");
    }

    let types = "None";
    if(keys.includes("types")){
      types = pokemonObj.types.map(function(type){
        return `<li>${type}</li>`
      }).join(" ");
    }

    let height = "None";
    if(keys.includes("height")){
      height = pokemonObj.height;
    }

    let weight = "None";
    if(keys.includes("weight")){
      weight = pokemonObj.weight;
    }

    return `
      <ul>
        <li>Height: ${height}</li>
        <li>Weight: ${weight}</li>
        <li>abilities: <ul>${abilities}</ul></li>
        <li>moves: <ul>${moves}</ul></li>
        <li>stats: <ul>${stats}</ul></li>
        <li>types: <ul>${types}</ul></li>
      </ul>`;
  }

  function handleClick(event){
    // Flips image
    if (event.target.tagName == 'IMG'){
      console.log("in image");
      let src = event.target.alt;
      let alt = event.target.src;
      event.target.src = src;
      event.target.alt = alt;
    }

    // Displays Info
    if (event.target.id == "info"){
      if (event.target.parentElement.nextElementSibling.style.display === "none"){
        event.target.parentElement.nextElementSibling.style.display = "block";
      } else {
        event.target.parentElement.nextElementSibling.style.display = "none"
      }
    }

    if (event.target.id == "remove"){
      console.log(event.target);
      // the container => event.target.parentElement.parentElement.parentElement
      // the id => event.target.parentElement.parentElement.parentElement.dataset.pokeId
      let id = event.target.parentElement.parentElement.parentElement.dataset.pokeId;
      let container = event.target.parentElement.parentElement.parentElement;
      deletePokemon(id);
      container.remove();
    }

    if (event.target.id == "edit"){
      console.log("edit");
      // debugger
      let form = event.target.parentElement.parentElement.lastElementChild;
      if (form.style.display === "none"){
        form.style.display = "block";
      } else {
        form.style.display = "none"
      }
    }

  }


  let form = document.querySelector('form');
  form.addEventListener('submit', makeAPokemon)
  function makeAPokemon(event){
    event.preventDefault();
    let name;
    let imageF;
    let imageB;
    let height;
    let weight;
    let moves;
    let stats;
    let types;
    let abilities;

    createPokeObjFromForm(name, imageF, imageB, height, weight, moves, stats, types, abilities)
    console.log(event);
  }

  function createPokeObjFromForm(name, imageF, imageB, height, weight, moves, stats, types, abilities){
    return
  }

  getAllPokemon().then(function(response){return makePokemonCards(response)});

})
