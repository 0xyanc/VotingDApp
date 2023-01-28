export const BUTTON_START_PROPOSALS_REGISTERING = "Start Proposals Registering"
export const BUTTON_END_PROPOSALS_REGISTERING = "End Proposals Registering"
export const BUTTON_START_VOTING_SESSION = "Start Voting Session"
export const BUTTON_END_VOTING_SESSION = "End Voting Session"
export const BUTTON_TALLY_VOTES = "Tally Votes"

export const STATUS_REGISTERING_VOTERS = "Registering Voters"
export const STATUS_PROPOSALS_REGISTRATION_STARTED = "Proposals Registration Started"
export const STATUS_PROPOSALS_REGISTRATION_ENDED = "Proposals Registration Ended"
export const STATUS_VOTING_SESSION_STARTED = "Voting Session Started"
export const STATUS_VOTING_SESSION_ENDED = "Voting Session Ended"
export const STATUS_VOTES_TALLIED = "Votes Tallied"

const statusMap = new Map();
statusMap.set(0, STATUS_REGISTERING_VOTERS)
statusMap.set(1, STATUS_PROPOSALS_REGISTRATION_STARTED)
statusMap.set(2, STATUS_PROPOSALS_REGISTRATION_ENDED)
statusMap.set(3, STATUS_VOTING_SESSION_STARTED)
statusMap.set(4, STATUS_VOTING_SESSION_ENDED)
statusMap.set(5, STATUS_VOTES_TALLIED)
export { statusMap };