import useUi from "./useUi";

const { alertMessage, toastMessage } = useUi();

export const handleError = (err:any) => {
  

  if (!err.response) {
    toastMessage('Please check your internet connection or wait until servers are back online.', 'danger');
  } else {
    if (
      err.response.data &&
      (err.response.statusText === 'Unauthorized' ||
        err.response.data === ' Unauthorized.')
    ) {
      // Unauthorized and log out
      const msg = err.response.data.message
        ? err.response.data.message
        : 'Unauthorized'

      showToaster(msg)

    
    } else if (err.response.data.errors) {
      // Show a notification per error
      const errors = JSON.parse(JSON.stringify(err.response.data.errors))
    //   for (const i in errors) {
    //     showAlert(errors[i][0])
    //   }
      showError(err.response.data.message)
      return errors;
    } else if (err.response.data.error) {
      if (typeof err.response.data.error == 'boolean') showError(err.response.data?.message)
      else showError(err.response.data.error)
    } else {
      showError(err.response.data.message)
    }
  }
}

export const showError = (error: any ) => {
  switch (error) {
    case 'These credentials do not match our records.':
      showToaster('errors.login_invalid_credentials')
      break
    

    default:
      showToaster(error)
      break
  }
}

export const showToaster = (msg:any) => {
    toastMessage(msg, 'danger')
}

export const showAlert = (msg:any) => {
    alertMessage("Error", msg)
}
