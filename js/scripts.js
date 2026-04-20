const center = [25.5373, -103.5253];
const zoom = 17;

const dialog = document.querySelector(".popup");
const buttonCancel = document.querySelector(".button-cancel");
const placeName = document.querySelector(".place-name");
const buttonSave = document.querySelector(".button-save");
const inputLatitude = document.querySelector(".input-latitude");
const inputLongitud = document.querySelector(".input-longitud");
const betweenstreets = document.querySelector(".between-streets");

const title = document.querySelector("#title");
title.textContent = "Mapa Interactivo LerdoYork";

const SupaBaseURL = "https://axbvhvjsqrudwcjnsyuz.supabase.co";
const SupaBaseKey = "sb_publishable_yCpY-s4f_W684iZriNvMfg_tOZvNuad";

const db = window.supabase.createClient(SupaBaseURL, SupaBaseKey);

const map = L.map("map").setView(center, zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const mycustomeicon = L.icon({
  iconUrl: "assets/iconnieve.ico",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -40],
});

L.marker(center, { icon: mycustomeicon })
  .addTo(map)
  .bindPopup("Bienvenido a LerdoYork")
  .openPopup();

async function loadSavedIcons() {
  const { data, error } = await db.from("Coordinates").select("*");

  if (error) {
    console.error("Error cargando datos:", error);
    return;
  }

  data.forEach((element) => {
    L.marker([element.lat, element.lng], {
      icon: mycustomeicon,
    }).addTo(map).bindPopup(`
      <b>${element.placeName}</b><br>
      ${element.betweenstreets}
    `);
  });
}

loadSavedIcons();

buttonCancel.addEventListener("click", (e) => {
  e.preventDefault();
  dialog.close();
});

buttonSave.addEventListener("click", async (e) => {
  e.preventDefault();

  const lat = inputLatitude.value;
  const lng = inputLongitud.value;
  const pln = placeName.value;
  const bst = betweenstreets.value;

  const { error } = await db.from("Coordinates").insert([
    {
      lat: lat,
      lng: lng,
      placeName: pln,
      betweenstreets: bst,
    },
  ]);

  if (error) {
    console.error("Error guardando:", error);
    return;
  }

  L.marker([lat, lng], {
    icon: mycustomeicon,
  })
    .addTo(map)
    .bindPopup(`<b>${pln}</b><br>${bst}`)
    .openPopup();

  dialog.close();
});

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  inputLatitude.value = lat;
  inputLongitud.value = lng;

  dialog.showModal();
});
