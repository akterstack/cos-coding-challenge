export enum AuctionState {
  DRAFT = 1, // Not sure about the state value, just started from 1 to make ACTIVE = 2
  ACTIVE,
  CLOSED_WAITING_FOR_PAYMENT,
  CLOSED_WAITING_FOR_PICKUP,
  FINISHED,
  CLOSED_NO_BIDS,
  CLOSED_UNDER_MINIMUM_ASK,
  DISABLED,
}
