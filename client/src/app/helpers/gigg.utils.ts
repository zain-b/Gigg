import * as L from "leaflet";
import {latLng} from "leaflet";
import {Event} from "../models/event.model";

export class GiggUtils {

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

  /* Split objects e.g. events, stories into groups of 3 for presentation purposes, take into account whether max events to
   * show is provided.
   */
  static splitObjectsIntoGroupsOfX(objects, groupSize, objectsToShow) {
    let groups = [[]];

    if (objects.length <= groupSize) {
      groups[0] = objects;
      return groups;
    }

    let numGroups;

    /**
     * If we're restricting the number of objects to show then we need to calculate the number of groups based
     * on how many we're planning to show. Otherwise just make groups based on all objects.
     */
    if (objectsToShow) {
      numGroups = Math.ceil(objectsToShow / groupSize);
    } else {
      numGroups = Math.ceil(objects.length / groupSize);
    }

    for (let i = 0; i < numGroups; i++) {
      let currentGroupStart = i * groupSize;
      let currentGroupEnd = currentGroupStart + groupSize;

      if (objectsToShow && currentGroupEnd > objectsToShow) {

        groups[i] = objects.slice(currentGroupStart, objectsToShow);
      } else {
        groups[i] = objects.slice(currentGroupStart, currentGroupEnd);
      }
    }

    return groups;
  }
}
