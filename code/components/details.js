import dayjs from "dayjs";
import { html } from "lit-element";
import { SIDE_MODAL_ROW_TYPES } from "../shared_components/sideModalRow/sideModalRow";
import { t } from "../translations";
import { getTranslatedObject } from "../utils";

export function render_details() {
  const { Detail, Latitude, Longitude } = this.currentEvent;

  const { TopicRIDs, LocationInfo } = this.currentEvent;
  const { DateBegin, DateEnd } = this.currentEvent;
  const details = getTranslatedObject(this.language, Detail);

  const handledOrganizerInfos = getTranslatedObject(
    this.language,
    this.currentEvent.OrganizerInfos
  );

  const handledContactInfos = getTranslatedObject(
    this.language,
    this.currentEvent.ContactInfos
  );
  const {
    Address,
    City,
    CompanyName,
    CountryCode,
    CountryName,
  } = handledContactInfos;

  const { Email, Faxnumber } = handledContactInfos;
  const { Phonenumber, Url, ZipCode } = handledContactInfos;

  let topicText = "";
  if (TopicRIDs != null) { // to fix problem with reduced data from Open Data Hub
    const topics = this.listEventsTopics.filter((topic) => {
      return topic.Id === TopicRIDs[0];
    })[0];
    if (topics) {
      topicText = topics.TypeDesc[this.language];
    }
  }

  return html` <div class="details">
    <div class="header">
      <wc-sidemodal-header
        .type="title"
        .tTitle="${details.Title || "No title"}"
        .tLinkedTagText="${topicText}"
        .tOptionalLink="${!this.disableEventDirections
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
      ${details.BaseText
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["description"][this.language]}"
            .text="${details.BaseText || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${LocationInfo.TvInfo.Name[this.language]
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["where"][this.language]}"
            .text="${LocationInfo.TvInfo.Name[this.language] || "---"}"
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
      ${handledOrganizerInfos.CompanyName
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["organizer"][this.language]}"
            .text="${handledOrganizerInfos.CompanyName || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${handledOrganizerInfos.Address ||
      handledOrganizerInfos.City ||
      handledOrganizerInfos.CountryName ||
      handledOrganizerInfos.CountryCode
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["address"][this.language]}"
            .text="${handledOrganizerInfos.Address ||
        ""} ${handledOrganizerInfos.City ||
        ""} ${handledOrganizerInfos.CountryName ||
        ""} ${handledOrganizerInfos.CountryCode || ""}"
          ></wc-sidemodal-row>`
      : null}
      ${handledOrganizerInfos.ZipCode
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["place"][this.language]}"
            .text="${handledOrganizerInfos.ZipCode || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${handledOrganizerInfos.Phonenumber || handledOrganizerInfos.Faxnumber
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["telFax"][this.language]}"
            .text="${handledOrganizerInfos.Phonenumber ||
        "---"} / ${handledOrganizerInfos.Faxnumber || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${handledOrganizerInfos.Email
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["eMail"][this.language]}"
            .text="${handledOrganizerInfos.Email || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${handledOrganizerInfos.Url
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["web"][this.language]}"
            .text="${handledOrganizerInfos.Url || "---"}"
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
            .text="${CompanyName || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${Address || City || CountryName || CountryCode
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["address"][this.language]}"
            .text="${Address || ""} ${City || ""} ${CountryName ||
        ""} ${CountryCode || ""}"
          ></wc-sidemodal-row>`
      : null}
      ${ZipCode
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["place"][this.language]}"
            .text="${ZipCode || "---"}"
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
            .text="${Email || "---"}"
          ></wc-sidemodal-row>`
      : null}
      ${Url
      ? html`<wc-sidemodal-row
            .type="${SIDE_MODAL_ROW_TYPES.vertical}"
            .title="${t["web"][this.language]}"
            .text="${Url || "---"}"
          ></wc-sidemodal-row>`
      : null}
    </div>
  </div>`;
}
