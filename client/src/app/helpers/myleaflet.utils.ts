import * as L from "leaflet";
import {latLng} from "leaflet";
import {Event} from "../models/event.model";

export class MyleafletUtils {

  static makeCustomMarker(x: number, y: number): L.Marker {
    let coords = latLng([y, x]);

    return L.marker(coords, {
      icon: this.makeCustomIcon()
    });
  }

  static makeCustomIcon() {
    return new L.Icon({
      iconUrl: 'assets/map-icon-4.png',
      iconSize: [48, 48], // size of the icon
      iconAnchor: [25, 45], // align marker position
      popupAnchor: [-2, -25] // point from which the popup should open relative to the iconAnchor
    })
  }
  static makeEventPopupHtml(marker: L.Marker, event: Event) {
    let htmlTitle = `<a class="event-popup-title" href="/events/${event._id}">${event.title}</a>`;
    let htmlAddress = `<span class="event-popup-address">${event.location.address}</span>`
    let popupHtml = `${htmlTitle} <br> ${htmlAddress}`
    return popupHtml;
  }
}
