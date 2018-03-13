jQuery(document).ready(main)

function main() {
  var map = L.map('map', {}).setView([49.5, 16], 14);

  L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    atribution: 'Map data &copy; OSM.org'
  }).addTo(map);
}
