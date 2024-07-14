export const EDIT_PROFILE = "EDIT_PROFILE"
export const PROFILE_SUCCESS = "PROFILE_SUCCESS"
export const PROFILE_ERROR = "PROFILE_ERROR"
export const RESET_PROFILE_FLAG = "RESET_PROFILE_FLAG"

export const fetchProfileRequest = () => ({
  type: FETCH_PROFILE_REQUEST,
})

export const fetchProfileSuccess = profile => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: profile,
})

export const fetchProfileFailure = error => ({
  type: FETCH_PROFILE_FAILURE,
  payload: error,
})
