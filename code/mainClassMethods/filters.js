import { requestTourismEventsCodes } from "../api/events";

export async function getFilters() {
  this.listEventsTopics = await requestTourismEventsCodes();
}
