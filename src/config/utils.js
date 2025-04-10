import { nextTick } from 'vue'
import languageDT  from '@/assets/language/Spanish.json'
import store from '@/config/store'
import storeOption from '@/config/store/options'
import moment from 'moment'
import 'moment/dist/locale/es'
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

moment.locale('es')


const Util = {
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    indexToOne(array) {
        let format = [];
        array.forEach((e, i) => {
            format[i + 1] = array[i];
        })
        return format;
    },
    load(load) {
        if (load) {
            $('.load-overlay').addClass('open')
        } else {
            $('.load-overlay').removeClass('open')
        }
    },
    cargando(count) {
        storeOption.dispatch('cargando', count)
    },
    process(load) {
        let timerInterval
        let alert = Swal.fire({
            title: 'Procesando',
            html: 'Te recomendamos no cerrar, ni actualizar la página mientras la información no termine de procesarse.',
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
        if (!load) {
            clearInterval(timerInterval)
            alert.close()
        }
    },
    processResult(res) {
        let icon = (!res) ? 'error' : 'success'
        let title = (!res) ? '¡Oops, se ha encontrado errores en el proceso!' : '¡Se ha terminado el proceso con exito!'
        let text = (!res) ? 'No se ha podido terminar de procesar la información.' : 'La información se ha procesado sin ningún error.'
    
        setTimeout(() => {
            Swal.fire({
                icon: icon,
                title: title,
                text: text,
                allowOutsideClick: false,
                showCconfirmButton: true,
                showCancelButton: false,
                timerProgressBar: false,
            })
        }, 1)
    },
    resetDataTable(name, options) {
        $(name).DataTable().destroy()
        nextTick(() => {            
            options.language = languageDT
            options.lengthMenu = [
                [10, 15, 25, 50, 100, 500, 1000, -1],
                [10, 15, 25, 50, 100, 500, 1000, 'Todos']
            ]
            options.dom = (options.dom) ? options.dom : 't<"bottom">lip<"clear">'
            options.pageLength = (options.pageLength) ? options.pageLength: 10
            $(name).DataTable(options)
        })
    },
    resetDataTable2(name, columnas, filtros, link) {
        $(name).DataTable().destroy()
        return $(name).DataTable({
            ajax: function (data, callback, settings) {
                Util.cargando(1)
                filtros.order = data.order.map(o => (
                    data.columns[o.column].name + '-' + o.dir
                ))[0]

                ac.get(link, { params: filtros })
                    .then((response) => {
                        if(!response) return
                        callback({
                            recordsTotal: response.data.total,
                            recordsFiltered: response.data.total,
                            data: response.data.data
                        })
                    }).catch((err) => {
                        if (err.response) {
                            switch (err.response.status) {
                                case 401:
                                    return Util.logoutExpired()
                                case 429:
                                    return Util.againBlock()
                                case 403:
                                    return Util.forbidden()
                                default:
                                    break;
                            }
                        } else {
                            return Util.errorServer()
                        }
                    })
                    .finally(() => {
                        Util.cargando(-1)
                    })
            },
            language: languageDT,
            processing: true,
            serverSide: true,
            orderable: false,
            order: [],
            searching: false,
            dom: 't<"bottom">lip<"clear">',
            lengthMenu: [
                [5, 10, 15, 20, 25],
                [5, 10, 15, 20, 25]
            ],
            columns: columnas
        })
    },
    logoutExpired() {
        Swal.fire({
            title: 'Tu sesión ha expirado!',
            text: "¡Lamentamos mucho esto, por favor inicia sesión nuevamente!.",
            showCancelButton: false,
            confirmButtonColor: '#000',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                this.limpiarCarga()
                store.dispatch('logout')
            }
        })
    },
    againBlock() {
        let timerInterval
        Swal.fire({
        title: '¡Has intentado muchas veces!',
        html: 'Espera <b></b> segundos para reestablecer conexión.',
        timer: 30000,
        timerProgressBar: true,
        allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = (parseInt(Swal.getTimerLeft() / 1000))
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
    },
    forbidden() {
        Swal.fire({
            title: 'Permisos insuficientes.',
            text: "Lamentamos mucho este suceso, por seguridad se cerrará la sesión.",
            showCancelButton: false,
            confirmButtonColor: '#000',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                this.cargando(1)
                store.dispatch('logout').finally(() => this.cargando(-1))
            }
        })
    },
    errorServer() {
        Swal.fire({
            title: 'Error de Conexión.',
            text: "Por favor comunicate con sistemas.",
            showCancelButton: false,
            confirmButtonColor: '#000',
            allowOutsideClick: false,
        })
    },
    startTooltip() {
        setTimeout(() => {
            let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            }) 
        }, 500)
    },
    notify(message) {
        Toast.fire({html: message, position: 'top-start',timer: 3500, timerProgressBar: false,})
    },
    downloadArchivo(nombre, response) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = nombre
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    },
    uuid() {
        return uuidv4()
    },
    limpiarCarga() {
        storeOption.dispatch('limpiarCarga')
    },
    descargarReporte(nombre, data) {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Datos')
        const firstRow = data[0]
        worksheet.columns = Object.keys(firstRow).map(key => ({
            header: key.charAt(0).toUpperCase() + key.slice(1),
            key: key,
            width: 10
        }))
        data.forEach(row => worksheet.addRow(row));
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            saveAs(blob, nombre)
        })
    },
    confirmar(
        title = '¿Estás seguro?',
        text = 'Una vez registrado no podrá modificar la información'
    ) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Seguro',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
        }).then((result) => {
            return result.isConfirmed
        })
    },
}

const Format = (type, value) => {
    switch (type) {
        case 'digits':
            return value.replace(/[^\d]/g, '')
            break;
        case 'letters':
            return value.replace(/[^a-zA-Z ]/g, '')
            break;
        default:
            return value
            break;
    }
}

window.Util = Util
window.Format = Format
window.Formato = Format
