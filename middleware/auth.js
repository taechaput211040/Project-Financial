export default function({ store, redirect }) {
  if (!store.state.key) {
    return redirect("/login");
  }
}
