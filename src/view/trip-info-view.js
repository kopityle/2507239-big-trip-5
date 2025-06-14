import AbstractView from '../framework/view/abstract-view.js';
import { escapeHtml } from '../utils.js';

const createTripInfoTemplate = (title, dates, totalCost) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${escapeHtml(title)}</h1>
      <p class="trip-info__dates">${escapeHtml(dates)}</p>
    </div>
    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${escapeHtml(totalCost)}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #title = null;
  #dates = null;
  #totalCost = null;

  constructor({title, dates, totalCost}) {
    super();
    this.#title = title;
    this.#dates = dates;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate(this.#title, this.#dates, this.#totalCost);
  }
}
