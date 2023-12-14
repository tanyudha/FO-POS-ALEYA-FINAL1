const isJwtExpired = (error: any) => {
  const errMessage =
    error.response?.data?.error?.message || error.response?.data?.message
  return errMessage === 'jwt expired'
}

export default function ({ $axios, redirect, $toast, $auth }: any) {
  $axios.onError((error: any) => {
    if (isJwtExpired(error)) {
      $toast.show(
        'Sesi anda telah berakhir, anda akan kembali ke halaman login'
      )
      $auth.logout()
      setTimeout(() => {
        redirect('/login')
      }, 2000)
    }
  })
}
