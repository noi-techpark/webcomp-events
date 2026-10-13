// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { requestEventCategoryTags } from "../api/events";
import { getTagLabel } from "../utils";

export async function getFilters() {
  const tags = await requestEventCategoryTags();
  const language = this.language || "en";
  this.listEventsTopics = [...tags].sort((a, b) =>
    getTagLabel(a, language).localeCompare(getTagLabel(b, language), language)
  );
}
