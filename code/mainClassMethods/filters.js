// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { requestEventCategoryTags } from "../api/events";

export async function getFilters() {
  this.listEventsTopics = await requestEventCategoryTags();
}
