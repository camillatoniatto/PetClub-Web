const ShowAlertAlert = {
  Alert(text) {
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
}

const ShowAlertSuccess = {
  Alert(message) {
    this.$swal("Sucesso", message, "success");
  },
}

const Alerts = {
  ShowAlertAlert,
  ShowAlertSuccess
}

export default Alerts;