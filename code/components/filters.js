import { html } from "lit-element";
import iconChevronDown from "../assets/chevron-down.svg";
import iconChevronUp from "../assets/chevron-up.svg";
import { t } from "../translations";
import { countFilters, STATE_DEFAULT_FILTERS } from "../utils";

const renderChevron = (show) =>
  show
    ? html`<img src="${iconChevronUp}" alt="" />`
    : html`<img src="${iconChevronDown}" alt="" />`;

const editFilters = (filters, element, key) => {
  let newFilters = {};
  if (filters[key].includes(element[1])) {
    newFilters = {
      ...filters,
      [key]: filters[key].filter((c) => c !== element[1]),
    };
  } else {
    newFilters = {
      ...filters,
      [key]: [element[1]],
      // When , will be supperted in API use this line
      // [key]: [...filters[key], element[1]],
    };
  }
  return newFilters;
};

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
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption">${t["searchRadius"][this.language]}</p>
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
      <div>
        <p
          class="caption pointer"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              category: !this.filtersAccordionOpen["category"],
            };
          }}"
        >
          ${t["category"][this.language]}
          <span>${renderChevron(this.filtersAccordionOpen["category"])}</span>
        </p>
        ${this.filtersAccordionOpen["category"]
          ? html`<div class="options_container">
              ${this.categories.map((category) => {
                return html`<wc-checkbox
                  .value="${this.filters.categories.includes(category[1])}"
                  .action="${() => {
                    this.filters = editFilters(
                      this.filters,
                      category,
                      "categories"
                    );
                  }}"
                  .label="${category[0]}"
                  .name="availability"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
    <div class="filters__divider">
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p
          class="caption pointer"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              facilityCodesCreditCard: !this.filtersAccordionOpen[
                "facilityCodesCreditCard"
              ],
            };
          }}"
        >
          ${t["facilityCodesCreditCard"][this.language]}
          <span
            >${renderChevron(
              this.filtersAccordionOpen["facilityCodesCreditCard"]
            )}</span
          >
        </p>
        ${this.filtersAccordionOpen["facilityCodesCreditCard"]
          ? html`<div class="options_container">
              ${this.facilityCodesCreditCard.map((facility) => {
                return html`<wc-checkbox
                  .value="${this.filters.facilityCodesCreditCard.includes(
                    facility[1]
                  )}"
                  .action="${() => {
                    this.filters = editFilters(
                      this.filters,
                      facility,
                      "facilityCodesCreditCard"
                    );
                  }}"
                  .label="${facility[0]}"
                  .name="facilityCodesCreditCard"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
    <div class="filters__divider">
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p
          class="caption pointer"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              facilityCodesFeatures: !this.filtersAccordionOpen[
                "facilityCodesFeatures"
              ],
            };
          }}"
        >
          ${t["facilityCodesFeatures"][this.language]}
          <span
            >${renderChevron(
              this.filtersAccordionOpen["facilityCodesFeatures"]
            )}</span
          >
        </p>

        ${this.filtersAccordionOpen["facilityCodesFeatures"]
          ? html`<div class="options_container">
              ${this.facilityCodesFeatures.map((facility) => {
                return html`<wc-checkbox
                  .value="${this.filters.facilityCodesFeatures.includes(
                    facility[1]
                  )}"
                  .action="${() => {
                    this.filters = editFilters(
                      this.filters,
                      facility,
                      "facilityCodesFeatures"
                    );
                  }}"
                  .label="${facility[0]}"
                  .name="facilityCodesFeatures"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
    <div class="filters__divider">
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p
          class="caption pointer"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              facilityCodesQuality: !this.filtersAccordionOpen[
                "facilityCodesQuality"
              ],
            };
          }}"
        >
          ${t["facilityCodesQuality"][this.language]}
          <span
            >${renderChevron(
              this.filtersAccordionOpen["facilityCodesQuality"]
            )}</span
          >
        </p>

        ${this.filtersAccordionOpen["facilityCodesQuality"]
          ? html`<div class="options_container">
              ${this.facilityCodesQuality.map((facility) => {
                return html`<wc-checkbox
                  .value="${this.filters.facilityCodesQuality.includes(
                    facility[1]
                  )}"
                  .action="${() => {
                    this.filters = editFilters(
                      this.filters,
                      facility,
                      "facilityCodesQuality"
                    );
                  }}"
                  .label="${facility[0]}"
                  .name="facilityCodesQuality"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
    <div class="filters__divider">
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p
          class="caption pointer"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              facilityCodesCuisine: !this.filtersAccordionOpen[
                "facilityCodesCuisine"
              ],
            };
          }}"
        >
          ${t["facilityCodesCuisine"][this.language]}
          <span
            >${renderChevron(
              this.filtersAccordionOpen["facilityCodesCuisine"]
            )}</span
          >
        </p>

        ${this.filtersAccordionOpen["facilityCodesCuisine"]
          ? html`<div class="options_container">
              ${this.facilityCodesCuisine.map((facility) => {
                return html`<wc-checkbox
                  .value="${this.filters.facilityCodesCuisine.includes(
                    facility[1]
                  )}"
                  .action="${() => {
                    this.filters = editFilters(
                      this.filters,
                      facility,
                      "facilityCodesCuisine"
                    );
                  }}"
                  .label="${facility[0]}"
                  .name="facilityCodesCuisine"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
    <div class="filters__divider">
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p
          class="caption pointer"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              facilityCodesCeremony: !this.filtersAccordionOpen[
                "facilityCodesCeremony"
              ],
            };
          }}"
        >
          ${t["facilityCodesCeremony"][this.language]}
          <span
            >${renderChevron(
              this.filtersAccordionOpen["facilityCodesCeremony"]
            )}</span
          >
        </p>

        ${this.filtersAccordionOpen["facilityCodesCeremony"]
          ? html`<div class="options_container">
              ${this.facilityCodesCeremony.map((facility) => {
                return html`<wc-checkbox
                  .value="${this.filters.facilityCodesCeremony.includes(
                    facility[1]
                  )}"
                  .action="${() => {
                    this.filters = editFilters(
                      this.filters,
                      facility,
                      "facilityCodesCeremony"
                    );
                  }}"
                  .label="${facility[0]}"
                  .name="facilityCodesCeremony"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
  </div>`;
}
