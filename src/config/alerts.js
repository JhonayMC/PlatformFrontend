import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    confirmButtonColor: '#002360',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

window.Swal = Swal.mixin({
  allowOutsideClick: false,
  allowEscapeKey: false,
  confirmButtonColor: '#002360',
  cancelButtonColor: '#858585',
})

window.Toast = Toast