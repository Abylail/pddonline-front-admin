<script>
export default {
  middleware({ redirect, store }) {

    if (store.getters['auth/isAdmin']) redirect("/admin/departments")
    else redirect("/gbr/requests");
  }
}
</script>
