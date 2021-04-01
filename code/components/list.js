import { html } from "lit-element";
import { requestTourismEventDetails } from "../api/events";
import { t } from "../translations";
import dayjs from "dayjs";
import { getTranslatedObject } from "../utils";

function renderRow(Detail, DateBegin, DateEnd, LocationInfo, Id) {
  const details = getTranslatedObject(this.language, Detail);

  console.log(typeof DateBegin, typeof DateEnd);

  return html`<div class="events__list_content_row">
    <div>${details.Title || "No title"}</div>
    <div>${DateBegin ? dayjs(DateBegin).format("DD/MM/YYYY") : "--"}</div>
    <div>${DateEnd ? dayjs(DateEnd).format("DD/MM/YYYY") : "--"}</div>
    <div>${LocationInfo.TvInfo.Name[this.language]}</div>
    <div>
      <p
        @click="${() => {
          requestTourismEventDetails({ Id: Id }).then((details) => {
            if (details) {
              this.currentEvent = {
                ...details,
              };
            }
            this.filtersOpen = false;
            this.detailsOpen = true;
          });
        }}"
        class="link"
      >
        ${t["details"][this.language]}
      </p>
    </div>
  </div>`;
}

export function render__list() {
  if (!this.listEvents) {
    return null;
  }
  const { Items, TotalPages, CurrentPage, Id } = this.listEvents;

  console.log(this.listEvents);

  return html`
    <div class="events__list">
      <div class="events__list_content">
        <div><h3>${t[`events`][this.language]}</h3></div>
        <div class="events__list_content_row header">
          <div>${t[`shortname`][this.language].toUpperCase()}</div>
          <div>${t[`startDate`][this.language].toUpperCase()}</div>
          <div>${t[`endDate`][this.language].toUpperCase()}</div>
          <div>${t[`location`][this.language].toUpperCase()}</div>
          <div>${t[`actions`][this.language].toUpperCase()}</div>
        </div>
        ${Items
          ? Items.map(({ Detail, DateBegin, DateEnd, LocationInfo, Id }) => {
              return renderRow.bind(this)(
                Detail,
                DateBegin,
                DateEnd,
                LocationInfo,
                Id
              );
            })
          : null}
      </div>
    </div>
    <div class="events__list__pagination">
      <wc-button
        type="primary"
        content="${t[`prev`][this.language]}"
        @click="${() => {
          if (CurrentPage > 1) {
            this.listEventsCurrentPage = this.listEventsCurrentPage - 1;
          }
        }}"
      ></wc-button>
      <p>${CurrentPage} / ${TotalPages}</p>
      <wc-button
        type="primary"
        content="${t[`next`][this.language]}"
        @click="${() => {
          if (CurrentPage < TotalPages) {
            this.listEventsCurrentPage = this.listEventsCurrentPage + 1;
          }
        }}"
      ></wc-button>
    </div>
  `;
}
