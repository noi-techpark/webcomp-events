import dayjs from "dayjs";
import { html } from "lit-element";
import { SIDE_MODAL_ROW_TYPES } from "../shared_components/sideModalRow/sideModalRow";
import { t } from "../translations";

export function render_details() {
  const { Detail, Latitude, Longitude } = this.currentEvent;

  const { TopicRIDs, LocationInfo } = this.currentEvent;
  const { DateBegin, DateEnd } = this.currentEvent;
  const { ContactInfos, OrganizerInfos } = this.currentEvent;
  const { Title, BaseText } = Detail[this.language];
  // ContactInfos
  const { Address, City, CompanyName, CountryCode, CountryName } = ContactInfos[
    this.language
  ];
  const { Email, Faxnumber } = ContactInfos[this.language];
  const { Phonenumber, Url, ZipCode } = ContactInfos[this.language];

  const topicText = this.listEventsTopics.filter((topic) => {
    return topic.Id === TopicRIDs[0];
  })[0].TypeDesc[this.language];

  return html` <div class="details">
    <div class="header">
      <wc-sidemodal-header
        .type="title"
        .tTitle="${Title}"
        .tLinkedTagText="${topicText}"
        .tOptionalLink="${!this.disableParkingDirections
          ? {
              text: t["directions"][this.language],
              url: `http://www.google.com/maps/place/${Latitude},${Longitude}`,
            }
          : {
              text: "",
              url: "",
            }}"
        .closeModalAction="${() => {
          this.detailsOpen = false;
        }}"
      ></wc-sidemodal-header>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption space">
          ${t["information"][this.language].toUpperCase()}
        </p>
      </div>
      ${BaseText
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["description"][this.language]}"
            .text="${BaseText}"
          ></wc-sidemodal-row>`
        : null}
      ${LocationInfo.TvInfo.Name[this.language]
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["where"][this.language]}"
            .text="${LocationInfo.TvInfo.Name[this.language]}"
          ></wc-sidemodal-row>`
        : null}
    </div>

    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption space">${t["dates"][this.language].toUpperCase()}</p>
      </div>
      ${DateBegin
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.horizontal}"
            .title="${t["startDate"][this.language]}"
            .text="${dayjs(DateBegin).format("DD/MM/YYYY")}"
          ></wc-sidemodal-row>`
        : null}
      ${DateEnd
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.horizontal}"
            .title="${t["endDate"][this.language]}"
            .text="${dayjs(DateEnd).format("DD/MM/YYYY")}"
          ></wc-sidemodal-row>`
        : null}
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption space">
          ${t["informationOnTheOrganization"][this.language].toUpperCase()}
        </p>
      </div>
      ${OrganizerInfos[this.language].CompanyName
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["organizer"][this.language]}"
            .text="${OrganizerInfos[this.language].CompanyName}"
          ></wc-sidemodal-row>`
        : null}
      ${OrganizerInfos[this.language].Address ||
      OrganizerInfos[this.language].City ||
      OrganizerInfos[this.language].CountryName ||
      OrganizerInfos[this.language].CountryCode
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["address"][this.language]}"
            .text="${OrganizerInfos[this.language].Address ||
            ""} ${OrganizerInfos[this.language].City || ""} ${OrganizerInfos[
              this.language
            ].CountryName || ""} ${OrganizerInfos[this.language].CountryCode ||
            ""}"
          ></wc-sidemodal-row>`
        : null}
      ${OrganizerInfos[this.language].ZipCode
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["place"][this.language]}"
            .text="${OrganizerInfos[this.language].ZipCode}"
          ></wc-sidemodal-row>`
        : null}
      ${OrganizerInfos[this.language].Phonenumber ||
      OrganizerInfos[this.language].Faxnumber
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["telFax"][this.language]}"
            .text="${OrganizerInfos[this.language].Phonenumber ||
            "---"} / ${OrganizerInfos[this.language].Faxnumber || "---"}"
          ></wc-sidemodal-row>`
        : null}
      ${OrganizerInfos[this.language].Email
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["eMail"][this.language]}"
            .text="${OrganizerInfos[this.language].Email}"
          ></wc-sidemodal-row>`
        : null}
      ${OrganizerInfos[this.language].Url
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["web"][this.language]}"
            .text="${OrganizerInfos[this.language].Url}"
          ></wc-sidemodal-row>`
        : null}
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption space">
          ${t["contactInfo"][this.language].toUpperCase()}
        </p>
      </div>
      ${CompanyName
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["organizer"][this.language]}"
            .text="${CompanyName}"
          ></wc-sidemodal-row>`
        : null}
      ${Address || City || CountryName || CountryCode
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["address"][this.language]}"
            .text="${Address} ${City} ${CountryName} ${CountryCode}"
          ></wc-sidemodal-row>`
        : null}
      ${ZipCode
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["place"][this.language]}"
            .text="${ZipCode}"
          ></wc-sidemodal-row>`
        : null}
      ${Phonenumber || Faxnumber
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["telFax"][this.language]}"
            .text="${Phonenumber || "---"} / ${Faxnumber || "---"}"
          ></wc-sidemodal-row>`
        : null}
      ${Email
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["eMail"][this.language]}"
            .text="${Email}"
          ></wc-sidemodal-row>`
        : null}
      ${Url
        ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["web"][this.language]}"
            .text="${Url}"
          ></wc-sidemodal-row>`
        : null}
    </div>
  </div>`;
}

/* <div>
      <div>
        <p class="caption">${t["description"][this.language]}</p>
        <p class="">${BaseText}</p>
      </div>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["season"][this.language]}"
        .text="${OperationSchedule.map((o) => {
          return html`
            ${dayjs(o.Start).format("DD/MM/YYYY")} -
            ${dayjs(o.Stop).format("DD/MM/YYYY")} <br />
          `;
        })}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["category"][this.language]}"
        .text="${CategoryCodes.map((category, i) => {
          return html`${category.Shortname}${i !== CategoryCodes.length - 1
            ? ", "
            : ""} `;
        })}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p class="caption">${t["contactInfo"][this.language]}</p>
      </div>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["organization"][this.language]}"
        .text="${CompanyName}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["address"][this.language]}"
        .text="${Address} ${City} ${CountryName} ${CountryCode}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["place"][this.language]}"
        .text="${ZipCode}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["contactPerson"][this.language]}"
        .text="${Givenname} ${Surname}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["telFax"][this.language]}"
        .text="${Phonenumber || "---"} / ${Faxnumber || "---"}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["eMail"][this.language]}"
        .text="${Email}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["web"][this.language]}"
        .isUrl="${true}"
        .text="${Url}"
      ></wc-sidemodal-row>
    </div>
    <div>
      <wc-sidemodal-row
        .type="${SIDE_MODAL_ROW_TYPES.vertical}"
        .title="${t["facilities"][this.language]}"
        .text="${Facilities.map((facility, i) => {
          return html`${facility.Shortname}${i !== Facilities.length - 1
            ? ", "
            : ""} `;
        })}"
      ></wc-sidemodal-row>
    </div> */
