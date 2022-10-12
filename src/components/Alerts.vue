<script>
  export default {
    name: 'AppAlerts',
    methods: {
        showAlertAlert(text) {
        this.$swal({
            title: 'Atenção!',
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, tenho certeza.'
            })
        },
        showAlertSuccess(message) {
        this.$swal("Sucesso", message, "success");
        },
    },
  };
</script>