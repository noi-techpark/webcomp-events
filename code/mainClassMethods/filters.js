// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { requestTourismEventsCodes } from "../api/events";

export async function getFilters() {
  this.listEventsTopics = await requestTourismEventsCodes();
}
