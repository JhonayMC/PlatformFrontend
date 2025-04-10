const Formato = (type, val) => {
    switch (type) {
        case 'digitos':
            return val.toString().replace(/[^\d]/g, '').substr(0, 25)
        case 'decimales':
            if (!val) return ''
            val = val.toString().replace(/[^0-9.]/g, '')
            const parts = val.split('.')
            if (parts.length > 2) {
                val = parts[0] + '.' + parts.slice(1).join('')
            }
            return val.substr(0, 25)
            break;
        case 'orden':
            return val.toString().replace(/[^\d]/g, '').substr(0,3)
            break;
        case 'dni':
            return val.toString().replace(/[^\d]/g, '').substr(0,8)
            break;
        case 'ruc':
            return val.toString().replace(/[^\d]/g, '').substr(0,11)
            break;
        case 'usuario':
            return val.toString().replace(/[^a-zA-Z0-9_]/g, '').toUpperCase().substr(0,15)
            break;
        case 'licencia':
            return val.toString().replace(/[^a-zA-Z0-9]+/g, '').toUpperCase().substr(0,25)
            break;
        case 'nombre':
            return val.toString().replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ ]/g, '').toUpperCase().substr(0,50)
            break;
        case 'desc':
            return val.toString().replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ ]/g, '').toUpperCase().substr(0,250)
            break;
        case 'correo':
            if (!val) return ''
            return val.toString().replace(/[^a-zA-Z0-9._%+-@]/g, '').toUpperCase().substr(0,50)
            break;
        case 'icono':
            return val.toString().replace(/[^a-zA-Z -]/g, '').substr(0,30)
            break;
        case 'empresa':
            return val.toString().toUpperCase().replace(/[^A-Z -.]/g, '').substr(0,50)
            break;
        case 'celular': 
            if (!val) return ''
            val = val.toString().replace(/[^0-9+]/g, '')
            val = (val.includes('+')) ? '+' + val.replace(/\+/g, '') : val
            return val.toUpperCase().substr(0,20)
        default:
            return val.toString().substr(0,250)
            break;
    }
}

export default Formato