var currentList;
var list = document.getElementById('ul-list');
var next = document.getElementById('arrow-right')
var previous = document.getElementById('arrow-left')
var info = document.getElementById('info')

next.addEventListener('click', function () {
  if (currentList.next) {
    renderCharackterList(currentList.next);
  }
})
previous.addEventListener('click', function () {
  if (currentList.previous) {
    renderCharackterList(currentList.previous);
  }
})


renderCharackterList('https://swapi.dev/api/people/');


function addActions() {
  [...document.getElementsByClassName('list-item')].forEach 
  ((el) => {
    el.addEventListener('click', function () {
      if (currentList.results[this.dataset.id]) {
        getCharackterDetails(currentList.results[this.dataset.id]).then(function (res) {
          info.innerHTML = getBodyDetailsHtml(res)
        })
      }
    })
  } )
}

function getBodyHtml(user, id) {
  return `<li class="list-item" data-id="${id}">${user.name}</li>`
}

function getBodyDetailsHtml(user) {
  return `<li class="info-list">
								Имя: ${user.name}
					</li>
					<li class="info-list">
								Дата рождения: ${user.birth_year}
					</li>
					<li class="info-list">
								Гендер: ${user.gender}
					</li>
					<li class="info-list">
								Фильмы: ${user.filmsDetails.map(e => e.title).join(', ')}
					</li>
					<li class="info-list">
								Планета: ${user.planetDetails.name}
					</li>
					<li class="info-list">
								Расса: ${user.speciesDetails.map(e => e.name).join(', ')}
					</li>`
}

function getRequest(url) {
  return new Promise(function (resolve, reject) {
    fetch(url).then(function(response) {
        response.json().then(function(resp) {
          resolve(resp);
      });
    });
  })
}

function renderCharackterList(source) {
  getRequest(source).then(function (res) {
    currentList = res;
    list.innerHTML = res.results.map(getBodyHtml).join('');
    next.style.display = 'none';
    previous.style.display = 'none';
    if (res.next) {
      next.style.display = 'block';
    }
    if (res.previous) {
      previous.style.display = 'block';
    }
    addActions()
  })
}

async function getCharackterDetails(user) {
  return {
    ...user,
    filmsDetails: await Promise.all(user.films.map(getRequest)),
    planetDetails: await getRequest(user.homeworld),
    speciesDetails: await Promise.all(user.species.map(getRequest))
  }
}




