import { html } from "lit-element";
import { t } from "../translations";
import { countFilters, STATE_DEFAULT_FILTERS } from "../utils";

export function render_filters() {
  let filtersNumber = countFilters(this.filters);

  return html` <div class="filters">
    <div class="header">
      <wc-sidemodal-header
        type="filter"
        .fTitle="${filtersNumber ? filtersNumber : ""} ${t["filters"][
          this.language
        ]}"
        .fCancelFiltersText="${t["cancelFilters"][this.language]}"
        .fCancelFiltersAction="${() => {
          this.filters = STATE_DEFAULT_FILTERS;
        }}"
        .closeModalAction="${() => {
          this.filtersOpen = false;
        }}"
      ></wc-sidemodal-header>
    </div>

    <div>
      <div>
        <p class="caption">${t["dates"][this.language].toUpperCase()}</p>
        <div class="filter__text_with_inputs">
          <span class="">${t["from"][this.language]}</span>
          <input
            type="date"
            .value="${this.filters.dateFrom}"
            @change="${(e) => {
              this.filters = { ...this.filters, dateFrom: e.target.value };
            }}"
          />
          <span class="">${t["to"][this.language]}</span>
          <input
            type="date"
            .value="${this.filters.dateTo}"
            @change="${(e) => {
              this.filters = { ...this.filters, dateTo: e.target.value };
            }}"
          />
        </div>
      </div>
    </div>

    <div>
      <div>
        <p class="caption">${t["searchRadius"][this.language].toUpperCase()}</p>
        <div style="margin: 16px;">
          <wc-dropdown
            .value="${{
              value: this.filters.radius,
              label: `${this.filters.radius} km`,
            }}"
            .options="${[
              { value: "0", label: "0 km" },
              { value: "5", label: "5 km" },
              { value: "10", label: "10 km" },
              { value: "15", label: "15 km" },
            ]}"
            .action="${({ value }) => {
              this.filters = { ...this.filters, radius: value };
            }}"
          ></wc-dropdown>
        </div>
      </div>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <p class="caption">${t["category"][this.language].toUpperCase()}</p>
      <div class="options_container">
        ${this.listEventsTopics.map((o) => {
          return html`
            <wc-checkbox
              .value="${this.filters.topic.includes(o.Bitmask)}"
              .action="${() => {
                if (this.filters.topic.includes(o.Bitmask)) {
                  this.filters = {
                    ...this.filters,
                    topic: this.filters.topic.filter((c) => c !== o.Bitmask),
                  };
                } else {
                  this.filters = {
                    ...this.filters,
                    topic: [...this.filters.topic, o.Bitmask],
                  };
                }
              }}"
              .label="${o.TypeDesc[this.language]}"
              .name="chx${o.TypeDesc[this.language]}"
            ></wc-checkbox>
          `;
        })}
      </div>
    </div>
  </div>`;
}
