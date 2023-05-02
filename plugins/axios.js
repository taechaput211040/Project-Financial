export default function({ $axios, redirect, app, store }) {
  $axios.onRequest(config => {
    // console.log('Making request to ' , store.state.auth.key)

    config.headers.common["Authorization"] = `Bearer ${store.state.key}`;
  });

  $axios.onError(error => {
    if (error.response.status === 401) {
      // redirect("/login");
    }
  });
  $axios.onError(error => {
    if (error.response.status) {
      app.$swal({
        icon: "error",
        title: `${error.response.data.message}`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}
