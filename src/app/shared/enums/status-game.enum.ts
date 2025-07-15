export enum Status {
  InProgress = 1,
  Dropped = 2,
  Finished = 3,
  Platinum = 4,
  Replaying = 5,
  Backlog = 6,
  Paused = 7,
}

export const StatusLabels: { [key in Status]: string } = {
  [Status.InProgress]: 'Jogando',
  [Status.Dropped]: 'Dropado',
  [Status.Finished]: 'Zerado',
  [Status.Platinum]: 'Platinado',
  [Status.Replaying]: 'Rejogando',
  [Status.Backlog]: 'Backlog',
  [Status.Paused]: 'Pausado',
};
